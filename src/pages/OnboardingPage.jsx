import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import image from "../assets/image.png";
import { ArrowRight, Truck, Users, BarChart3, Shield, Zap, User2, CheckCircle2, Star, Fuel, Clock } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
import Aos from "aos";
import 'aos/dist/aos.css';

function OnboardingPage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    Aos.init({
      offset: 80,
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
    });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const features = [
    { icon: Zap, title: "30-min delivery", description: "Rapid response network gets fuel to your door fast", color: "#f2fd7d", tag: "SPEED" },
    { icon: Shield, title: "Verified drivers", description: "Background-checked, certified, and insured every time", color: "#4ade80", tag: "SAFETY" },
    { icon: BarChart3, title: "Live GPS tracking", description: "Watch your delivery in real-time on an interactive map", color: "#60a5fa", tag: "TRACKING" },
    { icon: Users, title: "24/7 support", description: "Round-the-clock help whenever you need assistance", color: "#f472b6", tag: "SUPPORT" },
  ];

  const stats = [
    { value: "1,200+", label: "Customers", icon: Users },
    { value: "350+", label: "Drivers", icon: Truck },
    { value: "99.8%", label: "Success rate", icon: CheckCircle2 },
  ];

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        backgroundColor: '#000',
        backgroundImage: 'radial-gradient(circle, #1e1e1e 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f1f1f]/80" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#f2fd7d] rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-technor font-bold text-xl tracking-tight text-white">PetRide</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['About', 'Features', 'How It Works'].map((item) => (
              <a key={item} href={`#${item}`} className="font-switzer text-[#666] hover:text-white transition-colors text-sm tracking-wide">
                {item}
              </a>
            ))}
          </div>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/signin" className="hidden sm:block font-switzer text-[#666] hover:text-white transition-colors text-sm">
                Sign in
              </Link>
              <Link to="/signup">
                <button className="font-switzer bg-[#f2fd7d] text-black px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-all">
                  Get started
                </button>
              </Link>
            </div>
          ) : (
            <Link to={user.user?.role === 'customer' ? "/customer/dashboard" : user.user?.role === 'driver' ? "/driver/dashboard" : "/admin"}>
              <button className="font-switzer bg-[#f2fd7d] text-black px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-all inline-flex items-center gap-2">
                <User2 className="w-4 h-4" /> Dashboard
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">

        {/* Mouse-tracked glow */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-700"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(242,253,125,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Diagonal accent line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-px h-[140%] bg-gradient-to-b from-transparent via-[#f2fd7d]/20 to-transparent"
            style={{ left: '62%', top: '-20%', transform: 'rotate(12deg)' }}
          />
          <div
            className="absolute w-px h-[140%] bg-gradient-to-b from-transparent via-[#f2fd7d]/8 to-transparent"
            style={{ left: '66%', top: '-20%', transform: 'rotate(12deg)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

            {/* Left — Text */}
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-8" data-aos="fade-up">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f2fd7d] animate-pulse" />
                <span className="font-switzer text-[#f2fd7d] text-xs tracking-[0.2em] uppercase font-semibold">
                  Fuel delivery, redefined
                </span>
              </div>

              {/* Headline */}
              <div data-aos="fade-up" data-aos-delay="100">
                <h1 className="font-technor font-black leading-[0.9] mb-6" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}>
                  <span className="block text-white">FUEL</span>
                  <span className="block text-white">ON</span>
                  <span className="block" style={{ WebkitTextStroke: '1px #f2fd7d', color: 'transparent' }}>DEMAND</span>
                </h1>
              </div>

              <p className="font-switzer text-[#666] text-lg leading-relaxed max-w-md mb-10" data-aos="fade-up" data-aos-delay="200">
                Professional fuel delivery connecting customers with verified drivers. Order anywhere, track in real-time, receive at your door.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12" data-aos="fade-up" data-aos-delay="300">
                {!user ? (
                  <>
                    <Link to="/signup">
                      <button className="group font-switzer bg-[#f2fd7d] text-black px-8 py-4 rounded-xl font-bold text-base flex items-center gap-3 hover:opacity-90 transition-all hover:gap-4">
                        Start ordering
                        <ArrowRight className="w-5 h-5 transition-all" />
                      </button>
                    </Link>
                    <Link to="/signin">
                      <button className="font-switzer border border-[#2a2a2a] text-[#888] px-8 py-4 rounded-xl font-medium text-base hover:border-[#444] hover:text-white transition-all">
                        Sign in
                      </button>
                    </Link>
                  </>
                ) : (
                  <Link to={user.user?.role === 'customer' ? "/customer/dashboard" : "/driver/dashboard"}>
                    <button className="group font-switzer bg-[#f2fd7d] text-black px-8 py-4 rounded-xl font-bold text-base flex items-center gap-3 hover:opacity-90 transition-all">
                      Go to dashboard <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                )}
              </div>

              {/* Inline stats */}
              <div className="flex items-center gap-8 pt-8 border-t border-[#1f1f1f]" data-aos="fade-up" data-aos-delay="400">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="font-technor font-bold text-2xl text-white">{stat.value}</p>
                    <p className="font-switzer text-[#555] text-xs mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Image + floating cards */}
            <div className="relative hidden lg:block" data-aos="fade-left" data-aos-delay="200">
              {/* Main image container */}
              <div className="relative">
                <div
                  className="w-full aspect-square rounded-3xl overflow-hidden flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #111 50%, #0a0a0a 100%)', border: '1px solid #1f1f1f' }}
                >
                  <img src={image} alt="PetRide" className="w-3/4 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
                </div>

                {/* Floating card — top left */}
                <div
                  className="absolute -top-4 -left-8 bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                >
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-satoshi text-xs text-white font-semibold">Driver assigned</p>
                    <p className="font-switzer text-[10px] text-[#555]">ETA 12 minutes</p>
                  </div>
                </div>

                {/* Floating card — bottom right */}
                <div
                  className="absolute -bottom-4 -right-8 bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl px-4 py-3"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-3 h-3 text-[#f2fd7d] fill-[#f2fd7d]" />
                    <span className="font-technor text-white text-sm font-bold">4.9</span>
                  </div>
                  <p className="font-switzer text-[10px] text-[#555]">1,200+ reviews</p>
                </div>

                {/* Floating pill — bottom left */}
                <div className="absolute bottom-8 -left-6 bg-[#f2fd7d] rounded-full px-4 py-2 flex items-center gap-2">
                  <Fuel className="w-3.5 h-3.5 text-black" />
                  <span className="font-switzer text-black text-xs font-bold">50L delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ───────────────────────────────── */}
      <div className="border-y border-[#1f1f1f] py-4 overflow-hidden bg-[#050505]">
        <div className="flex gap-12 animate-marquee whitespace-nowrap" style={{ animation: 'marquee 20s linear infinite' }}>
          {['Premium Fuel', 'Verified Drivers', 'Real-time Tracking', 'Fast Delivery', 'Secure Payments', '24/7 Support', 'GPS Navigation', 'Doorstep Delivery'].concat(
           ['Premium Fuel', 'Verified Drivers', 'Real-time Tracking', 'Fast Delivery', 'Secure Payments', '24/7 Support', 'GPS Navigation', 'Doorstep Delivery']
          ).map((item, i) => (
            <span key={i} className="font-technor text-sm text-[#333] tracking-widest uppercase flex items-center gap-4">
              {item}
              <span className="text-[#f2fd7d]">✦</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section id="Features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section header — asymmetric */}
          <div className="grid lg:grid-cols-2 gap-8 mb-20" data-aos="fade-up">
            <div>
              <span className="font-switzer text-[#f2fd7d] text-xs tracking-[0.25em] uppercase font-semibold block mb-4">
                Why PetRide
              </span>
              <h2 className="font-technor font-black text-5xl md:text-6xl leading-none text-white">
                BUILT FOR<br />
                <span style={{ WebkitTextStroke: '1px #444', color: 'transparent' }}>SPEED.</span>
              </h2>
            </div>
            <div className="flex items-end">
              <p className="font-switzer text-[#555] text-lg leading-relaxed">
                Everything you need for seamless fuel delivery in one platform. No friction, no waiting — just fuel where you need it.
              </p>
            </div>
          </div>

          {/* Feature cards — alternating layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="relative group rounded-2xl p-6 border cursor-pointer transition-all duration-300"
                style={{
                  background: hoveredFeature === i ? '#0d0d0d' : '#080808',
                  borderColor: hoveredFeature === i ? feature.color + '40' : '#1a1a1a',
                  transform: hoveredFeature === i ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                <span className="font-switzer text-[10px] tracking-[0.2em] uppercase font-bold mb-4 block" style={{ color: feature.color }}>
                  {feature.tag}
                </span>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
                  style={{ background: hoveredFeature === i ? feature.color + '20' : '#111' }}
                >
                  <feature.icon className="w-6 h-6 transition-all" style={{ color: feature.color }} />
                </div>
                <h3 className="font-satoshi font-bold text-lg text-white mb-3">{feature.title}</h3>
                <p className="font-switzer text-[#555] text-sm leading-relaxed">{feature.description}</p>

                {/* Corner accent */}
                <div
                  className="absolute bottom-0 right-0 w-16 h-16 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(circle at 100% 100%, ${feature.color}15, transparent 70%)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section id="How It Works" className="py-32 px-6 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent, #050505 20%, #050505 80%, transparent)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <span className="font-switzer text-[#f2fd7d] text-xs tracking-[0.25em] uppercase font-semibold block mb-4">Process</span>
            <h2 className="font-technor font-black text-5xl md:text-7xl text-white leading-none">
              3 STEPS.<br />
              <span style={{ WebkitTextStroke: '1px #333', color: 'transparent' }}>THAT'S IT.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />

            {[
              { step: "01", title: "Place order", desc: "Choose fuel type, quantity, and drop your location pin.", icon: Fuel, color: '#f2fd7d' },
              { step: "02", title: "Track live", desc: "Watch your driver move toward you on a real-time map.", icon: BarChart3, color: '#60a5fa' },
              { step: "03", title: "Receive fuel", desc: "Driver arrives, delivers safely, you're fueled and ready.", icon: CheckCircle2, color: '#4ade80' },
            ].map((item, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 120}
                className="relative group"
              >
                <div
                  className="rounded-2xl p-8 border transition-all duration-300 hover:border-[#2a2a2a]"
                  style={{ background: '#080808', borderColor: '#141414' }}
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="font-technor font-black text-7xl leading-none" style={{ color: '#111', WebkitTextStroke: '1px #222' }}>
                      {item.step}
                    </span>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ background: item.color + '15' }}
                    >
                      <item.icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                  </div>
                  <h3 className="font-satoshi font-bold text-xl text-white mb-3">{item.title}</h3>
                  <p className="font-switzer text-[#555] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS BENTO ──────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="font-switzer text-[#f2fd7d] text-xs tracking-[0.25em] uppercase font-semibold block mb-4">Everything included</span>
            <h2 className="font-technor font-black text-4xl md:text-5xl text-white">WHAT YOU GET</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3" data-aos="fade-up">
            {[
              { label: "No minimum order", icon: CheckCircle2 },
              { label: "Transparent pricing", icon: CheckCircle2 },
              { label: "Multiple payments", icon: CheckCircle2 },
              { label: "Eco-friendly delivery", icon: CheckCircle2 },
              { label: "Same-day scheduling", icon: CheckCircle2 },
              { label: "Premium fuel quality", icon: CheckCircle2 },
            ].map((b, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 px-5 py-4 rounded-xl border border-[#141414] bg-[#080808] hover:border-[#f2fd7d]/20 transition-all hover:bg-[#0d0d0d]"
              >
                <div className="w-6 h-6 rounded-md bg-[#f2fd7d]/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#f2fd7d]" />
                </div>
                <span className="font-switzer text-[#888] text-sm group-hover:text-white transition-colors">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-32 px-6" id="About">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
            style={{ background: '#080808', border: '1px solid #1f1f1f' }}
            data-aos="fade-up"
          >
            {/* Background accent */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(242,253,125,0.12) 0%, transparent 60%)',
              }}
            />
            {/* Top border glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#f2fd7d]/50 to-transparent" />

            <div className="relative z-10">
              <span className="font-switzer text-[#f2fd7d] text-xs tracking-[0.25em] uppercase font-semibold block mb-6">Get started today</span>
              <h2 className="font-technor font-black leading-none mb-6 text-white" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                READY TO<br />FUEL UP?
              </h2>
              <p className="font-switzer text-[#555] text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Join thousands using PetRide for fast, reliable fuel delivery. Sign up in under a minute.
              </p>
              <Link to="/signup">
                <button className="group font-switzer bg-[#f2fd7d] text-black px-12 py-5 rounded-xl font-bold text-lg inline-flex items-center gap-3 hover:opacity-90 transition-all hover:gap-4">
                  Create free account
                  <ArrowRight className="w-5 h-5 transition-all" />
                </button>
              </Link>
              <p className="font-switzer text-[#333] text-sm mt-6">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-[#111] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-[#f2fd7d] rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-black" strokeWidth={2.5} />
                </div>
                <span className="font-technor font-bold text-xl text-white">PetRide</span>
              </div>
              <p className="font-switzer text-[#444] text-sm leading-relaxed max-w-xs">
                Professional on-demand fuel delivery. Fast, verified, always available.
              </p>
            </div>

            <div>
              <h4 className="font-satoshi font-semibold text-white text-sm mb-5">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Careers', 'Contact'].map((item) => (
                  <li key={item}><a href="#" className="font-switzer text-[#444] text-sm hover:text-[#f2fd7d] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-satoshi font-semibold text-white text-sm mb-5">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}><a href="#" className="font-switzer text-[#444] text-sm hover:text-[#f2fd7d] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#111] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-switzer text-[#333] text-sm">© 2026 PetRide. All rights reserved.</p>
            <p className="font-technor text-[#222] text-xs tracking-widest">FUEL · FAST · SAFE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default OnboardingPage;