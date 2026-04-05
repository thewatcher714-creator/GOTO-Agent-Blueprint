import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Camera, UserCircle, BarChart3, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1920',
    title: 'From Overlooked to In Demand',
    subtitle: 'Become the Go-To Agent in Your Market.',
    description: 'The Go-To Agent Blueprint shows real estate professionals how to move from being seen in their market to becoming the agent clients naturally choose.',
  },
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920',
    title: 'Most Agents Are Visible — But Not Understood',
    subtitle: 'When buyers and sellers cannot clearly explain what makes you different, you remain overlooked.',
    description: 'Most agents stall between the “Seen” and “Understood” stages of the Go-To Ladder™.',
  },
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920',
    title: 'Climb the Go-To Ladder™',
    subtitle: 'A framework that helps agents move from visibility to authority.',
    description: 'Strategy, branding, and professional listing media that position you as the obvious choice in your market.',
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const bookCoverUrl = 'https://firebasestorage.googleapis.com/v0/b/back-up-dev.firebasestorage.app/o/Book%20Cover_SM.png?alt=media&token=7ad811fa-95a1-42eb-8c41-4429fdd4061a';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Slideshow */}
      <section className="relative h-[85vh] bg-brand-primary overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={slides[currentSlide].image}
              alt="Hero"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start">
          <motion.div
            key={currentSlide}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-brand-secondary font-bold uppercase tracking-widest mb-4">
              {slides[currentSlide].subtitle}
            </p>
            <h1 className="text-5xl md:text-7xl text-white mb-6 leading-tight font-bold">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 font-light leading-relaxed">
              {slides[currentSlide].description}
            </p>
            {currentSlide === 0 && (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link to="/booking" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
                    Book a Go-To Ladder Audit <ArrowRight size={20} />
                  </Link>
                  <Link to="/framework" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center">
                    Explore the Framework
                  </Link>
                </div>
                <p className="text-white/60 text-lg italic font-light">
                  Most agents are visible. Few are clearly understood. Which one are you?
                </p>
              </>
            )}
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-12 h-1 rounded-full transition-all ${
                currentSlide === idx ? 'bg-brand-secondary' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </section>
      
      {/* Transformation Section */}
      <section className="py-24 bg-brand-secondary text-brand-primary">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <p className="text-2xl md:text-4xl font-bold leading-tight max-w-4xl mx-auto">
              Most agents remain overlooked because they stay stuck at the bottom of the ladder.
            </p>
            
            <div className="py-8">
              <p className="text-sm uppercase tracking-widest font-bold mb-8 opacity-60">The Go-To Ladder™ moves agents through four stages:</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                {['Seen', 'Understood', 'Trusted', 'Chosen'].map((stage, i) => (
                  <React.Fragment key={stage}>
                    <div className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold text-2xl shadow-xl min-w-[180px]">
                      {stage}
                    </div>
                    {i < 3 && <ArrowRight className="hidden md:block text-brand-primary/30" size={32} />}
                    {i < 3 && <div className="md:hidden text-brand-primary/30 font-bold text-3xl">↓</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <p className="text-xl md:text-2xl leading-relaxed font-medium max-w-3xl mx-auto">
              When buyers and sellers clearly understand what makes you different, trust builds naturally and you become the obvious option.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Agents Work With Us */}
      <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-primary">Why Agents Work With Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <BarChart3 size={32} />,
                title: 'Framework-Driven Strategy',
                desc: 'Most media companies sell photos. We provide a framework that explains why agents are not being chosen.'
              },
              {
                icon: <Camera size={32} />,
                title: 'Professional Media Execution',
                desc: 'Photography, video, staging, and twilight media designed to help listings move from being seen to being understood.'
              },
              {
                icon: <UserCircle size={32} />,
                title: 'Authority Positioning',
                desc: 'We help agents clarify their positioning so buyers and sellers immediately understand their value.'
              }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-6">
                <div className="w-16 h-16 bg-brand-secondary/20 rounded-2xl flex items-center justify-center mx-auto text-brand-primary">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-brand-primary">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Go-To Ladder Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl mb-6">The Go-To Ladder™</h2>
            <p className="text-lg text-gray-600">
              Most agents are stuck on the bottom rungs, competing on price and commission. We help you climb to the top where you are the only logical choice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {[
                {
                  step: '04',
                  title: 'Chosen',
                  desc: 'You become the professional clients naturally select without comparing you to others.',
                  color: 'bg-brand-secondary'
                },
                {
                  step: '03',
                  title: 'Trusted',
                  desc: 'Your communication, presentation, and consistency create confidence.',
                  color: 'bg-brand-secondary/70'
                },
                {
                  step: '02',
                  title: 'Understood',
                  desc: 'Buyers and sellers immediately recognize what sets you apart from other agents.',
                  color: 'bg-brand-secondary/40'
                },
                {
                  step: '01',
                  title: 'Seen',
                  desc: "Your listings and content are visible, but people don't clearly understand what makes you different.",
                  color: 'bg-gray-100'
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-12 h-12 shrink-0 rounded-lg flex items-center justify-center font-display font-bold text-brand-primary ${item.color}`}>
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-brand-secondary transition-colors">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000"
                  alt="Consultation"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-brand-primary text-white p-8 rounded-2xl shadow-xl hidden md:block max-w-xs">
                <Star className="text-brand-secondary mb-4" fill="currentColor" />
                <p className="italic text-lg mb-4">"This framework completely changed how I approach my business. I went from 12 to 34 listings in one year."</p>
                <p className="font-bold">— Sarah Jenkins, Top Producer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Platform Is For */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-brand-primary mb-8">Who This Platform Is For</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The Go-To Agent Blueprint is designed for real estate professionals who want to become the obvious choice in their market.
              </p>
              <div className="space-y-4">
                <p className="font-bold text-brand-primary uppercase tracking-widest text-sm">It works best for agents who:</p>
                {[
                  'Want to stand out in a crowded market',
                  'Take listing presentation seriously',
                  'Understand that perception drives trust',
                  'Want to move from being overlooked to becoming the Go-To professional in their area'
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-secondary shrink-0 mt-1" size={20} />
                    <span className="text-lg text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="relative">
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000"
                  alt="Team Collaboration"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl mb-6">How We Help Agents Climb the Go-To Ladder</h2>
              <p className="text-gray-400 text-lg">
                Becoming the Go-To professional in your market requires more than visibility. Our services diagnose positioning gaps, clarify your authority, and provide the professional media that reinforces trust.
              </p>
            </div>
            <Link to="/services" className="text-brand-secondary font-bold flex items-center gap-2 hover:gap-4 transition-all">
              View All Services <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="text-brand-secondary" size={32} />,
                title: 'Authority Audit',
                desc: 'A deep dive into your current market positioning and a roadmap to the top of the ladder.'
              },
              {
                icon: <Camera className="text-brand-secondary" size={32} />,
                title: 'Branding Media',
                desc: 'High-end photography and video that makes you look like the $100M agent you are.'
              },
              {
                icon: <UserCircle className="text-brand-secondary" size={32} />,
                title: 'AI Avatar Branding',
                desc: 'Scale your content production with cutting-edge AI avatars that speak your message.'
              }
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">{service.desc}</p>
                <Link to="/booking" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-secondary opacity-0 group-hover:opacity-100 transition-all">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 bg-gray-200">
                {bookCoverUrl ? (
                  <img
                    src={bookCoverUrl}
                    alt="The Go-To Agent Blueprint Book"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Loading Cover...
                  </div>
                )}
              </div>
            </div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-brand-primary mb-8 leading-tight">
                From Overlooked to In Demand: <br />
                <span className="text-brand-secondary">The Go-To Agent Blueprint</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                This book explains the full Go-To Ladder framework and shows agents how to move from being overlooked in their market to becoming the professional clients naturally choose.
              </p>
              <Link to="/resources" className="btn-primary text-xl px-10 py-4 inline-flex items-center gap-2">
                View the Blueprint <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-secondary">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl text-brand-primary mb-8">Ready to climb the ladder?</h2>
          <p className="text-xl text-brand-primary/80 mb-12 max-w-2xl mx-auto">
            Book your Go-To Ladder Audit today and discover the gaps in your market authority.
          </p>
          <Link to="/booking" className="btn-secondary text-xl px-12 py-5 inline-block">
            Book My Audit Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
