/**
 * Footer component - Application footer with links and copyright.
 */

import React from 'react';
import { RiSparklingFill, RiGithubFill, RiHeartFill } from 'react-icons/ri';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative mt-auto">
      {/* Gradient fade-in separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Glow orb above footer */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative bg-surface-900/50 backdrop-blur-xl py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Top row: Brand + description */}
          <div className="flex flex-col items-center text-center mb-8">
            {/* Logo */}
            <div className="w-12 h-12 rounded-2xl bg-button-gradient flex items-center justify-center mb-4 shadow-md glow-blue">
              <RiSparklingFill className="text-white text-xl" />
            </div>

            <h3 className="font-display font-semibold text-xl text-white mb-2">
              <span className="gradient-text">ContentCraft</span> AI
            </h3>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Harness the power of Google Gemini to create professional content
              for every platform in seconds.
            </p>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              'Blog Posts',
              'LinkedIn Posts',
              'Instagram Captions',
              'Product Descriptions',
              'Email Templates',
              'Marketing Copy',
              'YouTube Scripts',
            ].map(feature => (
              <span key={feature} className="badge badge-blue text-xs">
                {feature}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div className="divider mb-6" />

          {/* Bottom row: Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>© {currentYear} ContentCraft AI. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Built with</span>
              <RiHeartFill className="text-red-400 text-xs animate-pulse" />
              <span>using</span>
              <span className="text-brand-400 font-medium">React</span>
              <span>+</span>
              <span className="text-emerald-400 font-medium">FastAPI</span>
              <span>+</span>
              <span className="text-purple-400 font-medium">Gemini AI</span>
            </div>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <RiGithubFill className="text-sm" />
              <span>View Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
