import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import YoutubeCaptionExtractor from './pages/tools/YoutubeCaptionExtractor';
import ScienceProve from './pages/tools/ScienceProve';

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
        <Route
          path="/tools/science-prove"
          element={
            <Layout>
              <ScienceProve />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
