import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import YoutubeCaptionExtractor from './pages/tools/YoutubeCaptionExtractor';

// TODO: may dry layout repetition

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
        <Route
          path="/tools/youtube-caption-extractor"
          element={
            <Layout>
              <YoutubeCaptionExtractor />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
