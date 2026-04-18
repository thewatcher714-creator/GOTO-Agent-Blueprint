import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Check,
  X,
  User as UserIcon,
  Image as ImageIcon,
  Download,
  FileText,
  ClipboardList,
  Mail,
  Send,
  Copy,
  Eye,
  FileCode,
  Users,
  Search,
  Youtube,
  Globe,
  Lock,
  UserCheck,
  FileUp,
  RefreshCw,
  Save,
  FileJson
} from 'lucide-react';
import { format } from 'date-fns';
import {
  MediaItem,
  DownloadItem,
  ReportTemplate,
  Report,
  EmailTemplate
} from '../types';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { storage } from '../firebase';

interface AdminProps {
  isAdmin: boolean;
  user: User | null;
}

interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

const handleFirestoreError = (error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null) => {
  if (error?.code === 'permission-denied') {
    const authUser = auth.currentUser;
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: {
        userId: authUser?.uid || 'anonymous',
        email: authUser?.email || 'N/A',
        emailVerified: authUser?.emailVerified || false,
        isAnonymous: authUser?.isAnonymous || true,
        providerInfo: authUser?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    console.error('Firestore Permission Denied:', errorInfo);
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
};

const Admin = ({ isAdmin, user }: AdminProps) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'bookings' | 'submissions' | 'services' | 'settings' |
    'media' | 'downloads' | 'reportTemplates' | 'reports' | 'emailTemplates' | 'sendEmail'
  >('dashboard');
  const [bookings, setBookings] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

  const [emailForm, setEmailForm] = useState({
    templateId: '',
    reportId: '',
    recipientName: '',
    recipientEmail: '',
    subject: '',
    mergeFields: {} as Record<string, string>
  });

  useEffect(() => {
    if (!isAdmin) return;

    const unsubBookings = onSnapshot(
      collection(db, 'bookings'),
      (snap) => {
        setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      },
      (error) => {
        console.error('Bookings listener error:', error);
      }
    );

    const unsubSubmissions = onSnapshot(
      collection(db, 'submissions'),
      (snap) => {
        setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      },
      (error) => {
        console.error('Submissions listener error:', error);
      }
    );

    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (a.order || 0) - (b.order || 0)));
      },
      (error) => {
        console.error('Services listener error:', error);
      }
    );

    const unsubMedia = onSnapshot(
      collection(db, 'media'),
      (snap) => {
        setMedia(snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem)).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      },
      (error) => {
        console.error('Media listener error:', error);
      }
    );

    const unsubDownloads = onSnapshot(
      collection(db, 'downloads'),
      (snap) => {
        setDownloads(snap.docs.map(d => ({ id: d.id, ...d.data() } as DownloadItem)).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      },
      (error) => {
        console.error('Downloads listener error:', error);
      }
    );

    const unsubReportTemplates = onSnapshot(
      collection(db, 'reportTemplates'),
      (snap) => {
        setReportTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as ReportTemplate)).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      },
      (error) => {
        console.error('Report templates listener error:', error);
      }
    );

    const unsubReports = onSnapshot(
      collection(db, 'reports'),
      (snap) => {
        setReports(snap.docs.map(d => ({ id: d.id, ...d.data() } as Report)).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      },
      (error) => {
        console.error('Reports listener error:', error);
      }
    );

    const unsubEmailTemplates = onSnapshot(
      collection(db, 'emailTemplates'),
      (snap) => {
        setEmailTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as EmailTemplate)).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      },
      (error) => {
        console.error('Email templates listener error:', error);
      }
    );

    return () => {
      unsubBookings();
      unsubSubmissions();
      unsubServices();
      unsubMedia();
      unsubDownloads();
      unsubReportTemplates();
      unsubReports();
      unsubEmailTemplates();
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

  const handleFileUpload = async (file: File, path: string) => {
    if (!storage) return null;
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error('Upload error:', error);
      const err = error as any;
      alert(`Upload failed: ${err?.code || ''} ${err?.message || err}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const col =
      activeTab === 'media' ? 'media' :
      activeTab === 'downloads' ? 'downloads' :
      activeTab === 'reportTemplates' ? 'reportTemplates' :
      activeTab === 'reports' ? 'reports' :
      activeTab === 'emailTemplates' ? 'emailTemplates' :
      activeTab === 'services' ? 'services' : '';

    if (!col) return;

    let finalHtml =
      activeTab === 'reports'
        ? (editingItem.htmlOutput || '')
        : (editingItem.htmlBody || '');

    if (activeTab === 'reports' && editingItem.mergeFields) {
      Object.entries(editingItem.mergeFields).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        finalHtml = finalHtml.replace(regex, value as string);
      });
    }

    const data = {
      ...editingItem,
      [activeTab === 'reports' ? 'htmlOutput' : 'htmlBody']: finalHtml,
      updatedAt: serverTimestamp(),
      createdAt: editingItem.createdAt || serverTimestamp()
    };

    try {
      if (editingItem.id) {
        const { id, ...rest } = data;
        await updateDoc(doc(db, col, id), rest).catch(err => handleFirestoreError(err, 'update', `${col}/${id}`));
      } else {
        await addDoc(collection(db, col), data).catch(err => handleFirestoreError(err, 'create', col));
      }

      setShowEditor(false);
      setEditingItem(null);
      alert('Saved successfully.');
    } catch (error: any) {
      console.error('Save error:', error);
      let displayError = error?.message || error;
      try {
        const parsed = JSON.parse(error.message);
        displayError = `Permission Denied: ${parsed.error}. Operation: ${parsed.operationType} on ${parsed.path}`;
      } catch (e) {
        // Not JSON, use original message
      }
      alert(`Failed to save item: ${displayError}`);
    }
  };

  const regenerateReport = () => {
    if (!editingItem || activeTab !== 'reports') return;

    const template = reportTemplates.find(t => t.id === editingItem.templateId);
    if (!template) return;

    let finalHtml = template.htmlBody;
    if (editingItem.mergeFields) {
      Object.entries(editingItem.mergeFields).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        finalHtml = finalHtml.replace(regex, value as string);
      });
    }

    setEditingItem({ ...editingItem, htmlOutput: finalHtml });
  };

  const sendRealEmail = async () => {
    if (!emailForm.recipientEmail || !emailForm.templateId) {
      alert('Please fill in recipient email and select a template.');
      return;
    }

    const template = emailTemplates.find(t => t.id === emailForm.templateId);
    if (!template) return;

    let finalHtml = template.htmlBody;
    let finalSubject = emailForm.subject || template.subject;
    const reportLink = emailForm.reportId ? `${window.location.origin}/reports/${emailForm.reportId}` : '';

    const allFields = {
      ...emailForm.mergeFields,
      CLIENT_NAME: emailForm.recipientName,
      REPORT_LINK: reportLink
    };

    Object.entries(allFields).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      finalHtml = finalHtml.replace(regex, value);
      finalSubject = finalSubject.replace(regex, value);
    });

    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          to: emailForm.recipientEmail,
          subject: finalSubject,
          html: finalHtml
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Email sent successfully!');
        await addDoc(collection(db, 'emailLogs'), {
          templateId: emailForm.templateId,
          recipientEmail: emailForm.recipientEmail,
          recipientName: emailForm.recipientName,
          subject: finalSubject,
          sentAt: new Date(),
          status: 'success'
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Email error:', error);
      alert(`Failed to send email: ${error?.message || error}`);
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
      <aside className="w-64 bg-brand-primary text-white flex flex-col">
        <div className="p-8">
          <div className="flex items-center space-x-2 mb-10">
            <div className="w-8 h-8 bg-brand-secondary rounded flex items-center justify-center">
              <span className="text-brand-primary font-bold">A</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tighter">ADMIN</span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
              { id: 'bookings', label: 'Bookings', icon: <Calendar size={18} /> },
              { id: 'submissions', label: 'Submissions', icon: <MessageSquare size={18} /> },
              { id: 'media', label: 'Media Manager', icon: <ImageIcon size={18} /> },
              { id: 'downloads', label: 'Downloads', icon: <Download size={18} /> },
              { id: 'reportTemplates', label: 'Report Templates', icon: <FileCode size={18} /> },
              { id: 'reports', label: 'Reports', icon: <ClipboardList size={18} /> },
              { id: 'emailTemplates', label: 'Email Templates', icon: <Mail size={18} /> },
              { id: 'sendEmail', label: 'Send Email', icon: <Send size={18} /> },
              { id: 'services', label: 'Services', icon: <Plus size={18} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
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
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Media Assets</p>
              <h3 className="text-4xl font-bold">{media.length}</h3>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4 flex-grow max-w-2xl">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search media..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-secondary outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 rounded-xl border border-gray-200 outline-none"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="branding">Branding</option>
                  <option value="homepage">Homepage</option>
                  <option value="lead-magnet">Lead Magnet</option>
                  <option value="book">Book</option>
                  <option value="testimonials">Testimonials</option>
                  <option value="backgrounds">Backgrounds</option>
                  <option value="email-assets">Email Assets</option>
                  <option value="misc">Misc</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingItem({ type: 'image', category: 'misc', isActive: true, tags: [], title: '', description: '', imageUrl: '', altText: '' });
                    setShowEditor(true);
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={18} /> Add Image
                </button>
                <button
                  onClick={() => {
                    setEditingItem({ type: 'youtube', category: 'misc', isActive: true, tags: [], title: '', description: '', youtubeUrl: '', thumbnailUrl: '' });
                    setShowEditor(true);
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Youtube size={18} /> Add YouTube
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {media
                .filter(item => {
                  const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
                  const search = searchTerm.toLowerCase();
                  const matchesSearch = 
                    (item.title || '').toLowerCase().includes(search) ||
                    (item.tags || []).some(t => (t || '').toLowerCase().includes(search));
                  return matchesCategory && matchesSearch;
                })
                .map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {item.type === 'image' ? (
                        <img src={item.imageUrl} alt={item.altText || item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-primary/5">
                          <Youtube size={48} className="text-red-600" />
                          {item.thumbnailUrl && (
                            <img src={item.thumbnailUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowEditor(true);
                          }}
                          className="p-2 bg-white rounded-lg text-brand-primary hover:bg-brand-secondary transition-colors"
                        >
                          <Settings size={18} />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.imageUrl || item.youtubeUrl || '');
                            alert('URL copied to clipboard!');
                          }}
                          className="p-2 bg-white rounded-lg text-brand-primary hover:bg-brand-secondary transition-colors"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={() => deleteItem('media', item.id!)}
                          className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {!item.isActive && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800/80 text-white text-[10px] font-bold uppercase tracking-widest rounded">
                          Inactive
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm truncate flex-grow">{item.title}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded ml-2">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.description || 'No description'}</p>
                    </div>
                  </div>
                ))}
            </div>

            {media.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-400">No media assets found</h3>
                <p className="text-gray-400">Start by adding your first image or YouTube video.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4 flex-grow max-w-2xl">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search downloads..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-secondary outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 rounded-xl border border-gray-200 outline-none"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="audit-reports">Audit Reports</option>
                  <option value="guides">Guides</option>
                  <option value="worksheets">Worksheets</option>
                  <option value="templates">Templates</option>
                  <option value="downloads">Downloads</option>
                  <option value="client-resources">Client Resources</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setEditingItem({ category: 'downloads', visibility: 'public', isActive: true, sortOrder: 0, title: '', fileUrl: '', fileType: '' });
                  setShowEditor(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <FileUp size={18} /> Upload File
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">File</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Visibility</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {downloads
                    .filter(item => {
                      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
                      const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
                      return matchesCategory && matchesSearch;
                    })
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="font-bold">{item.title}</p>
                              <p className="text-xs text-gray-500 uppercase">{item.fileType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            {item.visibility === 'public' ? <Globe size={14} className="text-green-500" /> :
                              item.visibility === 'private' ? <Lock size={14} className="text-red-500" /> :
                                <UserCheck size={14} className="text-brand-secondary" />}
                            <span className="text-sm capitalize">{item.visibility}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowEditor(true);
                              }}
                              className="p-2 text-brand-primary hover:bg-brand-secondary rounded-lg transition-colors"
                            >
                              <Settings size={18} />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.fileUrl);
                                alert('File URL copied!');
                              }}
                              className="p-2 text-brand-primary hover:bg-brand-secondary rounded-lg transition-colors"
                            >
                              <Copy size={18} />
                            </button>
                            <button
                              onClick={() => deleteItem('downloads', item.id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {downloads.length === 0 && (
                <div className="text-center py-20">
                  <Download size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400">No download items found</h3>
                </div>
              )}
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
              <button
                onClick={() => {
                  setEditingItem({ name: '', description: '', price: '', order: services.length + 1 });
                  setShowEditor(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} /> Add New Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold">{service.name}</h4>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => {
                          setEditingItem(service);
                          setShowEditor(true);
                        }}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                      >
                        <Settings size={18} />
                      </button>
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

        {activeTab === 'reportTemplates' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Report Templates</h3>
              <button
                onClick={() => {
                  setEditingItem({ name: '', status: 'draft', htmlBody: '<h1>New Report</h1>', category: 'audit' });
                  setShowEditor(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} /> New Template
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reportTemplates.map((template) => (
                <div key={template.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold">{template.name}</h4>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">{template.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      template.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {template.status}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => {
                        setEditingItem(template);
                        setShowEditor(true);
                      }}
                      className="flex-grow btn-secondary py-2 text-sm flex items-center justify-center gap-2"
                    >
                      <Settings size={16} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        const { id, ...rest } = template;
                        addDoc(collection(db, 'reportTemplates'), { ...rest, name: `${template.name} (Copy)`, createdAt: new Date(), updatedAt: new Date() });
                      }}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => deleteItem('reportTemplates', template.id!)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Client Reports</h3>
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 rounded-xl border border-gray-200 outline-none"
                  onChange={(e) => {
                    const template = reportTemplates.find(t => t.id === e.target.value);
                    if (template) {
                      setEditingItem({
                        title: `Report for ${new Date().toLocaleDateString()}`,
                        templateId: template.id,
                        status: 'draft',
                        htmlOutput: template.htmlBody,
                        mergeFields: {}
                      });
                      setShowEditor(true);
                    }
                  }}
                  value=""
                >
                  <option value="" disabled>Generate from Template...</option>
                  {reportTemplates.filter(t => t.status === 'active').map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Report / Client</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Created</th>
                    <th className="px-8 py-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-8 py-6">
                        <p className="font-bold">{report.title}</p>
                        <p className="text-sm text-gray-500">{report.clientName || 'No Client'} ({report.clientEmail || 'No Email'})</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                          report.status === 'final' ? 'bg-brand-secondary text-brand-primary' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500">
                        {report.createdAt?.toDate ? format(report.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(report);
                              setShowEditor(true);
                            }}
                            className="p-2 text-brand-primary hover:bg-brand-secondary rounded-lg"
                          >
                            <Settings size={18} />
                          </button>
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}/reports/${report.id}`;
                              navigator.clipboard.writeText(url);
                              alert('Public report link copied!');
                            }}
                            className="p-2 text-brand-primary hover:bg-brand-secondary rounded-lg"
                          >
                            <Copy size={18} />
                          </button>
                          <button
                            onClick={() => {
                              window.open(`/reports/${report.id}`, '_blank');
                            }}
                            className="p-2 text-brand-primary hover:bg-brand-secondary rounded-lg"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => deleteItem('reports', report.id!)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'emailTemplates' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Email Templates</h3>
              <button
                onClick={() => {
                  setEditingItem({ name: '', status: 'draft', htmlBody: '<p>Hello {{CLIENT_FIRST_NAME}},</p>', subject: 'Update' });
                  setShowEditor(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} /> New Email Template
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {emailTemplates.map((template) => (
                <div key={template.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold">{template.name}</h4>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">{template.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                      template.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {template.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6">{template.subject}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(template);
                        setShowEditor(true);
                      }}
                      className="flex-grow btn-secondary py-2 text-sm flex items-center justify-center gap-2"
                    >
                      <Settings size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteItem('emailTemplates', template.id!)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sendEmail' && (
          <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-8">Send Email</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Template</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                    value={emailForm.templateId}
                    onChange={(e) => {
                      const t = emailTemplates.find(x => x.id === e.target.value);
                      setEmailForm({ ...emailForm, templateId: e.target.value, subject: t?.subject || '' });
                    }}
                  >
                    <option value="">Select a template...</option>
                    {emailTemplates.filter(t => t.status === 'active').map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Report Link (Optional)</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                    value={emailForm.reportId}
                    onChange={(e) => {
                      const r = reports.find(x => x.id === e.target.value);
                      setEmailForm({
                        ...emailForm,
                        reportId: e.target.value,
                        recipientName: r?.clientName || emailForm.recipientName,
                        recipientEmail: r?.clientEmail || emailForm.recipientEmail
                      });
                    }}
                  >
                    <option value="">Select a report...</option>
                    {reports.filter(r => r.status === 'final').map(r => (
                      <option key={r.id} value={r.id}>{r.title} - {r.clientName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Recipient Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                    placeholder="John Doe"
                    value={emailForm.recipientName}
                    onChange={(e) => setEmailForm({ ...emailForm, recipientName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Recipient Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                    placeholder="john@example.com"
                    value={emailForm.recipientEmail}
                    onChange={(e) => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Subject Line</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                  placeholder="Your Audit Report is Ready"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                />
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <FileJson size={16} /> Merge Fields
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['CLIENT_FIRST_NAME', 'YOUR_NAME'].map(field => (
                    <div key={field}>
                      <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">{field}</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none"
                        value={emailForm.mergeFields[field] || ''}
                        onChange={(e) => setEmailForm({
                          ...emailForm,
                          mergeFields: { ...emailForm.mergeFields, [field]: e.target.value }
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={sendRealEmail}
                  className="flex-grow btn-primary py-4 flex items-center justify-center gap-2"
                >
                  <Send size={20} /> Send Email
                </button>
              </div>
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

      {showEditor && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold">
                {editingItem.id ? 'Edit' : 'New'} {activeTab.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {activeTab === 'media' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-secondary"
                          value={editingItem.title || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                        <select
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                          value={editingItem.category || 'misc'}
                          onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        >
                          <option value="branding">Branding</option>
                          <option value="homepage">Homepage</option>
                          <option value="lead-magnet">Lead Magnet</option>
                          <option value="book">Book</option>
                          <option value="testimonials">Testimonials</option>
                          <option value="backgrounds">Backgrounds</option>
                          <option value="email-assets">Email Assets</option>
                          <option value="misc">Misc</option>
                        </select>
                      </div>
                      {editingItem.type === 'image' ? (
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Image File</label>
                          <div className="flex items-center gap-4">
                            {editingItem.imageUrl && <img src={editingItem.imageUrl} className="w-16 h-16 rounded object-cover" />}
                            <input
                              type="file"
                              accept="image/*"
                              className="text-sm"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleFileUpload(file, 'media');
                                  if (url) setEditingItem({ ...editingItem, imageUrl: url });
                                }
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">YouTube URL</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                            placeholder="https://youtube.com/watch?v=..."
                            value={editingItem.youtubeUrl || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, youtubeUrl: e.target.value })}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'downloads' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                          value={editingItem.title || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">File</label>
                        <input
                          type="file"
                          className="text-sm"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file, 'downloads');
                              if (url) setEditingItem({ ...editingItem, fileUrl: url, fileType: file.name.split('.').pop() });
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Visibility</label>
                        <select
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                          value={editingItem.visibility || 'public'}
                          onChange={(e) => setEditingItem({ ...editingItem, visibility: e.target.value })}
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="gated">Gated (Email Required)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {(activeTab === 'reportTemplates' || activeTab === 'emailTemplates') && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                          value={editingItem.name || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        />
                      </div>
                      {activeTab === 'emailTemplates' && (
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Subject Line</label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                            value={editingItem.subject || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, subject: e.target.value })}
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Status</label>
                        <select
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                          value={editingItem.status || 'draft'}
                          onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                        </select>
                      </div>
                    </>
                  )}

                  {activeTab === 'reports' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Report Title</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                          value={editingItem.title || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Client Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                            value={editingItem.clientName || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Client Email</label>
                          <input
                            type="email"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                            value={editingItem.clientEmail || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, clientEmail: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Status</label>
                        <select
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                          value={editingItem.status || 'draft'}
                          onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                        >
                          <option value="draft">Draft</option>
                          <option value="final">Final (Publicly Viewable)</option>
                        </select>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-sm flex items-center gap-2">
                            <FileJson size={16} /> Merge Fields
                          </h4>
                          <button
                            type="button"
                            onClick={regenerateReport}
                            className="text-[10px] font-bold uppercase bg-brand-secondary px-2 py-1 rounded flex items-center gap-1"
                          >
                            <RefreshCw size={10} /> Regenerate HTML
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {['CLIENT_NAME', 'CLIENT_FIRST_NAME', 'CITY', 'MARKET_RANK', 'AUDIT_DATE'].map(field => (
                            <div key={field}>
                              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">{field}</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none"
                                value={editingItem.mergeFields?.[field] || ''}
                                onChange={(e) => setEditingItem({
                                  ...editingItem,
                                  mergeFields: { ...editingItem.mergeFields, [field]: e.target.value }
                                })}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'services' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Service Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                          value={editingItem.name || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Price</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none"
                          value={editingItem.price || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                        <textarea
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none h-24"
                          value={editingItem.description || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  {(activeTab === 'reportTemplates' || activeTab === 'emailTemplates' || activeTab === 'reports') && (
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase">HTML Content</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = '.html';
                              input.onchange = (e: any) => {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onload = (re) => {
                                  const content = re.target?.result as string;
                                  setEditingItem({ ...editingItem, [activeTab === 'reports' ? 'htmlOutput' : 'htmlBody']: content });
                                };
                                reader.readAsText(file);
                              };
                              input.click();
                            }}
                            className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-secondary px-2 py-1 rounded"
                          >
                            Import HTML
                          </button>
                        </div>
                      </div>
                      <textarea
                        className="flex-grow w-full p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-2xl outline-none min-h-[300px]"
                        value={activeTab === 'reports' ? (editingItem.htmlOutput || '') : (editingItem.htmlBody || '')}
                        onChange={(e) => setEditingItem({ ...editingItem, [activeTab === 'reports' ? 'htmlOutput' : 'htmlBody']: e.target.value })}
                      />
                      <div className="mt-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Preview</label>
                        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white h-[200px]">
                          <iframe
                            srcDoc={activeTab === 'reports' ? editingItem.htmlOutput : editingItem.htmlBody}
                            className="w-full h-full border-none"
                            title="Preview"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'media' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                      <textarea
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none h-32"
                        value={editingItem.description || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn-primary px-12 py-3 flex items-center gap-2"
                >
                  {isUploading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                  {editingItem.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Shield = ({ size }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);

export default Admin;