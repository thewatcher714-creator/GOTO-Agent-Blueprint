import React, { useState } from 'react';
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  Instagram,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'submissions'), {
        ...formData,
        type: 'Contact Message',
        status: 'new',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl mb-8">Contact Us</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Whether you have a question about the free guide, want to learn more about working together,
            or are not sure where to start, send us a message and we’ll point you in the right direction.
          </p>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-10">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-brand-primary">How We Can Help</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Use this page for general questions, partnership inquiries, or next-step conversations.
                  If you already know you want strategic help, the best next step is booking a strategy call.
                </p>

                <div className="space-y-6">
                  {[
                    'Questions about the guide or services',
                    'Support choosing the right next step',
                    'General inquiries and partnership requests'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-base md:text-lg font-medium text-brand-primary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Email
                    </p>
                    <p className="text-lg font-medium text-brand-primary break-all">
                      hello@gotoagentblueprint.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-brand-primary text-white">
                <h3 className="text-xl font-bold mb-4">Prefer a More Direct Next Step?</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  If you are looking for strategic clarity around positioning, visibility, or brand presence,
                  book a strategy call instead of sending a general message.
                </p>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 text-brand-secondary font-bold text-lg hover:gap-4 transition-all"
                >
                  Book a Strategy Call <ArrowRight size={20} />
                </Link>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-brand-primary">Follow Along</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Get insights on positioning, visibility, and becoming the agent people remember.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-lg bg-brand-secondary/10 text-brand-secondary flex items-center justify-center hover:bg-brand-secondary hover:text-brand-primary transition-all"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-2">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-3xl bg-white border border-gray-100 shadow-xl">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-brand-primary">Message Received</h2>
                  <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                    Thank you, {formData.name.split(' ')[0]}. We’ve received your message and will get back to you as soon as we can.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: ''
                      });
                    }}
                    className="btn-primary px-8"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
                  <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-4 text-brand-primary">Send a Message</h2>
                    <p className="text-gray-600 leading-relaxed">
                      Share a little context so we can respond more helpfully.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                          Your Name
                        </label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                          placeholder="Jane Smith"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Subject
                      </label>
                      <input
                        required
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                        placeholder="What can we help you with?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                        Message
                      </label>
                      <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                        placeholder="Tell us a bit about your question, goals, or what you are trying to solve."
                      />
                    </div>

                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          Send Message <Send size={20} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      By submitting this form, you agree to our terms and privacy policy. We will never share your information.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;