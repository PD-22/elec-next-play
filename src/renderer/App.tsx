import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Layout from './Layout';
import Settings from './pages/Settings';

// TODO: may dry layout

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
      </Routes>
    </Router>
  );
}
