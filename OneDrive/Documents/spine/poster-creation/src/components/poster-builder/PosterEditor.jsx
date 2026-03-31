import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import KonvaCanvas from './KonvaCanvas';
import BottomBar from './BottomBar';

// ─── Constants ────────────────────────────────────────────────────────────────
const API_URI =
  'https://api-proxy-316410120671.us-central1.run.app/background-remover-api/proxy/remove-bg';
const DEFAULT_USER_PROPS = { scale: 0.5, position: { x: 220, y: 180 } };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a dataURL to a Blob synchronously.
 * Kept sync intentionally so it runs inside the same user-gesture frame
 * required by navigator.share() on mobile browsers.
 */
const dataURLtoBlobSync = (dataUrl) => {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const bstr = atob(data);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new Blob([u8arr], { type: mime });
};

/**
 * Stable 4-digit code derived from a string.
 * Used to build shareable links.
 */
const getStableCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash).toString().substring(0, 4).padStart(4, '0');
};

/**
 * Builds the share link + WhatsApp message.
 * Returns both parts separately so callers can use them independently.
 */
const buildShareContent = (templateId) => {
  const docId = templateId || `generated_${Date.now()}`;
  const code = getStableCode(docId);
  const BASE_URL = import.meta.env.VITE_APP_URL || window.location.origin;
  const shareLink = `${BASE_URL}/poster/${docId}-${code}`;

  // WhatsApp Mobile Sharing: 
  // Native share combines 'text' and 'url' into the image caption.
  const text =
    `Make Your Own Status\n\n` +
    `സ്ഥാനാർത്ഥിയെ പിന്തുക്കുന്ന പോസ്റ്ററിൽ നിങ്ങളുടെ ഫോട്ടോ ആഡ് ചെയ്യുവാനും ` +
    `അത് നിങ്ങൾക്ക് ഷെയർ ചെയ്യുവാനും സാധിക്കും. ` +
    `അത് നിങ്ങൾക്ക് ഇൻ്റർനെറ്റിൽ ഷെയർ ചെയ്യാം.`;

  return { shareLink, text };
};

/**
 * Hides the Konva Transformer, captures the stage as a compressed JPEG Blob,
 * then restores the Transformer. Returns the Blob.
 *
 * @param {import('konva/lib/Stage').Stage} stage - Konva stage instance
 * @param {number} pixelRatio - High density for quality
 * @param {number} quality - JPEG compression (0.0 to 1.0)
 * @returns {Blob}
 */
const captureStage = (stage, pixelRatio = 2.7, quality = 0.85) => {
  const tr = stage.findOne('Transformer');
  if (tr) {
    tr.hide();
    const layer = tr.getLayer();
    if (layer) layer.draw();
  }

  try {
    // 400px * 2.7 = 1080px (User's requested "Best resolution")
    // JPEG at 0.85 quality ensures we stay within the 200KB - 1MB range.
    const dataUrl = stage.toDataURL({
      pixelRatio,
      mimeType: 'image/jpeg',
      quality
    });
    const blob = dataURLtoBlobSync(dataUrl);
    if (!blob || blob.size === 0) throw new Error('captureStage: empty blob');
    return blob;
  } finally {
    if (tr) {
      tr.show();
      const layer = tr.getLayer();
      if (layer) layer.draw();
    }
  }
};

/**
 * Programmatically downloads a Blob as a PNG file.
 */
const downloadBlob = (blob, filename = `poster_${Date.now()}.png`) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Delay revoke so the download has time to start
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};

// ─── Status helper ────────────────────────────────────────────────────────────
// Using a typed status object avoids brittle string-matching for styling.
const makeStatus = (message, type = 'info') => ({ message, type });
// type: 'success' | 'error' | 'info'

