/**
 * API service module for communicating with the ContentCraft AI backend.
 * All Axios requests are centralized here for clean separation of concerns.
 */

import axios from 'axios';

// Base URL for the FastAPI backend
const API_BASE_URL = 'https://contentcraft-ai-2-m5o6.onrender.com';

// Create Axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for AI generation
});

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ContentRequest {
  content_type: string;
  topic: string;
  tone: string;
  length: string;
}

export interface ContentResponse {
  content: string;
}

// ─────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────

/**
 * Check if the backend API is running.
 */
export const checkHealth = async (): Promise<{ message: string; status: string }> => {
  const response = await apiClient.get('/');
  return response.data;
};

/**
 * Generate AI content based on user inputs.
 * @param request - Content generation parameters
 * @returns Generated content string
 */
export const generateContent = async (request: ContentRequest): Promise<ContentResponse> => {
  const response = await apiClient.post<ContentResponse>('/generate', request);
  return response.data;
};

export default apiClient;
