const BottomBar = ({ onExport, onShare, onWhatsApp, zoom, onZoomChange, onReset, canRemoveBg }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white/80 backdrop-blur-2xl border-t border-slate-100/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col gap-4 max-w-[600px] mx-auto w-full">

        {/* Editor Controls: Zoom & Reset */}
        <div className="flex items-center gap-4 px-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block">
            Zoom
          </span>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.1"
            value={zoom || 1}
            onChange={(e) => onZoomChange && onZoomChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            disabled={canRemoveBg === false}
          />
          <button
            onClick={onReset}
            disabled={canRemoveBg === false}
            className="p-2 aspect-square rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95 transition-all outline-none disabled:opacity-50"
            title="Reset Position"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full">


          {/* Main Smart Share Action */}
          <button
            onClick={onShare}
            className="flex-1 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-indigo-200/50 hover:shadow-indigo-300/50 hover:scale-[1.02] transform transition-all active:scale-95 duration-200 uppercase tracking-wider"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share Poster</span>
          </button>

          {/* Direct WhatsApp Action */}
          {/* <button
          onClick={onWhatsApp}
          className="p-4 rounded-2xl bg-[#25D366] text-white hover:bg-[#20bd5a] active:scale-95 transition-all shadow-lg shadow-green-100 flex flex-col items-center gap-1 group"
          title="Share on WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">WhatsApp</span>
        </button> */}

        </div>
      </div>
    </div>
  );
};

export default BottomBar;
