/**
 * Navbar component - Top navigation bar with logo and branding.
 */

import React, { useEffect, useState } from 'react';
import { RiSparklingFill } from 'react-icons/ri';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  // Add shadow/blur on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-900/90 backdrop-blur-xl border-b border-white/8 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-button-gradient flex items-center justify-center shadow-md glow-blue">
                <RiSparklingFill className="text-white text-lg" />
              </div>
              {/* Animated ping dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-surface-900 animate-pulse-slow" />
            </div>

            {/* Brand Name */}
            <div>
              <span className="font-display font-700 text-lg leading-none">
                <span className="gradient-text font-semibold">ContentCraft</span>
                <span className="text-white font-light ml-1 opacity-80">AI</span>
              </span>
            </div>
          </div>

          {/* Right side badges */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex badge badge-blue text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Gemini Powered
            </span>
            <span className="badge badge-purple text-xs hidden md:flex">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
