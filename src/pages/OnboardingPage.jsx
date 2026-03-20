import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import image from "../assets/image.png";
import { ArrowRight, Truck, Users, BarChart3, Shield, Zap, User2, CheckCircle2, Star } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
import Aos from "aos";
import 'aos/dist/aos.css';

function OnboardingPage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    Aos.init({ 
      offset: 120,
      duration: 800,
      easing: 'ease-out-cubic',
      delay: 0,
      once: true,
      mirror: false,});
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get fuel delivered to your location in under 30 minutes with our rapid response network",
      color: "#f2fd7d"
    },
    {
      icon: Shield,
      title: "Verified & Safe",
      description: "All drivers are background-checked, certified, and insured for your peace of mind",
      color: "#4ade80"
    },
    {
      icon: BarChart3,
      title: "Live Tracking",
      description: "Monitor your delivery in real-time with GPS tracking and instant notifications",
      color: "#60a5fa"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Round-the-clock customer service ready to help whenever you need assistance",
      color: "#f472b6"
    }
  ];

  const benefits = [
    "No minimum order required",
    "Transparent pricing",
    "Multiple payment options",
    "Eco-friendly delivery",
    "Same-day scheduling",
    "Premium fuel quality"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f2fd7d] to-[#d4e157] rounded-xl flex items-center justify-center shadow-lg shadow-[#f2fd7d]/20">
              <Truck className="w-5 h-5 text-black" />
            </div>
            <h1 className="font-['Inter',sans-serif] font-bold text-2xl tracking-tight">
              Pet<span className="text-[#f2fd7d]">Ride</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="#About" className="text-[#888] hover:text-white transition-colors text-sm font-medium hidden sm:block">
              About
            </a>
            <a href="#features" className="text-[#888] hover:text-white transition-colors text-sm font-medium hidden sm:block">
              Features
            </a>
            <a href="#How It Works" className="text-[#888] hover:text-white transition-colors text-sm font-medium hidden sm:block">
              How It Works
            </a>
          </div>
          {!user ?
          <div className="flex items-center gap-4">
            <Link 
              to="/signin" 
              className="text-[#888] hover:text-white transition-colors text-sm font-medium hidden sm:block"
            >
              Sign In
            </Link>
            <Link to="/signup">
              <button className="bg-[#f2fd7d] text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-[#f2fd7d]/20">
                Get Started
              </button>
            </Link>
          </div>
          :
          <div className="flex items-center gap-4">
            <Link to={user.user?.role === 'customer' ? "/customer/dashboard" : user.user?.role === 'driver' ? "/driver/dashboard" : "/admin"}>
              <button className="bg-[#f2fd7d] text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-[#f2fd7d]/20">
              <User2 className="w-4 h-4 mr-2 inline" />
                Dashboard
              </button>
            </Link>
          </div>
          }
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#f2fd7d]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f2fd7d]/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#f2fd7d]/10 border border-[#f2fd7d]/30 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-[#f2fd7d] fill-[#f2fd7d]" />
            <span className="text-sm text-[#f2fd7d] font-medium">Trusted by 1000+ customers</span>
          </div>

          <img 
            src={image} 
            alt="PetRide Fuel Delivery" 
            className="mx-auto mb-12 max-w-md hover:scale-105 transition-transform duration-500" 
          />
          
          <h1 className="font-['Inter',sans-serif] font-bold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Fuel Delivery
            <br />
            <span className="text-[#f2fd7d] inline-block hover:scale-105 transition-transform">
              Simplified.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-12 font-['Manrope',sans-serif] leading-relaxed">
            Professional fuel delivery service connecting customers with verified drivers. 
            Order premium fuel anytime, anywhere with real-time tracking and instant updates.
          </p>

          { !user ? 
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/signup">
              <button className="bg-[#f2fd7d] text-black px-8 py-4 rounded-full font-semibold text-base flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-[#f2fd7d]/30 group">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/signin">
              <button className="border border-[#343434] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-[#1f1f1f] hover:border-[#555] transition-all">
                Sign In
              </button>
            </Link>
          </div>
          : 
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to={user.user?.role === 'customer' ? "/customer/dashboard" : user.user?.role === 'driver' ? "/driver/dashboard" : "/admin"}>

              <button className="bg-[#f2fd7d] text-black px-8 py-4 rounded-full font-semibold text-base flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-[#f2fd7d]/30 group">
                Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
          }

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto py-8" data-aos="fade-up">
            {[
              { value: "1,200+", label: "Happy Customers", icon: Users },
              { value: "350+", label: "Verified Drivers", icon: Truck },
              { value: "99.8%", label: "Success Rate", icon: CheckCircle2 }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#f2fd7d]/50 transition-all hover:scale-105 group"
              >
                <stat.icon className="w-8 h-8 text-[#f2fd7d] mb-3 mx-auto group-hover:scale-110 transition-transform" />
                <div className="text-3xl md:text-4xl font-bold text-[#f2fd7d] mb-1">{stat.value}</div>
                <div className="text-[#888] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative" id="features">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-[#f2fd7d] text-sm font-semibold uppercase tracking-wider">Features</span>
            <h2 className="font-['Inter',sans-serif] font-bold text-4xl md:text-5xl mb-4 mt-2">
              Why Choose PetRide?
            </h2>
            <p className="text-[#888] text-lg max-w-2xl mx-auto">
              Everything you need for seamless fuel delivery management in one powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" data-aos="fade-up">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#f2fd7d] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#f2fd7d]/10 cursor-pointer group"
              >
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all
                  ${hoveredFeature === index ? 'bg-[#f2fd7d] scale-110' : 'bg-[#1f1f1f]'}
                `}>
                  <feature.icon 
                    className={`w-7 h-7 transition-colors ${hoveredFeature === index ? 'text-black' : 'text-[#f2fd7d]'}`} 
                  />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-white group-hover:text-[#f2fd7d] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#888] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-8 md:p-12" >
            <h3 className="font-['Inter',sans-serif] font-bold text-2xl md:text-3xl mb-8 text-center" data-aos="fade-up">
              Additional Benefits
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" data-aos="fade-up">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 bg-[#0a0a0a] rounded-xl border border-[#1f1f1f] hover:border-[#f2fd7d]/50 transition-all group"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#f2fd7d] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-[#ccc] group-hover:text-white transition-colors">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6" id="How It Works" data-aos="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#f2fd7d] text-sm font-semibold uppercase tracking-wider">Process</span>
            <h2 className="font-['Inter',sans-serif] font-bold text-4xl md:text-5xl mb-4 mt-2">
              How It Works
            </h2>
            <p className="text-[#888] text-lg">
              Get fuel delivered in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Place Order", desc: "Select fuel type, quantity, and delivery location in seconds", icon: Truck },
              { step: "02", title: "Track Delivery", desc: "Monitor your driver's location in real-time on the map", icon: BarChart3 },
              { step: "03", title: "Receive Fuel", desc: "Get your fuel delivered safely to your exact location", icon: CheckCircle2 }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8 hover:border-[#f2fd7d] transition-all hover:scale-105 group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-6xl font-bold text-[#1f1f1f] group-hover:text-[#f2fd7d]/20 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center group-hover:bg-[#f2fd7d] transition-all">
                      <item.icon className="w-6 h-6 text-[#f2fd7d] group-hover:text-black transition-colors" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-2 text-white">{item.title}</h3>
                  <p className="text-[#888]">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#1f1f1f] to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#f2fd7d]/10 via-[#f2fd7d]/5 to-transparent border border-[#f2fd7d]/30 rounded-3xl p-12 md:p-16 overflow-hidden">
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f2fd7d]/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <h2 className="font-['Inter',sans-serif] font-bold text-3xl md:text-5xl mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-[#888] text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers using PetRide for fast, reliable fuel delivery
              </p>
              <Link to="/signup">
                <button className="bg-[#f2fd7d] text-black px-10 py-4 rounded-full font-semibold text-lg flex items-center gap-2 mx-auto hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-[#f2fd7d]/30 group">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <p className="text-[#555] text-sm mt-6">
                No credit card required • Free to sign up • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f1f1f] py-12 px-6 bg-[#0a0a0a]" id="About">
        <div className="max-w-6xl mx-auto">
          
          {/* Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f2fd7d] to-[#d4e157] rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-black" />
                </div>
                <h1 className="font-['Inter',sans-serif] font-bold text-2xl">
                  Pet<span className="text-[#f2fd7d]">Ride</span>
                </h1>
              </div>
              <p className="text-[#888] mb-4 max-w-md">
                Professional on-demand fuel delivery service. Fast, reliable, and always available when you need us.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-[#888]">
                <li><a href="#" className="hover:text-[#f2fd7d] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#f2fd7d] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#f2fd7d] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-[#888]">
                <li><a href="#" className="hover:text-[#f2fd7d] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#f2fd7d] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#f2fd7d] transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#1f1f1f] pt-8 text-center">
            <p className="text-[#555] text-sm">
              &copy; 2026 PetRide. All rights reserved. Built with ❤️ for better fuel delivery.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default OnboardingPage;