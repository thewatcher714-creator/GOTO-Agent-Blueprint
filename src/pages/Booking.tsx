import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Booking = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    market: '',
    experience: '',
    focus: '',
    notes: ''
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
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        type: 'Diagnostic Audit Request'
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting diagnostic audit request:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center p-12 rounded-3xl bg-white shadow-2xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-brand-primary">Audit Request Received</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you, {formData.name.split(' ')[0]}. We’ve received your diagnostic audit request. A member of our team will review your information and reach out shortly with the next steps to confirm scheduling and payment.
          </p>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="btn-primary w-full"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h1 className="text-5xl md:text-6xl mb-8">Book Your $297 Diagnostic Audit</h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              This paid diagnostic is designed for agents who want clear insight into what may be hurting their positioning, visibility, and lead flow. If there’s a strong fit, it can also help identify the right next step for working together.
            </p>

            <div className="space-y-8">
              {[
                'Review your current positioning and brand presence',
                'Identify what may be hurting trust or lead flow',
                'Clarify the biggest gaps in visibility and messaging',
                'Get a clearer recommendation on the right next step'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-lg font-medium text-brand-primary">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 rounded-2xl bg-brand-primary text-white">
              <p className="italic text-lg mb-4">
                "Sometimes the biggest issue is not effort — it is unclear positioning, inconsistent visibility, or a brand that is not yet creating trust."
              </p>
              <p className="font-bold text-brand-secondary">Go-To Agent Diagnostic</p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                    placeholder="John Doe"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Primary Market
                  </label>
                  <input
                    required
                    type="text"
                    name="market"
                    value={formData.market}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                    placeholder="e.g. Beverly Hills, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Years in Real Estate
                  </label>
                  <select
                    required
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                  >
                    <option value="">Select Experience</option>
                    <option value="0-2">0-2 Years</option>
                    <option value="3-5">3-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    Main Focus
                  </label>
                  <select
                    required
                    name="focus"
                    value={formData.focus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                  >
                    <option value="">Select Focus</option>
                    <option value="Personal Brand">Personal Brand</option>
                    <option value="Content Strategy">Content Strategy</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Visibility and Positioning">Visibility and Positioning</option>
                    <option value="Not Sure Yet">Not Sure Yet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  What feels most stuck right now?
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 outline-none transition-all"
                  placeholder="Tell us a bit about your business, what is not working, and what you are hoping to improve."
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
                    Request My Audit <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                By submitting this form, you agree to our terms and privacy policy. We will never share your information.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;