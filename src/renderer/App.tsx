import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import YoutubeCaptionExtractor from './pages/tools/YoutubeCaptionExtractor';
import ScienceProve from './pages/tools/ScienceProve';

export default function App() {
  return (
    // TEMP: temp debug init route
    <Router initialEntries={['/tools/youtube-caption-extractor']}>
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
