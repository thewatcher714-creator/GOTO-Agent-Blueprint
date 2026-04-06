export interface Page {
  id?: string;
  title: string;
  slug: string;
  content: string;
  seo: {
    title: string;
    description: string;
  };
  published: boolean;
}

export interface Service {
  id?: string;
  name: string;
  description: string;
  price: string;
  icon: string;
  features: string[];
  order: number;
}

export interface Testimonial {
  id?: string;
  author: string;
  role: string;
  text: string;
  photoUrl: string;
}

export interface Booking {
  id?: string;
  name: string;
  email: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
  createdAt: string;
}

export interface Submission {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Settings {
  siteName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
  };
}

export interface MediaItem {
  id?: string;
  title: string;
  type: 'image' | 'youtube';
  category: 'branding' | 'homepage' | 'lead-magnet' | 'book' | 'testimonials' | 'backgrounds' | 'email-assets' | 'misc';
  description: string;
  altText: string;
  tags: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
  youtubeUrl?: string;
  embedUrl?: string;
  pageTarget?: string;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface DownloadItem {
  id?: string;
  title: string;
  description: string;
  category: 'audit-reports' | 'guides' | 'worksheets' | 'templates' | 'downloads' | 'client-resources';
  fileType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  buttonLabel: string;
  sortOrder: number;
  visibility: 'public' | 'private' | 'gated';
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface ReportTemplate {
  id?: string;
  name: string;
  category: string;
  subject?: string;
  htmlBody: string;
  cssBlock?: string;
  previewImageUrl?: string;
  status: 'draft' | 'active';
  createdAt: any;
  updatedAt: any;
}

export interface Report {
  id?: string;
  title: string;
  clientName: string;
  clientEmail: string;
  templateId: string;
  status: 'draft' | 'final';
  htmlOutput: string;
  mergeFields: Record<string, string>;
  createdAt: any;
  updatedAt: any;
}

export interface EmailTemplate {
  id?: string;
  name: string;
  category: string;
  subject: string;
  htmlBody: string;
  plainText?: string;
  status: 'draft' | 'active';
  createdAt: any;
  updatedAt: any;
}

export interface EmailLog {
  id?: string;
  templateId: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  sentAt: any;
  status: 'success' | 'failed';
  error?: string;
}
