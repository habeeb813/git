import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PosterCreator from './pages/PosterCreator';
import PosterEditor from './components/poster-builder/PosterEditor';

function App() {
  return (
    <Router>
      <div className="App overflow-x-hidden bg-gray-50 min-h-screen">
        <Toaster position="top-right" />
        <Routes>
          {/* Default user flow (fallback if no specific poster ID is given) */}
          <Route path="/" element={<PosterCreator />} />
          
          {/* Old Dynamic route (backward compatibility) */}
          <Route path="/pollster2k26/img/:docId/:code" element={<PosterCreator />} />

          {/* New Dynamic route matching the generated share link */}
          <Route path="/poster/:slug" element={<PosterCreator />} />
          
          {/* Editor flow after photo selection */}
          <Route path="/editor" element={<PosterEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
