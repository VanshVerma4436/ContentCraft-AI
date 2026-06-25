/**
 * HistorySection component - Displays previous content generations stored in localStorage.
 * Allows users to view, reuse, and delete history items.
 */

import React, { useState } from 'react';
import {
  RiHistoryLine,
  RiDeleteBin6Line,
  RiRefreshLine,
  RiFileCopyLine,
  RiCheckLine,
  RiInboxLine,
} from 'react-icons/ri';
import type { HistoryItem } from '../types';

// ─────────────────────────────────────────────
// Content type color mapping
// ─────────────────────────────────────────────

const CONTENT_TYPE_COLORS: Record<string, string> = {
  'Blog Post':           'badge-blue',
  'LinkedIn Post':       'badge-purple',
  'Instagram Caption':   'badge-green',
  'Product Description': 'badge-blue',
  'Email':               'badge-purple',
  'Marketing Copy':      'badge-green',
  'YouTube Script':      'badge-blue',
};

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface HistorySectionProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onReuse: (item: HistoryItem) => void;
}

// ─────────────────────────────────────────────
// History Item Card
// ─────────────────────────────────────────────

interface HistoryCardProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
  onReuse: (item: HistoryItem) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, onDelete, onReuse }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.generated_content);
    } catch {
      const el = document.createElement('textarea');
      el.value = item.generated_content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(item.created_at).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const preview = item.generated_content.slice(0, 200) + (item.generated_content.length > 200 ? '...' : '');

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:border-white/15 hover:shadow-card-hover group">
      {/* Card Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Left: metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`badge text-xs ${CONTENT_TYPE_COLORS[item.content_type] || 'badge-blue'}`}>
                {item.content_type}
              </span>
              <span className="text-xs text-slate-600">{item.tone}</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-600">{item.length}</span>
            </div>
            <p className="text-sm font-medium text-slate-200 truncate" title={item.topic}>
              {item.topic}
            </p>
            <p className="text-xs text-slate-600 mt-1">{formattedDate}</p>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              id={`history-copy-${item.id}`}
              onClick={handleCopy}
              title="Copy content"
              className={`p-2 rounded-lg transition-all text-slate-400 hover:text-white ${
                copied ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/8'
              }`}
            >
              {copied ? <RiCheckLine className="text-base" /> : <RiFileCopyLine className="text-base" />}
            </button>
            <button
              id={`history-reuse-${item.id}`}
              onClick={() => onReuse(item)}
              title="Reuse this configuration"
              className="p-2 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
            >
              <RiRefreshLine className="text-base" />
            </button>
            <button
              id={`history-delete-${item.id}`}
              onClick={() => onDelete(item.id)}
              title="Delete"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <RiDeleteBin6Line className="text-base" />
            </button>
          </div>
        </div>

        {/* Content preview / expand */}
        <div className="mt-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            {expanded ? item.generated_content : preview}
          </p>
          {item.generated_content.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              {expanded ? '↑ Show less' : '↓ Read more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const HistorySection: React.FC<HistorySectionProps> = ({ history, onDelete, onReuse }) => {
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const handleClearAll = () => {
    if (confirmClearAll) {
      history.forEach(item => onDelete(item.id));
      setConfirmClearAll(false);
    } else {
      setConfirmClearAll(true);
      setTimeout(() => setConfirmClearAll(false), 3000);
    }
  };

  return (
    <section id="history" className="relative py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-600/20 border border-accent-500/30 flex items-center justify-center">
              <RiHistoryLine className="text-accent-400 text-lg" />
            </div>
            <div>
              <h2 className="heading-display text-2xl sm:text-3xl text-white">
                Generation <span className="gradient-text">History</span>
              </h2>
              <p className="text-slate-500 text-sm">
                {history.length} {history.length === 1 ? 'item' : 'items'} stored locally
              </p>
            </div>
          </div>

          {/* Clear all */}
          {history.length > 0 && (
            <button
              id="clear-history-btn"
              onClick={handleClearAll}
              className={`btn-secondary px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all ${
                confirmClearAll
                  ? 'border-red-500/50 text-red-400 bg-red-500/10'
                  : ''
              }`}
            >
              <RiDeleteBin6Line className="text-base" />
              {confirmClearAll ? 'Confirm Clear All' : 'Clear All'}
            </button>
          )}
        </div>

        {/* Empty state */}
        {history.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/3 border border-white/8 mb-5">
              <RiInboxLine className="text-3xl text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">No history yet</h3>
            <p className="text-slate-500 text-sm">
              Generated content will automatically appear here. Your history is saved locally in your browser.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {history.map(item => (
              <HistoryCard
                key={item.id}
                item={item}
                onDelete={onDelete}
                onReuse={onReuse}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorySection;