// ─── Component ────────────────────────────────────────────────────────────────
const PosterEditor = () => {
  const location = useLocation();
  const templateId = location.state?.templateId ?? null;

  const [userImgUrl, setUserImgUrl] = useState(location.state?.imageUrl ?? null);
  const [selectedId, setSelectedId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null); // { message, type }
  const [userProps, setUserProps] = useState(DEFAULT_USER_PROPS);

  const stageRef = useRef(null);
  // Track all blob URLs we create so we can revoke them on unmount / replacement
  const blobUrlsRef = useRef([]);
  // Track pending status-clear timer so we can cancel it on unmount
  const statusTimerRef = useRef(null);

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const trackBlobUrl = (url) => {
    blobUrlsRef.current.push(url);
    return url;
  };

  const showStatus = useCallback((message, type = 'info', autoClearMs = 3500) => {
    setStatus(makeStatus(message, type));
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    if (autoClearMs > 0) {
      statusTimerRef.current = setTimeout(() => setStatus(null), autoClearMs);
    }
  }, []);

  // ── Background removal ──────────────────────────────────────────────────────
  /**
   * Accepts either a URL (http/https/blob) or null.
   * - Fetches the image as a blob (handles CORS & ensures freshness).
   * - Sends to the background-removal proxy.
   * - Updates userImgUrl with a fresh blob URL and tracks it for cleanup.
   *
   * NOTE: If the current userImgUrl is already a blob URL pointing to a
   * processed image, fetching it again is safe — the browser can fetch its
   * own blob: URLs.
   */
  const handleRemoveBg = useCallback(async (imageUrl) => {
    if (!imageUrl) {
      showStatus('No image to process.', 'error');
      return;
    }

    setIsProcessing(true);
    showStatus('Preparing image…', 'info', 0); // 0 = don't auto-clear

    try {
      const fetchRes = await fetch(imageUrl);
      if (!fetchRes.ok) throw new Error(`Fetch failed: ${fetchRes.status}`);
      const inputBlob = await fetchRes.blob();

      showStatus('Removing background…', 'info', 0);

      const formData = new FormData();
      formData.append('file', inputBlob, 'input.png');

      const apiRes = await fetch(API_URI, { method: 'POST', body: formData });

      let resultUrl;
      if (apiRes.ok) {
        const resultBlob = await apiRes.blob();
        resultUrl = trackBlobUrl(URL.createObjectURL(resultBlob));
        showStatus('Background removed!', 'success');
      } else {
        // Graceful fallback: use original image
        resultUrl = trackBlobUrl(URL.createObjectURL(inputBlob));
        showStatus('Removal failed — using original.', 'error');
      }

      setUserImgUrl(resultUrl);
    } catch (err) {
      console.error('BG removal error:', err);
      showStatus('Processing error. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [showStatus]);

  // Run BG removal once on mount if an image was passed in
  useEffect(() => {
    if (userImgUrl) {
      handleRemoveBg(userImgUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentional: run only on mount

  // ── Export (download) ───────────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    if (!stageRef.current) return;

    showStatus('Preparing export…', 'info', 0);
    setSelectedId(null);

    try {
      // 3x ratio (1200px) + 0.9 quality = high quality, efficient size
      const blob = captureStage(stageRef.current, 3, 0.9);
      downloadBlob(blob, `poster_${Date.now()}.jpg`);
      showStatus('Downloaded!', 'success');
    } catch (err) {
      console.error('Export failed:', err);
      showStatus('Export failed. Please try again.', 'error');
    }
  }, [showStatus]);

  // ── Share (Native Web Share API + WhatsApp fallback) ────────────────────────
  /**
   * WhatsApp sharing strategy:
   *
   * 1. PRIMARY — navigator.share({ files, text })
   *    Shares the PNG image + text + link in a single native sheet.
   *    Works on Android Chrome and iOS Safari (iOS 15+).
   *    The text payload already contains the link so WhatsApp shows it as a
   *    preview card alongside the image.
   *
   * 2. FALLBACK A — wa.me deep link
   *    If the browser doesn't support file sharing, open WhatsApp with the
   *    text+link only, then auto-download the PNG so the user can forward it
   *    manually.
   *
   * 3. FALLBACK B — plain download
   *    If everything else fails, just download the PNG.
   *
   * Important: captureStage() + dataURLtoBlobSync() must stay synchronous
   * and run BEFORE any await, so the browser considers the share() call to
   * still be inside the original user-gesture frame (required on iOS/Android).
   */
  const handleShare = useCallback(async () => {
    if (!stageRef.current) return;

    showStatus('Preparing…', 'info', 0);
    setSelectedId(null);

    // ── 1. Capture synchronously (must happen before any await) ──
    let blob;
    try {
      // 2.7x ratio (1080px) + 0.85 quality results in optimized size (~300KB-600KB)
      blob = captureStage(stageRef.current, 2.7, 0.85);
    } catch (err) {
      console.error('Stage capture failed:', err);
      showStatus('Could not capture poster.', 'error');
      return;
    }

    const { text, shareLink } = buildShareContent(templateId);
    const file = new File([blob], 'poster.jpg', { type: 'image/jpeg' });

    // ── 2. Try native share (image + text + link together) ──
    // This is the ONLY way to send image+caption+link combined on mobile.
    const shareData = {
      title: 'My Custom Poster',
      text: `${text}\n\n👉 ${shareLink}`, // Fallback text for apps that ignore 'url'
      url: shareLink,
      files: [file]
    };

    if (
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        showStatus('Shared successfully!', 'success');
        return;
      } catch (err) {
        if (err.name === 'AbortError') {
          showStatus('Share cancelled.', 'info');
          return;
        }
        console.warn('navigator.share failed, falling back:', err);
      }
    }

    // ── 3. Fallback: Manual WhatsApp attachment ──
    // If native share is unsupported (Desktop/Old browsers), we open WhatsApp 
    // with the link and simultaneously provide the image for manual attachment.
    try {
      const fullMsg = `${text}\n\n👉 ${shareLink}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(fullMsg)}`, '_blank');
      downloadBlob(blob, `poster_${Date.now()}.jpg`);
      showStatus('Opened WhatsApp — image saved for you to attach.', 'info');
    } catch (err) {
      console.error('Fallback failed:', err);
      downloadBlob(blob, `poster_${Date.now()}.jpg`);
      showStatus('Image downloaded.', 'info');
    }
  }, [showStatus, templateId]);


  // ── User image transform handlers ──────────────────────────────────────────
  const handleUserDrag = useCallback(
    (pos) => setUserProps((p) => ({ ...p, position: pos })),
    []
  );

  const handleUserTransform = useCallback(
    (scaleX) => !isNaN(scaleX) && setUserProps((p) => ({ ...p, scale: scaleX })),
    []
  );

  const handleZoomChange = useCallback(
    (newScale) => !isNaN(newScale) && setUserProps((p) => ({ ...p, scale: newScale })),
    []
  );

  const handleReset = useCallback(() => setUserProps(DEFAULT_USER_PROPS), []);

  // ── Render ──────────────────────────────────────────────────────────────────
  const statusColorClass =
    status?.type === 'success'
      ? 'bg-emerald-50 border-emerald-100/50 text-emerald-700 shadow-emerald-100/20'
      : status?.type === 'error'
        ? 'bg-rose-50 border-rose-100/50 text-rose-700 shadow-rose-100/20'
        : 'bg-indigo-50 border-indigo-100/50 text-indigo-700 shadow-indigo-100/20';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pb-40 font-sans selection:bg-indigo-100">

      {/* Header */}
      <header className="w-full bg-[#fdf5fd] py-5 shadow-sm text-center mb-6 z-10 sticky top-0 border-b border-indigo-50/50">
        <h1 className="text-[22px] font-black text-indigo-950 tracking-tight px-4 uppercase">
          എഡിറ്റർ പോസ്റ്റർ
        </h1>
      </header>

      {/* Workspace */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center px-4">

        {/* Left panel */}
        <div className="w-full lg:w-[40%] flex flex-col gap-4 order-2 lg:order-1 lg:sticky lg:top-24">          {status && (
          <div
            className={`px-5 py-4 shadow-xl rounded-2xl flex items-center justify-center gap-3
                text-xs font-black uppercase tracking-wider border
                animate-in fade-in duration-300 ${statusColorClass}`}
          >
            {status.message}
          </div>
        )}
        </div>

        {/* Canvas */}
        <div className="order-1 lg:order-2 flex-grow w-full max-w-[400px] relative">
          <div className="w-full relative">
            <KonvaCanvas
              userImage={userImgUrl}
              baseTemplateUrl={location.state?.template}
              selectedId={selectedId}
              onSelect={setSelectedId}
              stageRef={stageRef}
              userProps={userProps}
              onUserDrag={handleUserDrag}
              onUserTransform={handleUserTransform}
            />

            {/* Processing Shimmer Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[2.5rem] overflow-hidden bg-white/40 backdrop-blur-sm m-2 sm:m-4 animate-in fade-in duration-300">
                <div className="absolute inset-0 animate-shimmer opacity-30" />
                <div className="z-10 flex flex-col items-center gap-3 bg-white/90 p-5 rounded-3xl shadow-xl border border-indigo-50/50">
                  <div className="w-8 h-8 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-inner" />
                  <p className="text-xs font-black text-indigo-900 uppercase tracking-widest animate-pulse">Removing BG...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomBar
        onExport={handleExport}
        onShare={handleShare}
        // onWhatsApp={handleShare}
        zoom={userProps.scale}
        onZoomChange={handleZoomChange}
        onReset={handleReset}
        canRemoveBg={!!userImgUrl && !isProcessing}
      />
    </div>
  );
};

export default PosterEditor;