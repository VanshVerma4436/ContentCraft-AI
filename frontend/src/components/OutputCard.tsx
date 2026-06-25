/**
 * OutputCard component - Displays generated AI content with copy & download actions.
 */

import React, { useState, useEffect } from 'react';
import {
  RiSparklingFill,
  RiFileCopyLine,
  RiDownloadLine,
  RiCheckLine,
  RiLoader4Fill,
} from 'react-icons/ri';
import type { HistoryItem } from '../types';

// ─────────────────────────────────────────────
// Shimmer loading skeleton
// ─────────────────────────────────────────────

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    {[100, 85, 95, 70, 88, 60].map((w, i) => (
      <div
        key={i}
        className="shimmer h-4 rounded-lg"
        style={{ width: `${w}%` }}
      />
    ))}
    <div className="shimmer h-4 rounded-lg w-3/4 mt-2" />
    <br />
    {[90, 75, 80, 65].map((w, i) => (
      <div
        key={`b-${i}`}
        className="shimmer h-4 rounded-lg"
        style={{ width: `${w}%` }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface OutputCardProps {
  item: HistoryItem | null;
  isLoading: boolean;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const OutputCard: React.FC<OutputCardProps> = ({ item, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Calculate word and char counts
  useEffect(() => {
    if (item?.generated_content) {
      setCharCount(item.generated_content.length);
      setWordCount(item.generated_content.trim().split(/\s+/).filter(Boolean).length);
    }
  }, [item]);

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!item?.generated_content) return;
    try {
      await navigator.clipboard.writeText(item.generated_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = item.generated_content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle download as TXT
  const handleDownload = () => {
    if (!item?.generated_content) return;
    const filename = `${item.content_type.replace(/\s+/g, '_')}_${item.topic.slice(0, 30).replace(/\s+/g, '_')}.txt`;
    const blob = new Blob([item.generated_content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Empty state (no content generated yet)
  if (!item && !isLoading) {
    return (
      <section id="output" className="relative py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="glass-card p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-6">
              <RiSparklingFill className="text-4xl text-brand-400 opacity-60" />
            </div>
            <h3 className="heading-display text-2xl text-white mb-3">
              Your Content Will Appear Here
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
              Fill in the generator form above, choose your preferences, and click
              "Generate Content" to see your AI-powered content.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Blog Post', 'LinkedIn', 'Instagram', 'Email'].map(t => (
                <span key={t} className="badge badge-blue text-xs">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="output" className="relative py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="heading-display text-2xl sm:text-3xl text-white">
              {isLoading ? (
                <>Generating <span className="gradient-text">Content</span>...</>
              ) : (
                <>Generated <span className="gradient-text">Content</span></>
              )}
            </h2>
            {item && !isLoading && (
              <p className="text-slate-500 text-sm mt-1">
                {item.content_type} • {item.tone} tone • {item.length}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {item && !isLoading && (
            <div className="flex items-center gap-3">
              <button
                id="copy-btn"
                onClick={handleCopy}
                className={`btn-secondary px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium ${
                  copied ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : ''
                }`}
              >
                {copied ? (
                  <>
                    <RiCheckLine className="text-base" />
                    Copied!
                  </>
                ) : (
                  <>
                    <RiFileCopyLine className="text-base" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>

              <button
                id="download-btn"
                onClick={handleDownload}
                className="btn-primary px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium"
              >
                <RiDownloadLine className="text-base" />
                <span className="hidden sm:inline">Download TXT</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Card */}
        <div className="glass-card-strong shadow-card overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <RiLoader4Fill className="text-brand-400 animate-spin" />
              ) : (
                <RiSparklingFill className="text-brand-400" />
              )}
              <span className="text-sm font-medium text-slate-300">
                {isLoading ? 'Generating...' : item?.content_type}
              </span>
              {item && !isLoading && (
                <span className="badge badge-blue text-xs ml-1">{item.tone}</span>
              )}
            </div>

            {/* Word/char count */}
            {item && !isLoading && (
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>{wordCount.toLocaleString()} words</span>
                <span>{charCount.toLocaleString()} chars</span>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 min-h-[300px]">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="content-output animate-fade-in">
                {item?.generated_content}
              </div>
            )}
          </div>

          {/* Card Footer - topic info */}
          {item && !isLoading && (
            <div className="px-6 py-4 border-t border-white/6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span>
                <span className="text-slate-400 font-medium">Topic:</span>{' '}
                {item.topic}
              </span>
              <span className="ml-auto">
                Generated at {new Date(item.created_at).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OutputCard;
