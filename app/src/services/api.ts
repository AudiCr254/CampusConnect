// API Service for CampusConnect Backend
import { getAIAnswer } from './aiService';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// const ADMIN_KEY = 'Audi_111K254'; // No longer needed with Firebase Storage

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

// ─── UNITS FILE UPLOAD ──────────────────────────────────────────────────────

export async function uploadUnitFile(file: File, _unitData: {
  name: string;
  description: string;
  color: string;
}): Promise<{ file_path: string }> {
  try {
    // Create a unique file path in Firebase Storage
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `units/${fileName}`;
    const fileRef = ref(storage, filePath);

    // Upload file to Firebase Storage
    await uploadBytes(fileRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    return { file_path: downloadURL };
  } catch (error) {
    console.error('Error uploading unit file:', error);
    throw error;
  }
}

export async function updateUnitFile(_unitId: string, file: File, _unitData: {
  name: string;
  description: string;
  color: string;
}): Promise<{ file_path: string }> {
  try {
    // Create a unique file path in Firebase Storage
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `units/${fileName}`;
    const fileRef = ref(storage, filePath);

    // Upload file to Firebase Storage
    await uploadBytes(fileRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    return { file_path: downloadURL };
  } catch (error) {
    console.error('Error updating unit file:', error);
    throw error;
  }
}

// ─── TOPICS FILE UPLOAD ─────────────────────────────────────────────────────

export async function uploadTopicFile(file: File, topicData: {
  name: string;
  description: string;
  unit_id: string;
}): Promise<{ file_path: string }> {
  try {
    // Create a unique file path in Firebase Storage
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `topics/${topicData.unit_id}/${fileName}`;
    const fileRef = ref(storage, filePath);

    // Upload file to Firebase Storage
    await uploadBytes(fileRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    return { file_path: downloadURL };
  } catch (error) {
    console.error('Error uploading topic file:', error);
    throw error;
  }
}

export async function updateTopicFile(_topicId: string, file: File, topicData: {
  name: string;
  description: string;
  unit_id: string;
}): Promise<{ file_path: string }> {
  try {
    // Create a unique file path in Firebase Storage
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `topics/${topicData.unit_id}/${fileName}`;
    const fileRef = ref(storage, filePath);

    // Upload file to Firebase Storage
    await uploadBytes(fileRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    return { file_path: downloadURL };
  } catch (error) {
    console.error('Error updating topic file:', error);
    throw error;
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

// AI API - Now uses local note prioritization with internet fallback
export const aiApi = {
  ask: async (query: string) => {
    try {
      const result = await getAIAnswer(query);
      return {
        success: true,
        data: {
          answer: result.answer,
          source: result.source,
          relevant_notes: [],
        },
      };
    } catch (error) {
      console.error('AI API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get AI answer',
      };
    }
  },
};

// Health check
export const healthCheck = () => fetchApi<{ timestamp: string }>('/health');

export default {
  topics: topicsApi,
  notes: notesApi,
  ai: aiApi,
  health: healthCheck,
};
