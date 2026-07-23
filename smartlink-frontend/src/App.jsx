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
import TemplateGallery from './pages/TemplateGallery';
import LinkInBio from './pages/LinkInBio';
import LinkShortener from './pages/LinkShortener';
import QRCodePage from './pages/QRCodePage';
import SocialMediaManagement from './pages/SocialMediaManagement';
import SocialPlanner from './pages/SocialPlanner';
import Marketplace from './pages/Marketplace';
import Discover from './pages/Discover';
import Pricing from './pages/Pricing';
import { Products, Learn } from './pages/NavPages';
import Chatbot from './components/Chatbot';

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
              
              {/* Template Routes */}
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/gallery" element={<TemplateGallery />} />
              <Route path="/templates/editor/:id" element={<TemplateEditor />} />
              
              {/* Feature Pages */}
              <Route path="/features/link-in-bio" element={<LinkInBio />} />
              <Route path="/features/link-shortener" element={<LinkShortener />} />
              <Route path="/features/qr-code" element={<QRCodePage />} />
              <Route path="/features/social-media" element={<SocialMediaManagement />} />
              <Route path="/social-planner" element={<SocialPlanner />} />
              
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/:username" element={<PublicProfile />} />
            </Routes>
          </main>
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
