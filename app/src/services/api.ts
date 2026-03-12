import { getAIAnswer } from './aiService';
import { supabase } from '@/lib/supabase';
import { getAllNotes, searchNotes } from './supabaseService';

// Types
export interface Topic {
  id: string;
  name: string;
  description: string;
  file_url?: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  topic_id: string;
  unit_id: string;
  file_url?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

// ─── FILE UPLOAD FUNCTIONS ──────────────────────────────────────────────────────

export async function uploadUnitFile(file: File, unitData: {
  name: string;
  description: string;
}): Promise<{ file_path: string }> {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `units/${fileName}`;

    const { error } = await supabase.storage
      .from('units')
      .upload(filePath, file);

    if (error) throw error;

    return { file_path: filePath };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

export async function updateUnitFile(unitId: string, file: File, unitData: {
  name: string;
  description: string;
}): Promise<{ file_path: string }> {
  return uploadUnitFile(file, unitData);
}

export async function uploadTopicFile(file: File, topicData: {
  name: string;
  description: string;
  unit_id: string;
}): Promise<{ file_path: string }> {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `topics/${topicData.unit_id}/${fileName}`;

    const { error } = await supabase.storage
      .from('topics')
      .upload(filePath, file);

    if (error) throw error;

    return { file_path: filePath };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

export async function updateTopicFile(topicId: string, file: File, topicData: {
  name: string;
  description: string;
  unit_id: string;
}): Promise<{ file_path: string }> {
  return uploadTopicFile(file, topicData);
}

// ─── AI API ────────────────────────────────────────────────────────────────────

export const aiApi = {
  async ask(question: string): Promise<ApiResponse<{ answer: string }>> {
    try {
      // First, try to search for relevant notes in the database
      let context = '';
      try {
        const relevantNotes = await searchNotes(question);
        if (relevantNotes.length > 0) {
          context = relevantNotes
            .slice(0, 5) // Use top 5 relevant notes
            .map(note => `${note.title}: ${note.content}`)
            .join('\n\n');
        }
      } catch (dbError) {
        console.warn('Could not fetch notes from database:', dbError);
      }

      // Get AI answer using the AI service
      const answer = await getAIAnswer(question, context);

      return {
        success: true,
        data: { answer },
      };
    } catch (error) {
      console.error('AI API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get AI response',
      };
    }
  },
};

// ─── NOTES API (for backward compatibility) ────────────────────────────────────

export async function getNotes(): Promise<ApiResponse<Note[]>> {
  try {
    const notes = await getAllNotes();
    return {
      success: true,
      data: notes,
      count: notes.length,
    };
  } catch (error) {
    console.error('Error fetching notes:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch notes',
    };
  }
}

export async function searchNotesAPI(query: string): Promise<ApiResponse<Note[]>> {
  try {
    const notes = await searchNotes(query);
    return {
      success: true,
      data: notes,
      count: notes.length,
    };
  } catch (error) {
    console.error('Error searching notes:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to search notes',
    };
  }
}
