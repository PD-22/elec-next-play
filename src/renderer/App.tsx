import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import YoutubeCaptionExtractor from './pages/tools/YoutubeCaptionExtractor';
import ScienceProve from './pages/tools/ScienceProve';

export default function App() {
  // How router works may up it comp
  return (
    // TEMP
    <Router initialEntries={['/settings']}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/tools/youtube-caption-extractor"
            element={<YoutubeCaptionExtractor />}
          />
          <Route path="/tools/science-prove" element={<ScienceProve />} />
        </Route>
      </Routes>
    </Router>
  );
}
