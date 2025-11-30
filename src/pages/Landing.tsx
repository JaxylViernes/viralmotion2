import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);

  // 🎯 REPLACE THESE WITH YOUR CLOUDINARY GIF URLS
  const showcaseGifs = [
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763462261/2ad1296b-c166-43a7-9eb1-502e09bcfba7_rcdrjg.gif',
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763458547/ba1676dd-5925-4702-bc2a-5168da46fae3_vpg5p3.gif',
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763455882/NeonFlickerTitle_un2ykp.gif',
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457721/fa06d6f0-6fcd-4158-b461-bcbbcdbe1bd2_pzbe8z.gif',
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763458547/ba1676dd-5925-4702-bc2a-5168da46fae3_vpg5p3.gif',
  ];

  // Auto-rotate GIFs every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGifIndex((prev) => (prev + 1) % showcaseGifs.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [showcaseGifs.length]);

  const nextGif = () => {
    setCurrentGifIndex((prev) => (prev + 1) % showcaseGifs.length);
  };

  const prevGif = () => {
    setCurrentGifIndex((prev) => (prev - 1 + showcaseGifs.length) % showcaseGifs.length);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                <Sparkles className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                ViralMotion
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-violet-600 transition font-medium">Features</a>
              <a href="#templates" className="text-gray-600 hover:text-violet-600 transition font-medium">Templates</a>
              <a href="#pricing" className="text-gray-600 hover:text-violet-600 transition font-medium">Pricing</a>
              <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-violet-600 transition font-medium">
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3">
            <a href="#features" className="block text-gray-600 hover:text-violet-600 transition font-medium">Features</a>
            <a href="#templates" className="block text-gray-600 hover:text-violet-600 transition font-medium">Templates</a>
            <a href="#pricing" className="block text-gray-600 hover:text-violet-600 transition font-medium">Pricing</a>
            <button onClick={() => navigate('/login')} className="block w-full text-left text-gray-600 hover:text-violet-600 transition font-medium">
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="block w-full px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg text-center"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="text-center md:text-left space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold border border-violet-200">
                🚀 AI-Powered Video Creation
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Create
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                {' '}Viral Videos{' '}
              </span>
              in Seconds
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Transform your ideas into stunning TikTok-style animations with AI-powered templates. No design skills required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => navigate('/signup')}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Start Creating Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </button>
              <button className="px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-violet-300 hover:text-violet-600 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
                <div className="text-sm text-gray-600 mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-gray-600 mt-1">Templates</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">1M+</div>
                <div className="text-sm text-gray-600 mt-1">Videos Created</div>
              </div>
            </div>
          </div>

          {/* Right Content - GIF Carousel */}
          <div className="relative">
            <div className="relative animate-float">
              {/* Main Preview Card with GIF Carousel */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50">
                <div className="bg-black rounded-2xl h-96 relative overflow-hidden group">
                  {/* GIF Display */}
                  <img
                    key={currentGifIndex}
                    src={showcaseGifs[currentGifIndex]}
                    alt={`Template showcase ${currentGifIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Navigation Arrows */}
                    <button
                      onClick={prevGif}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                      <ChevronLeft className="text-white" size={24} />
                    </button>
                    <button
                      onClick={nextGif}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                      <ChevronRight className="text-white" size={24} />
                    </button>

                    {/* Bottom Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-semibold">
                          Template Preview {currentGifIndex + 1}/{showcaseGifs.length}
                        </span>
                        <button 
                          onClick={() => navigate('/signup')}
                          className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/30 transition"
                        >
                          Use This
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {showcaseGifs.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentGifIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentGifIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75 w-2'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 flex items-center justify-center animate-float" style={{animationDelay: '0.5s'}}>
                <span className="text-3xl">✨</span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                <span className="text-3xl">🎬</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold border border-violet-200">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">Everything You Need to Go Viral</h2>
            <p className="text-xl text-gray-600">Powerful tools designed for creators</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                gradient: 'from-blue-500 to-cyan-500',
                title: 'AI-Powered Templates',
                desc: 'Choose from 50+ professionally designed templates optimized for social media engagement.'
              },
              {
                icon: '⚡',
                gradient: 'from-green-500 to-emerald-500',
                title: 'Instant Rendering',
                desc: 'Generate high-quality videos in minutes with our powerful cloud rendering engine.'
              },
              {
                icon: '🎭',
                gradient: 'from-purple-500 to-pink-500',
                title: 'Custom Branding',
                desc: 'Upload your logos, use custom fonts, and maintain brand consistency across all videos.'
              },
              {
                icon: '📊',
                gradient: 'from-orange-500 to-red-500',
                title: 'Analytics Dashboard',
                desc: 'Track performance and optimize your content with detailed analytics and insights.'
              },
              {
                icon: '🔄',
                gradient: 'from-indigo-500 to-blue-500',
                title: 'Batch Processing',
                desc: 'Create multiple video variations at once with our intelligent batch rendering system.'
              },
              {
                icon: '📤',
                gradient: 'from-pink-500 to-rose-500',
                title: 'Easy Sharing',
                desc: 'Export directly to TikTok, Instagram, YouTube and more with optimized formats.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10"></div>
            
            <div className="relative z-10 text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Create
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {' '}Viral Content?
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of creators who are already using ViralMotion to grow their audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all"
                >
                  Start Free Trial
                </button>
                <button className="px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-violet-300 hover:text-violet-600 transition-all">
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              ViralMotion
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">© 2024 ViralMotion. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};