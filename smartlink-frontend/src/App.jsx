import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Templates from './pages/Templates';
import TemplateEditor from './pages/TemplateEditor';
import Marketplace from './pages/Marketplace';
import Discover from './pages/Discover';
import Pricing from './pages/Pricing';
import { Products, Learn } from './pages/NavPages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/editor/:id" element={<TemplateEditor />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/:username" element={<PublicProfile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
