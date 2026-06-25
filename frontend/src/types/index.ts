/**
 * Type definitions for ContentCraft AI application.
 */

// Supported content generation types
export type ContentType =
  | 'Blog Post'
  | 'LinkedIn Post'
  | 'Instagram Caption'
  | 'Product Description'
  | 'Email'
  | 'Marketing Copy'
  | 'YouTube Script';

// Supported writing tones
export type Tone =
  | 'Professional'
  | 'Casual'
  | 'Friendly'
  | 'Marketing'
  | 'Educational';

// Content length options
export type Length = 'Short' | 'Medium' | 'Long';

// History item stored in localStorage
export interface HistoryItem {
  id: string;
  content_type: ContentType;
  topic: string;
  tone: Tone;
  length: Length;
  generated_content: string;
  created_at: string; // ISO timestamp
}

// Form state for the generator
export interface GeneratorFormState {
  content_type: ContentType;
  topic: string;
  tone: Tone;
  length: Length;
}
