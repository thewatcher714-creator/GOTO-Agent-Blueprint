import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { LayoutDashboard, Calendar, MessageSquare, Settings, LogOut, Plus, Trash2, Check, X, ExternalLink, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AdminProps {
  isAdmin: boolean;
  user: User | null;
}

const Admin = ({ isAdmin, user }: AdminProps) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'submissions' | 'services' | 'settings'>('dashboard');
  const [bookings, setBookings] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    const qBookings = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubBookings = onSnapshot(qBookings, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qSubmissions = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    const unsubSubmissions = onSnapshot(qSubmissions, (snap) => {
      setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qServices = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsubServices = onSnapshot(qServices, (snap) => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubBookings();
      unsubSubmissions();
      unsubServices();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => auth.signOut();

  const updateBookingStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'bookings', id), { status });
  };

  const deleteItem = async (col: string, id: string) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      await deleteDoc(doc(db, col, id));
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-12 bg-white rounded-3xl shadow-xl text-center">
          <div className="w-20 h-20 bg-brand-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-brand-secondary">
            <Shield size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-4">Admin Access</h1>
          <p className="text-gray-500 mb-10">Please sign in with your authorized Google account to access the dashboard.</p>
          <button onClick={handleLogin} className="btn-primary w-full flex items-center justify-center gap-3">
            <UserIcon size={20} /> Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-12 bg-white rounded-3xl shadow-xl text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8 text-red-600">
            <X size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-500 mb-10">Your account ({user.email}) is not authorized to access this area.</p>
          <button onClick={handleLogout} className="btn-secondary w-full">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-primary text-white flex flex-col">
        <div className="p-8">
          <div className="flex items-center space-x-2 mb-10">
            <div className="w-8 h-8 bg-brand-secondary rounded flex items-center justify-center">
              <span className="text-brand-primary font-bold">A</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tighter">ADMIN</span>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
              { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
              { id: 'submissions', label: 'Submissions', icon: <MessageSquare size={20} /> },
              { id: 'services', label: 'Services', icon: <Plus size={20} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id ? 'bg-brand-secondary text-brand-primary font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
            <p className="text-gray-500">Manage your website content and leads.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">{user.displayName}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <img src={user.photoURL || ''} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-brand-secondary" />
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Total Bookings</p>
              <h3 className="text-4xl font-bold">{bookings.length}</h3>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">New Messages</p>
              <h3 className="text-4xl font-bold">{submissions.length}</h3>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Active Services</p>
              <h3 className="text-4xl font-bold">{services.length}</h3>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Date/Time</th>
                  <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-bold">{booking.name}</p>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-medium">{booking.date}</p>
                      <p className="text-sm text-gray-500">{booking.time}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Check size={18} /></button>
                        <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><X size={18} /></button>
                        <button onClick={() => deleteItem('bookings', booking.id)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold">{sub.subject}</h4>
                    <p className="text-gray-500">From: {sub.name} ({sub.email})</p>
                  </div>
                  <button onClick={() => deleteItem('submissions', sub.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-2xl">{sub.message}</p>
                <p className="text-xs text-gray-400 mt-4">Received: {sub.createdAt?.toDate ? format(sub.createdAt.toDate(), 'PPP p') : 'Just now'}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-8">
             <div className="flex justify-end">
                <button className="btn-primary flex items-center gap-2">
                  <Plus size={20} /> Add New Service
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service) => (
                  <div key={service.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold">{service.name}</h4>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><Plus size={18} /></button>
                        <button onClick={() => deleteItem('services', service.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brand-secondary">{service.price}</span>
                      <span className="text-xs text-gray-400">Order: {service.order}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Site Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200" defaultValue="The Go-To Agent Blueprint" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Primary Color</label>
                <div className="flex gap-4">
                  <input type="color" className="w-12 h-12 rounded-lg border-none" defaultValue="#001854" />
                  <input type="text" className="flex-grow px-4 py-3 rounded-xl border border-gray-200" defaultValue="#001854" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Secondary Color</label>
                <div className="flex gap-4">
                  <input type="color" className="w-12 h-12 rounded-lg border-none" defaultValue="#ffbf44" />
                  <input type="text" className="flex-grow px-4 py-3 rounded-xl border border-gray-200" defaultValue="#ffbf44" />
                </div>
              </div>
              <button className="btn-primary w-full py-4">Save Changes</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Shield = ({ size }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

export default Admin;
