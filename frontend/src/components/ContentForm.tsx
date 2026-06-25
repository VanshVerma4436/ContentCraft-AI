/**
 * ContentForm component - Main content generation form.
 * Handles user input for content type, topic, tone, and length,
 * then dispatches an API call to the FastAPI backend.
 */

import React, { useState } from 'react';
import {
  RiSparklingFill,
  RiLoader4Fill,
  RiBloggerLine,
  RiLinkedinBoxLine,
  RiInstagramLine,
  RiShoppingBag2Line,
  RiMailLine,
  RiMegaphoneLine,
  RiYoutubeLine,
} from 'react-icons/ri';
import { generateContent } from '../services/api';
import type { ContentType, Tone, Length, GeneratorFormState, HistoryItem } from '../types';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const CONTENT_TYPES: { value: ContentType; icon: React.ReactNode; description: string }[] = [
  { value: 'Blog Post',          icon: <RiBloggerLine />,       description: 'Long-form articles with structure' },
  { value: 'LinkedIn Post',      icon: <RiLinkedinBoxLine />,   description: 'Professional networking content' },
  { value: 'Instagram Caption',  icon: <RiInstagramLine />,     description: 'Eye-catching captions + hashtags' },
  { value: 'Product Description',icon: <RiShoppingBag2Line />,  description: 'Persuasive product copy' },
  { value: 'Email',              icon: <RiMailLine />,          description: 'Professional email templates' },
  { value: 'Marketing Copy',     icon: <RiMegaphoneLine />,     description: 'Compelling ad & landing page copy' },
  { value: 'YouTube Script',     icon: <RiYoutubeLine />,       description: 'Engaging video scripts with hooks' },
];

const TONES: { value: Tone; emoji: string; desc: string }[] = [
  { value: 'Professional', emoji: '💼', desc: 'Formal & authoritative' },
  { value: 'Casual',       emoji: '😊', desc: 'Relaxed & conversational' },
  { value: 'Friendly',     emoji: '🤝', desc: 'Warm & approachable' },
  { value: 'Marketing',    emoji: '🚀', desc: 'Persuasive & exciting' },
  { value: 'Educational',  emoji: '📚', desc: 'Informative & clear' },
];

