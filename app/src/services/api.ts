// API Service for CampusConnect Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface Topic {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  note_count: number;
  created_at: string;
}

export interface Note {
  id: number;
  title: string;
  description: string;
  content?: string;
  topic_id: number;
  topic_name?: string;
  topic_color?: string;
  file_path?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

// Generic fetch function
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Topics API
export const topicsApi = {
  // Get all topics
  getAll: () => fetchApi<Topic[]>('/topics'),

  // Get topic by ID with notes
  getById: (id: number) => fetchApi<Topic & { notes: Note[] }>(`/topics/${id}`),
};

// Notes API
export const notesApi = {
  // Get all notes
  getAll: () => fetchApi<Note[]>('/notes'),

  // Get note by ID
  getById: (id: number) => fetchApi<Note>(`/notes/${id}`),

  // Search notes
  search: (query: string) => fetchApi<Note[]>(`/notes/search?q=${encodeURIComponent(query)}`),

  // Get notes by topic
  getByTopic: (topicId: number) => fetchApi<Note[]>(`/notes/topic/${topicId}`),

  // View note file (returns file URL)
  getViewUrl: (id: number) => `${API_BASE_URL}/notes/view/${id}`,
};

// Health check
export const healthCheck = () => fetchApi<{ timestamp: string }>('/health');

export default {
  topics: topicsApi,
  notes: notesApi,
  health: healthCheck,
};
