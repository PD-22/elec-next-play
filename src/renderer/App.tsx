import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
