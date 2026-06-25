/**
 * ContentCraft AI - Main App Component
 * Orchestrates all components and manages global state including
 * content generation results and localStorage history.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ContentForm from './components/ContentForm';
import OutputCard from './components/OutputCard';
import HistorySection from './components/HistorySection';
import Footer from './components/Footer';
import type { HistoryItem, ContentType, Tone, Length } from './types';

// ─────────────────────────────────────────────
// localStorage key
// ─────────────────────────────────────────────
const HISTORY_STORAGE_KEY = 'contentcraft_history';

// ─────────────────────────────────────────────
// Toast component (simple inline)
// ─────────────────────────────────────────────
interface ToastProps {
  message: string;
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  if (!visible) return null;
  return (
    <div className="toast toast-success">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  );
};

// ─────────────────────────────────────────────
// App Component
// ─────────────────────────────────────────────

const App: React.FC = () => {
  // Current generated content item
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  // Loading state for generation
  const [isLoading, setIsLoading] = useState(false);
  // History stored in state (synced to localStorage)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  // Toast notification
  const [toast, setToast] = useState({ message: '', visible: false });

  // Ref for auto-scroll to output
  const outputRef = useRef<HTMLDivElement>(null);

  // Sync history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      console.warn('Failed to save history to localStorage');
    }
  }, [history]);

  // Show a toast notification
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  // Handle content generated from the form
  const handleContentGenerated = useCallback((item: HistoryItem) => {
    setCurrentItem(item);
    // Add to history (newest first, cap at 50 items)
    setHistory(prev => [item, ...prev].slice(0, 50));
    showToast('Content generated successfully!');
    // Scroll to output
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  // Handle delete history item
  const handleDelete = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    // Also clear current if it was deleted
    setCurrentItem(prev => prev?.id === id ? null : prev);
    showToast('Item deleted from history');
  }, []);

  // Handle reuse: populate form with previous item's settings
  // We pass a callback up through a ref approach (simpler for this architecture)
  const [reuseData, setReuseData] = useState<{
    content_type: ContentType;
    topic: string;
    tone: Tone;
    length: Length;
  } | null>(null);

  const handleReuse = useCallback((item: HistoryItem) => {
    setReuseData({
      content_type: item.content_type,
      topic: item.topic,
      tone: item.tone,
      length: item.length,
    });
    setCurrentItem(item);
    showToast('Configuration loaded! Modify and regenerate.');
    // Scroll to generator
    setTimeout(() => {
      document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-surface-900 flex flex-col overflow-x-hidden">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {/* Background gradient decoration */}
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

        {/* Content Generator Form */}
        <ContentForm
          key={reuseData ? JSON.stringify(reuseData) : 'default'}
          onContentGenerated={handleContentGenerated}
          onContentLoading={setIsLoading}
          initialData={reuseData || undefined}
        />

        {/* Generated Output */}
        <div ref={outputRef}>
          <OutputCard item={currentItem} isLoading={isLoading} />
        </div>

        {/* Section Divider */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <hr className="divider" />
        </div>

        {/* History Section */}
        <HistorySection
          history={history}
          onDelete={handleDelete}
          onReuse={handleReuse}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast notification */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
};

export default App;
