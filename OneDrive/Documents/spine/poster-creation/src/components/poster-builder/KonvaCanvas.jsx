import { Stage, Layer, Image as KonvaImageNode, Transformer } from 'react-konva';
import { useState, useEffect, useRef } from 'react';

// 🔥 Reusable Image Loader
const KonvaImage = ({
  url,
  id,
  isDraggable,
  listening,
  position,
  scale,
  onSelect,
  onDragEnd,
  onTransformEnd,
}) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!url) return;

    let cancelled = false;

    const loadImage = (src, useCors = true) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();

        if (useCors) {
          img.crossOrigin = "anonymous";
        }

        img.onload = () => resolve(img);
        img.onerror = () => reject("load failed");

        img.src = src;
      });
    };

    const run = async () => {
      try {
        // Enforce CORS for exportability. We must NOT fall back to non-CORS
        // because that taints the canvas and breaks the Share/Export feature.
        const img = await loadImage(url, true);
        if (!cancelled) setImage(img);
      } catch (err) {
        // If the initial CORS load fails, try with cache-busting.
        // This is still a CORS load, not a non-CORS fallback.
        // If this also fails, then the image cannot be loaded securely.
        try {
          const cacheBusted = url.includes('?')
            ? `${url}&_cb=${Date.now()}`
            : `${url}?_cb=${Date.now()}`;
          const img = await loadImage(cacheBusted, true);
          if (!cancelled) setImage(img);
        } catch (err) {
          console.error("Image failed CORS load. Poster sharing will be disabled for this image.", url);
        }
      }
    };

    run();

    return () => (cancelled = true);
  }, [url]);

  if (!image) return null;

  return (
    <KonvaImageNode
      id={id}
      image={image}
      width={id === 'template' ? 400 : 200}
      height={id === 'template' ? 400 : 200}
      x={position ? position.x : id === 'template' ? 0 : 50}
      y={position ? position.y : id === 'template' ? 0 : 100}
      scaleX={scale || 1}
      scaleY={scale || 1}
      draggable={isDraggable}
      listening={listening}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
};

// 🔥 MAIN CANVAS
const KonvaCanvas = ({
  userImage,
  baseTemplateUrl,
  onSelect,
  selectedId,
  stageRef,
  userProps,
  onUserDrag,
  onUserTransform,
}) => {
  const trRef = useRef();

  // 🔥 IMPORTANT: DO NOT USE STATE (prevents flicker)
  const templateUrl = baseTemplateUrl ? (baseTemplateUrl.includes('?') ? `${baseTemplateUrl}&cb=${Date.now()}` : `${baseTemplateUrl}?cb=${Date.now()}`) : null;

  // 🔥 Transformer attach
  useEffect(() => {
    if (selectedId && trRef.current && stageRef.current) {
      const node = stageRef.current.findOne('#userImg');
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, stageRef]);

  return (
    <div className="flex justify-center items-center bg-white rounded-[2.5rem] overflow-hidden shadow-2xl p-2 sm:p-4 mx-auto max-w-full">
      <Stage
        width={400}
        height={400}
        ref={stageRef}
        onMouseDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) onSelect(null);
        }}
        onTouchStart={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) onSelect(null);
        }}
      >
        <Layer>
          {/* 🔥 FIX: Removed white Rect (causing white screen issue) */}

          {/* 🔥 BACKGROUND TEMPLATE (STABLE) */}
          {templateUrl && (
            <KonvaImage
              url={templateUrl}
              id="template"
              isDraggable={false}
              listening={false}
            />
          )}

          {/* 🔥 USER IMAGE */}
          {userImage && (
            <KonvaImage
              url={userImage}
              id="userImg"
              isDraggable={true}
              scale={userProps.scale}
              position={userProps.position}
              onSelect={() => onSelect('userImg')}
              onDragEnd={(e) =>
                onUserDrag({ x: e.target.x(), y: e.target.y() })
              }
              onTransformEnd={(e) =>
                onUserTransform(e.target.scaleX())
              }
              listening={true}
            />
          )}

          {/* 🔥 TRANSFORMER */}
          {selectedId && (
            <Transformer
              ref={trRef}
              rotateEnabled={true}
              keepRatio={true}
              enabledAnchors={[
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 50 || newBox.height < 50) return oldBox;
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;