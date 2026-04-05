import React from 'react';
import { Camera, UserCircle, BarChart3, Video, Search, CheckCircle2, ArrowRight, TrendingUp, Monitor, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl mb-8">Services Designed to Help You Become the Go-To Agent</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Most agents are not losing business because they lack skill. They are losing business because their message is unclear, their visibility is inconsistent, and their brand does not yet create trust at first glance. Our services are built to fix that.
          </p>
        </div>
      </section>

      {/* Why Agents Get Overlooked */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm uppercase tracking-widest font-bold text-brand-secondary mb-4">Why Agents Get Overlooked</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 text-brand-primary">We Help Fix the Real Problem</h3>
            <p className="text-xl text-gray-600">
              The goal is not just to make you more visible. The goal is to make you clear, trusted, and naturally chosen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              "Your value proposition is too vague",
              "Your brand does not yet communicate trust",
              "You are posting without building authority",
              "You do not have a referral follow-up system",
              "Your visibility is inconsistent"
            ].map((problem, i) => (
              <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="text-brand-secondary shrink-0" size={24} />
                <span className="font-medium text-brand-primary">{problem}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step 1: Build the Foundation */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm uppercase tracking-widest font-bold text-brand-secondary mb-4">Step 1: Build the Foundation</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 text-brand-primary">Clarity, Positioning, and Strategic Direction</h3>
            <p className="text-xl text-gray-600 mb-4">
              Before content works, your message has to be clear, your positioning has to make sense, and your strategy has to give people a reason to remember you. This is where we build that foundation.
            </p>
            <p className="text-brand-secondary font-bold uppercase tracking-widest text-sm">
              Clear offer. Stronger positioning. Better direction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Instagram Authority Audit',
                price: '$297',
                desc: 'A focused review of your Instagram profile, content, and messaging to identify what is making you look active but not memorable.',
                icon: <Search size={24} />
              },
              {
                title: 'Brand & Messaging Assessment',
                price: '$597',
                desc: 'A deeper evaluation of your positioning, bio, visuals, and content to uncover where trust, clarity, and differentiation are breaking down.',
                icon: <BarChart3 size={24} />
              },
              {
                title: '90-Day Go-To Agent Strategy',
                price: '$697',
                desc: 'A custom roadmap built around your market, audience, and strengths so you can move from overlooked to in-demand with a clear execution path.',
                icon: <TrendingUp size={24} />
              },
              {
                title: 'Go-To Agent Advisory',
                price: '$1,000–$1,500/mo',
                desc: 'Ongoing strategic guidance, accountability, and refinement for agents who want support implementing the Go-To Agent system over time.',
                icon: <UserCircle size={24} />
              }
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-6">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 leading-tight">{service.title}</h4>
                <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">{service.desc}</p>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="font-bold text-brand-primary">{service.price}</span>
                  <Link to="/booking" className="text-brand-secondary hover:translate-x-1 transition-transform">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step 2: Build Visibility and Recognition */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm uppercase tracking-widest font-bold text-brand-secondary mb-4">Step 2: Build Visibility and Recognition</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 text-brand-primary">Content, Consistency, and Brand Presence</h3>
            <p className="text-xl text-gray-600">
              Once the foundation is clear, the next step is showing up consistently in a way that builds trust, strengthens recognition, and keeps you top of mind in your market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Authority Content Planning',
                desc: 'Build content around trust-building themes like market insight, education, testimonials, community, and personal story so your content strengthens your brand over time.',
                icon: <Layers size={32} />
              },
              {
                title: 'Referral Visibility System',
                desc: 'Create a practical outreach rhythm that helps you stay top-of-mind with past clients, referral partners, and your local network consistently.',
                icon: <CheckCircle2 size={32} />
              },
              {
                title: 'Local Market Positioning',
                desc: 'Develop content and messaging that help you become known for your market, your audience, and your area of expertise.',
                icon: <Search size={32} />
              },
              {
                title: 'Personal Brand Photography',
                desc: 'Professional brand imagery that helps you look polished, credible, and trustworthy across your website, social platforms, and marketing assets.',
                icon: <Camera size={32} />
              },
              {
                title: 'AI Avatar Branding',
                desc: 'Extend your on-camera presence with scalable branded video content that helps you stay visible more consistently.',
                icon: <UserCircle size={32} />
              }
            ].map((service, i) => (
              <div key={i} className="p-10 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary mb-8 group-hover:bg-brand-secondary group-hover:text-brand-primary transition-colors">
                  {service.icon}
                </div>
                <h4 className="text-2xl font-bold mb-4">{service.title}</h4>
                <p className="text-gray-600 mb-8 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step 3: Reinforce Trust With Professional Media */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm uppercase tracking-widest font-bold text-brand-secondary mb-4">Step 3: Reinforce Trust With Professional Media</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-8">Media That Supports Your Brand</h3>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Professional media is not the strategy by itself. It is the visual layer that reinforces a clear message, a credible brand, and a strong market presence. When used well, it helps your business look more established immediately.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  { title: 'Listing Photography', icon: <Camera size={20} /> },
                  { title: 'Drone and Video', icon: <Video size={20} /> },
                  { title: 'Virtual Staging', icon: <Monitor size={20} /> },
                  { title: 'Virtual Twilight', icon: <Layers size={20} /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-brand-secondary">{item.icon}</div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10">
                <p className="text-gray-400 mb-6">Need full real estate media production for listings and marketing assets?</p>
                <a 
                  href="https://walkerrealestatemedia.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-secondary font-bold text-lg hover:gap-4 transition-all"
                >
                  View Real Estate Media Services <ArrowRight size={20} />
                </a>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000" 
                alt="Luxury Real Estate" 
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -top-10 -left-10 bg-brand-secondary text-brand-primary p-8 rounded-2xl shadow-xl hidden xl:block max-w-xs">
                <p className="font-bold text-lg">"Your media should reinforce trust, not carry the whole message by itself."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Solutions */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-8">Need a Custom Go-To Agent Package?</h2>
          <p className="text-lg text-gray-600 mb-12">
            For teams, brokerages, and high-volume producers, we create tailored packages that combine strategic direction, brand development, visibility systems, authority content, and media support.
          </p>
          <Link to="/booking" className="btn-secondary text-lg px-10 py-4 inline-flex items-center gap-2">
            Book a Strategy Call <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
