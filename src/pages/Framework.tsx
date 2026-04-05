import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Target, TrendingUp, Users, Award, Camera, Eye, Shield, Search, MessageSquare, Layers, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Framework = () => {
  const steps = [
    {
      title: 'Level 1: Seen',
      desc: 'Your listings and content are visible, but buyers and sellers do not clearly understand what makes you different.',
      icon: <Eye className="text-brand-secondary" size={24} />,
      details: ['Visible online', 'Listings receive views', 'Awareness exists']
    },
    {
      title: 'Level 2: Understood',
      desc: 'Your positioning becomes clear. Buyers and sellers can quickly explain what makes you different and why you matter.',
      icon: <Target className="text-brand-secondary" size={24} />,
      details: ['Clear positioning', 'Strong first impression', 'Message makes sense']
    },
    {
      title: 'Level 3: Trusted',
      desc: 'Your communication, consistency, and presentation create confidence. People begin to believe in your expertise before ever speaking with you.',
      icon: <Shield className="text-brand-secondary" size={24} />,
      details: ['Credibility builds', 'Trust forms faster', 'Authority compounds']
    },
    {
      title: 'Level 4: Chosen',
      desc: 'You become the professional clients naturally select. The market no longer sees you as interchangeable.',
      icon: <Award className="text-brand-secondary" size={24} />,
      details: ['More direct inquiries', 'Less price resistance', 'Higher quality clients']
    }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl mb-8"
          >
            The Go-To Ladder™
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The Go-To Ladder™ is a 4-level framework that explains how real estate professionals move from being seen in their market to becoming the agent clients naturally choose.
          </p>
        </div>
      </section>

      {/* Insight Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-8 text-brand-primary">Where Most Agents Get Stuck</h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed">
            <p>Most agents do not fail because they lack effort.</p>
            <p>They stall between the <strong>"Seen"</strong> and <strong>"Understood"</strong> stages of the Go-To Ladder.</p>
            <p>Their listings are visible, but buyers and sellers cannot clearly explain what makes them different.</p>
            <p className="text-brand-secondary font-semibold">That gap is where opportunity is lost.</p>
          </div>
        </div>
      </section>

      {/* Visual Diagram */}
      <section className="py-12 bg-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-sm font-bold tracking-widest uppercase text-brand-secondary mb-2">The Go-To Ladder™</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {[
              { label: 'IN DEMAND', color: 'bg-[#ffcf6e] text-brand-primary ring-4 ring-brand-secondary/20 z-10', baseScale: 1.1, shadow: 'shadow-2xl shadow-brand-secondary/40' },
              { label: 'CHOSEN', color: 'bg-brand-secondary text-brand-primary', baseScale: 1, shadow: 'shadow-md' },
              { label: 'TRUSTED', color: 'bg-amber-100 text-brand-primary/80', baseScale: 1, shadow: 'shadow-sm' },
              { label: 'UNDERSTOOD', color: 'bg-amber-50 text-brand-primary/60', baseScale: 1, shadow: 'shadow-sm' },
              { label: 'SEEN', color: 'bg-gray-100 text-gray-400', baseScale: 1, shadow: 'shadow-sm' },
            ].map((level, i) => (
              <motion.div
                key={level.label}
                initial={{ opacity: 0, y: 20, scale: level.baseScale }}
                whileInView={{ opacity: 1, y: 0, scale: level.baseScale }}
                whileHover={{ 
                  scale: level.baseScale + 0.02, 
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  backgroundColor: i === 0 ? "#ffd685" : i === 1 ? "#ffc861" : undefined
                }}
                transition={{ 
                  delay: (4 - i) * 0.15,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className={`w-full py-5 rounded-2xl text-center font-bold tracking-widest text-sm md:text-base cursor-pointer transition-colors ${level.color} ${level.shadow}`}
              >
                {level.label}
              </motion.div>
            ))}
          </div>
          
          <p className="text-center mt-12 text-gray-500 italic text-sm md:text-base">
            Most agents stall between Seen and Understood.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-24">
            {steps.map((step, i) => (
              <div key={i} className={`flex flex-col lg:flex-row items-center gap-16 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/5 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="text-brand-secondary font-bold tracking-widest uppercase text-sm">Level {i + 1}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl mb-6">{step.title}</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {step.desc}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {step.details.map((detail, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle2 size={18} className="text-brand-secondary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <div className="aspect-video rounded-3xl bg-gray-100 overflow-hidden shadow-xl border border-gray-200">
                    <img 
                      src={`https://images.unsplash.com/photo-${i === 0 ? '1460925895917-afdab827c52f' : i === 1 ? '1552664730-d307ca884978' : i === 2 ? '1542744173-8e7e53415bb0' : '1553877522-43269d4ea984'}?auto=format&fit=crop&q=80&w=800`}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-primary mb-4">How We Help You Climb the Ladder</h2>
            <p className="text-xl text-gray-600">Our proven process for moving you up the Go-To Ladder™.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-6">
                <Search className="text-brand-secondary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Step 1 – Diagnostic Audit</h3>
              <p className="text-gray-600 leading-relaxed">
                We analyze your positioning, visibility, and messaging to determine where you currently stand on the Go-To Ladder.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-6">
                <MessageSquare className="text-brand-secondary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Step 2 – Strategic Positioning</h3>
              <p className="text-gray-600 leading-relaxed">
                We clarify your professional narrative so buyers and sellers quickly understand what makes you different.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-6">
                <Layers className="text-brand-secondary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Step 3 – Authority Asset Creation</h3>
              <p className="text-gray-600 leading-relaxed">
                We create the professional branding and listing media that reinforces credibility and trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl text-center mb-16">The Authority Advantage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-2xl font-bold mb-8 text-red-400">The Overlooked Agent</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4 text-gray-400">
                  <X className="shrink-0 mt-1" size={20} />
                  <span>Competes on commission and price</span>
                </li>
                <li className="flex items-start gap-4 text-gray-400">
                  <X className="shrink-0 mt-1" size={20} />
                  <span>Uses generic marketing</span>
                </li>
                <li className="flex items-start gap-4 text-gray-400">
                  <X className="shrink-0 mt-1" size={20} />
                  <span>Has no clear positioning</span>
                </li>
                <li className="flex items-start gap-4 text-gray-400">
                  <X className="shrink-0 mt-1" size={20} />
                  <span>Relies on the brokerage brand for credibility</span>
                </li>
              </ul>
            </div>
            <div className="p-10 rounded-3xl bg-brand-secondary/10 border border-brand-secondary/20">
              <h3 className="text-2xl font-bold mb-8 text-brand-secondary">The Go-To Agent</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="shrink-0 mt-1 text-brand-secondary" size={20} />
                  <span>Communicates clear value</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="shrink-0 mt-1 text-brand-secondary" size={20} />
                  <span>Attracts clients who seek them out</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="shrink-0 mt-1 text-brand-secondary" size={20} />
                  <span>Owns a niche or specialization</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="shrink-0 mt-1 text-brand-secondary" size={20} />
                  <span>Becomes the recognizable professional in their market</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl mb-8">Ready to start your climb?</h2>
          <p className="text-lg text-gray-600 mb-12">
            The first step is identifying where you currently stand on the Go-To Ladder. Your diagnostic audit reveals the exact gap between being seen and being chosen.
          </p>
          <Link to="/booking" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Book Your Diagnostic Audit <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Framework;
