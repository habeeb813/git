import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

function PosterCreator() {
  const navigate = useNavigate();
  const { docId, slug } = useParams();

  // Handle both the old '/img/:docId/:code' and the new '/poster/:slug' formats
  const actualDocId = slug ? slug.split('-')[0] : docId;

  const [basePoster, setBasePoster] = useState(null);
  const [activeId, setActiveId] = useState(actualDocId);
  const [loading, setLoading] = useState(true);

  // Fetch base poster from Firestore based on URL param
  useEffect(() => {
    const fetchPoster = async () => {
      setLoading(true);
      try {
        let referenceId = actualDocId;

        // Fallback if no docId in URL: Get the first poster from 'POSTERS'
        if (!referenceId) {
          const q = query(collection(db, "POSTERS"), orderBy("createdAt", "desc"), limit(1));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            referenceId = querySnapshot.docs[0].id;
          } else {
            referenceId = "1234567890";
          }
        }

        setActiveId(referenceId);
        let docRef = doc(db, "POSTERS", referenceId);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const url = docSnap.data().image || docSnap.data().POSTER_IMAGE;
          setBasePoster(url ? `${url}${url.includes('?') ? '&' : '?'}cb=${Date.now()}` : null);
        }
      } catch (error) {
        console.error("Error fetching poster:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoster();
  }, [actualDocId]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // AUTO-REDIRECT directly to editor once image is selected, pass the template too
      navigate('/editor', { state: { imageUrl: url, template: basePoster, templateId: activeId } });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Header */}
      <header className="w-full bg-[#fdf5fd] py-4 border-b border-[#f3e8f3] mb-4">
        <h1 className="text-center text-xl font-bold text-[#2e1d44] tracking-tight">
          സ്ഥാനാർത്ഥിക്കൊപ്പം പോസ്റ്റർ
        </h1>
      </header>

      <main className="w-full max-w-[95%] sm:max-w-md mx-auto px-1">

        {/* Step Info */}


        {/* Base Poster Display from Firestore (Visual reference for user) */}
        {loading ? (
          <div className="mb-8 w-full animate-in fade-in duration-500">
            <div className="relative rounded-[2rem] overflow-hidden shadow-md border border-white aspect-[4/5] animate-shimmer scale-95" />
          </div>
        ) : basePoster && (
          <div className="mb-8 w-full animate-in fade-in zoom-in duration-1000">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white">
              <img
                src={basePoster}
                crossOrigin="anonymous"
                alt="Base Poster"
                className="w-full h-auto object-cover aspect-[4/5]"
              />

            </div>
          </div>
        )}

        {/* Compact Upload Section */}
        <div 
          className="border-[1.5px] border-dashed border-slate-300 rounded-[1rem] p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors cursor-pointer mb-8 shadow-sm group"
          onClick={() => document.getElementById('photo-upload').click()}
        >
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="14" height="14" rx="2" ry="2" />
              <path d="M3 14l4-4 5.5 5.5" />
              <circle cx="8" cy="10" r="1.5" />
              <line x1="20" y1="3" x2="20" y2="9" />
              <line x1="17" y1="6" x2="23" y2="6" />
            </svg>
            <span className="font-bold tracking-tight text-blue-600 text-[17px]">Upload Photo</span>
          </div>
          <div className="px-5 py-1.5 rounded-full border-[1.5px] border-blue-600 text-blue-600 font-bold text-[14px] group-hover:bg-blue-50 transition-colors tracking-wide">
            Upload
          </div>
        </div>
      </main>


    </div>
  );
}

export default PosterCreator;
