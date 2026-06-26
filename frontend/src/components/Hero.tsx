/**
 * Hero component - Landing section with headline, subtitle, and feature badges.
 */

import React from 'react';
import {
  RiSparklingFill,
  RiBloggerLine,
  RiInstagramLine,
  RiMailLine,
  RiYoutubeLine,
  RiLinkedinBoxLine,
} from 'react-icons/ri';

// Floating icon card for visual decoration
interface FloatCardProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  delay?: string;
}

const FloatCard: React.FC<FloatCardProps> = ({ icon, label, className = '', delay = '0s' }) => (
  <div
    className={`glass-card px-3 py-2 flex items-center gap-2 text-sm font-medium text-slate-300 animate-float ${className}`}
    style={{ animationDelay: delay }}
  >
    <span className="text-brand-400 text-base">{icon}</span>
    <span>{label}</span>
  </div>
);

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background gradient orbs */}
      <div className="orb orb-blue w-[600px] h-[600px] -top-40 -left-40 animate-pulse-slow" />
      <div className="orb orb-purple w-[500px] h-[500px] -bottom-20 -right-32 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="orb orb-blue w-[300px] h-[300px] top-1/3 right-1/4 opacity-10 animate-pulse-slow" style={{ animationDelay: '4s' }} />

      {/* Grid background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating content type badges */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="absolute top-32 left-16">
          <FloatCard icon={<RiBloggerLine />} label="Blog Post" delay="0s" />
        </div>
        <div className="absolute top-48 right-20">
          <FloatCard icon={<RiLinkedinBoxLine />} label="LinkedIn Post" delay="1s" />
        </div>
        <div className="absolute bottom-48 left-12">
          <FloatCard icon={<RiInstagramLine />} label="Instagram Caption" delay="2s" />
        </div>
        <div className="absolute top-64 left-1/4">
          <FloatCard icon={<RiMailLine />} label="Email Template" delay="0.5s" />
        </div>
        <div className="absolute bottom-56 right-16">
          <FloatCard icon={<RiYoutubeLine />} label="YouTube Script" delay="1.5s" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Top badge */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-brand-500/30 text-sm text-brand-300 font-medium">
            <RiSparklingFill className="text-brand-400 animate-pulse" />
            Powered by OpenRouter AI
            <RiSparklingFill className="text-accent-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Main headline */}
        <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl text-white mb-6 animate-slide-up">
          Create{' '}
          <span className="gradient-text">Brilliant Content</span>
          <br />
          <span className="text-slate-300 font-light">in Seconds</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          ContentCraft AI harnesses the power of OpenRouter to generate professional
          blog posts, social media captions, marketing copy, and more — tailored to your
          exact tone and style.
        </p>

        {/* Stats row */}
        <div
          className="flex flex-wrap justify-center gap-8 text-center animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {[
            { value: '7+', label: 'Content Types' },
            { value: '5', label: 'Tones' },
            { value: '∞', label: 'Possibilities' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="heading-display text-3xl gradient-text font-semibold">{stat.value}</span>
              <span className="text-slate-500 text-sm mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-16 flex justify-center animate-bounce"
          style={{ animationDelay: '1s' }}
        >
          <div className="flex flex-col items-center gap-2 text-slate-600 text-xs">
            <span>Scroll to start creating</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