const LENGTHS: { value: Length; words: string; desc: string }[] = [
  { value: 'Short',  words: '150–250', desc: 'Quick & punchy' },
  { value: 'Medium', words: '400–600', desc: 'Balanced depth' },
  { value: 'Long',   words: '800–1200', desc: 'Comprehensive' },
];

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface ContentFormProps {
  onContentGenerated: (item: HistoryItem) => void;
  onContentLoading: (loading: boolean) => void;
  initialData?: {
    content_type: ContentType;
    topic: string;
    tone: Tone;
    length: Length;
  };
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const ContentForm: React.FC<ContentFormProps> = ({ onContentGenerated, onContentLoading, initialData }) => {
  const [form, setForm] = useState<GeneratorFormState>(() => ({
    content_type: initialData?.content_type ?? 'Blog Post',
    topic: initialData?.topic ?? '',
    tone: initialData?.tone ?? 'Professional',
    length: initialData?.length ?? 'Medium',
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleGenerate = async () => {
    if (!form.topic.trim()) {
      setError('Please enter a topic before generating content.');
      return;
    }

    setError(null);
    setIsLoading(true);
    onContentLoading(true);

    try {
      const response = await generateContent({
        content_type: form.content_type,
        topic: form.topic,
        tone: form.tone,
        length: form.length,
      });

      // Build history item
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        content_type: form.content_type,
        topic: form.topic,
        tone: form.tone,
        length: form.length,
        generated_content: response.content,
        created_at: new Date().toISOString(),
      };

      onContentGenerated(historyItem);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { detail?: string } }; message?: string };
      const msg =
        axiosError?.response?.data?.detail ||
        axiosError?.message ||
        'Failed to generate content. Is the backend running?';
      setError(msg);
    } finally {
      setIsLoading(false);
      onContentLoading(false);
    }
  };

  const selectedContentType = CONTENT_TYPES.find(c => c.value === form.content_type);
  const selectedTone = TONES.find(t => t.value === form.tone);
  const selectedLength = LENGTHS.find(l => l.value === form.length);

  return (
    <section id="generator" className="relative py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="heading-display text-3xl sm:text-4xl text-white mb-3">
            Generate Your <span className="gradient-text">Content</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Fill in the details below and let Gemini AI craft your perfect piece.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 shadow-card space-y-8">
          {/* ── Step 1: Content Type ── */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              <span className="badge badge-blue mr-2">1</span>
              Content Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CONTENT_TYPES.map(({ value, icon, description }) => (
                <button
                  key={value}
                  id={`content-type-${value.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setForm(f => ({ ...f, content_type: value }))}
                  className={`relative flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition-all duration-200 ${
                    form.content_type === value
                      ? 'border-brand-500/70 bg-brand-500/10 text-white shadow-sm glow-blue'
                      : 'border-white/8 bg-white/2 text-slate-400 hover:border-white/20 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span className={`text-xl ${form.content_type === value ? 'text-brand-400' : 'text-slate-500'}`}>
                    {icon}
                  </span>
                  <span className="text-sm font-medium leading-tight">{value}</span>
                  <span className="text-xs opacity-60 leading-tight hidden sm:block">{description}</span>
                  {form.content_type === value && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Selected badge */}
            {selectedContentType && (
              <div className="mt-3 flex items-center gap-2 text-sm text-brand-300">
                <span className="text-brand-400">{selectedContentType.icon}</span>
                <span className="font-medium">{selectedContentType.value}</span>
                <span className="text-slate-500">— {selectedContentType.description}</span>
              </div>
            )}
          </div>

          {/* ── Step 2: Topic ── */}
          <div>
            <label
              htmlFor="topic-input"
              className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider"
            >
              <span className="badge badge-blue mr-2">2</span>
              Topic / Subject
            </label>
            <textarea
              id="topic-input"
              value={form.topic}
              onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
              placeholder={`What would you like to write about?\n\nExamples: "The future of AI in healthcare", "10 productivity tips for remote workers", "Launch of our new eco-friendly water bottle"`}
              rows={4}
              className="form-control resize-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Be specific for better results. Include keywords, audience, or context.
              </p>
              <span className="text-xs text-slate-600">{form.topic.length} chars</span>
            </div>
          </div>

          {/* ── Step 3: Tone & Length ── */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Tone */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                <span className="badge badge-blue mr-2">3</span>
                Tone
              </label>
              <div className="space-y-2">
                {TONES.map(({ value, emoji, desc }) => (
                  <button
                    key={value}
                    id={`tone-${value.toLowerCase()}`}
                    onClick={() => setForm(f => ({ ...f, tone: value }))}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                      form.tone === value
                        ? 'border-accent-500/60 bg-accent-600/10 text-white'
                        : 'border-white/6 bg-white/2 text-slate-400 hover:border-white/15 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg">{emoji}</span>
                    <div>
                      <span className="text-sm font-medium block">{value}</span>
                      <span className="text-xs opacity-50">{desc}</span>
                    </div>
                    {form.tone === value && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-accent-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                <span className="badge badge-blue mr-2">4</span>
                Length
              </label>
              <div className="space-y-3">
                {LENGTHS.map(({ value, words, desc }) => (
                  <button
                    key={value}
                    id={`length-${value.toLowerCase()}`}
                    onClick={() => setForm(f => ({ ...f, length: value }))}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border transition-all duration-200 ${
                      form.length === value
                        ? 'border-emerald-500/60 bg-emerald-600/10 text-white'
                        : 'border-white/6 bg-white/2 text-slate-400 hover:border-white/15 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-left">
                      <span className="text-sm font-semibold block">{value}</span>
                      <span className="text-xs opacity-50">{desc}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-mono px-2 py-1 rounded-lg ${
                        form.length === value ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-500'
                      }`}>
                        ~{words} words
                      </span>
                    </div>
                  </button>
                ))}

                {/* Summary card */}
                {selectedLength && selectedTone && (
                  <div className="mt-4 p-3 rounded-xl bg-white/3 border border-white/6 text-xs text-slate-400 space-y-1">
                    <p className="text-slate-300 font-medium mb-2">Generation Summary</p>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Type</span>
                      <span>{form.content_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tone</span>
                      <span>{selectedTone.emoji} {form.tone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Length</span>
                      <span>~{selectedLength.words} words</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Error Display ── */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ── Generate Button ── */}
          <button
            id="generate-btn"
            onClick={handleGenerate}
            disabled={isLoading}
            className="btn-primary w-full py-4 rounded-xl text-base flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <RiLoader4Fill className="text-xl animate-spin" />
                <span>Crafting your content with Gemini AI...</span>
              </>
            ) : (
              <>
                <RiSparklingFill className="text-xl" />
                <span>Generate Content</span>
                <RiSparklingFill className="text-xl opacity-60" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContentForm;
