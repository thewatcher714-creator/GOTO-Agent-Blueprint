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
