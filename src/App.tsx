import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Support from './pages/Support';
import Marketplace from './pages/Marketplace';
import './App.css';
import './engine.css';
import './home.css';
import './motion.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />
        <Route path="/mcp" element={<Layout><Marketplace /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
