import React from 'react';
import { FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl mb-8">Free Guide</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Download our free guide, 5 Reasons You're Not Getting Leads, and learn what is quietly costing real estate agents opportunities, trust, and consistency.
          </p>
        </div>
      </section>

      {/* Featured Resource Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Content Side */}
              <div className="p-8 md:p-12 lg:p-16">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary bg-brand-secondary/10 px-3 py-1 rounded-full mb-6 inline-block">
                  Free Download
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-primary">
                  5 Reasons You're Not Getting Leads
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  A practical guide for real estate agents who are showing up, working hard, and still not generating the consistency of leads they expected.
                </p>

                <ul className="space-y-4 mb-10">
                  {[
                    "Why visibility alone is not enough",
                    "What weak positioning is costing you",
                    "How inconsistent follow-up hurts trust",
                    "Where your brand may be losing opportunities"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="text-brand-secondary shrink-0 mt-1" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* TODO: Replace with real download URL when available */}
                <a 
                  href="#" 
                  className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                  onClick={(e) => e.preventDefault()}
                >
                  Download the Free Guide <ArrowRight size={20} />
                </a>
              </div>

              {/* Visual/Supporting Side */}
              <div className="bg-gray-50 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-8">
                  <FileText className="text-brand-secondary" size={48} />
                </div>
                <div className="max-w-xs">
                  <p className="text-gray-500 italic leading-relaxed">
                    "Best for agents who know they should be generating more business from their brand, content, and online presence."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-8">Need Help Fixing the Problem?</h2>
          <p className="text-lg text-gray-600 mb-12">
            The guide is a strong starting point. If you want a clearer diagnosis of what is hurting your positioning, visibility, or lead flow, book a strategy call.
          </p>
          <Link to="/booking" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Book a Strategy Call <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Resources;
