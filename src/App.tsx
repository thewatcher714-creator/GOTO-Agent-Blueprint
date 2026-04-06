// Main Application Component - Updated with stable dependencies
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, getDocFromServer } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, Facebook, ArrowRight, CheckCircle2, Shield, Camera, UserCircle, BarChart3, Mail, Phone, MapPin } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Framework from './pages/Framework';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Resources from './pages/Resources';
import ViewReport from './pages/ViewReport';

const Navbar = ({ isAdmin, user }: { isAdmin: boolean; user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'The Framework', path: '/framework' },
    { name: 'Services', path: '/services' },
    { name: 'Resources', path: '/resources' },
    { name: 'Booking', path: '/booking' },
    { name: 'Contact', path: '/contact' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-secondary rounded-lg flex items-center justify-center">
              <span className="text-brand-primary font-bold text-xl">A</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tighter">THE GO-TO AGENT BLUEPRINT</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-brand-secondary ${
                  location.pathname === link.path ? 'text-brand-secondary' : 'text-brand-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button 
                onClick={() => auth.signOut()}
                className="text-sm font-medium text-brand-primary hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link to="/admin" className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors">
                Login
              </Link>
            )}
            <Link to="/booking" className="btn-primary py-2 px-5 text-sm">
              Start Audit
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-brand-primary hover:bg-gray-50"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button 
                  onClick={() => {
                    auth.signOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-4 text-base font-medium text-brand-primary hover:bg-gray-50"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-brand-primary hover:bg-gray-50"
                >
                  Login
                </Link>
              )}
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center btn-primary mt-4"
              >
                Start Audit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-brand-primary text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-brand-secondary rounded-lg flex items-center justify-center">
                <span className="text-brand-primary font-bold text-xl">A</span>
              </div>
              <span className="font-display text-2xl font-bold tracking-tighter">THE GO-TO AGENT BLUEPRINT</span>
            </Link>
            <p className="text-gray-400 max-w-md mb-8">
              Helping real estate agents become the "Go-To" authority in their market through strategic positioning, high-end media, and the Go-To Ladder framework.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-secondary hover:text-brand-primary transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-secondary hover:text-brand-primary transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/framework" className="hover:text-brand-secondary transition-colors">The Framework</Link></li>
              <li><Link to="/services" className="hover:text-brand-secondary transition-colors">Services</Link></li>
              <li><Link to="/booking" className="hover:text-brand-secondary transition-colors">Book an Audit</Link></li>
              <li><Link to="/contact" className="hover:text-brand-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-brand-secondary" />
                <span>hello@gotoagentblueprint.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-brand-secondary" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-brand-secondary" />
                <span>Los Angeles, CA</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 The Go-To Agent Blueprint. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test Firestore connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if admin
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        setIsAdmin(userData?.role === 'admin' || currentUser.email === 'thewatcher714@gmail.com');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar isAdmin={isAdmin} user={user} />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/framework" element={<Framework />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/reports/:id" element={<ViewReport />} />
            <Route path="/admin/*" element={<Admin isAdmin={isAdmin} user={user} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
