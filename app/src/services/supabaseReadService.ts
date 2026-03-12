import { supabase } from '@/lib/supabase';

export interface Unit {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export interface Topic {
  id: string;
  unit_id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export interface Note {
  id: string;
  topic_id: string;
  unit_id: string;
  title: string;
  content: string;
  file_path?: string;
  created_at: string;
}

// ─── READ OPERATIONS (for AI Assistant) ────────────────────────────────────

/**
 * Fetch all units from Supabase
 */
export async function getAllUnits(): Promise<Unit[]> {
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching units:', error);
    return [];
  }
}

/**
 * Fetch all topics from Supabase
 */
export async function getAllTopics(): Promise<Topic[]> {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
}

/**
 * Fetch all notes from Supabase
 */
export async function getAllNotes(): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

/**
 * Search notes by title or content
 */
export async function searchNotes(query: string): Promise<Note[]> {
  if (!query.trim()) return [];

  try {
    // Use the full-text search function
    const { data, error } = await supabase
      .rpc('search_notes', { search_query: query });

    if (error) {
      // Fallback to simple LIKE search if RPC fails
      console.warn('RPC search failed, using fallback search:', error);
      return fallbackSearchNotes(query);
    }

    return data || [];
  } catch (error) {
    console.error('Error searching notes:', error);
    return fallbackSearchNotes(query);
  }
}

/**
 * Fallback search using LIKE (simpler but less powerful)
 */
async function fallbackSearchNotes(query: string): Promise<Note[]> {
  try {
    const searchTerm = `%${query}%`;
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in fallback search:', error);
    return [];
  }
}

/**
 * Get notes for a specific topic
 */
export async function getNotesByTopic(topicId: string): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notes by topic:', error);
    return [];
  }
}

/**
 * Get notes for a specific unit
 */
export async function getNotesByUnit(unitId: string): Promise<Note[]> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('unit_id', unitId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notes by unit:', error);
    return [];
  }
}

/**
 * Get a single note by ID
 */
export async function getNoteById(noteId: string): Promise<Note | null> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

/**
 * Get file download URL from Supabase Storage
 */
export async function getFileUrl(filePath: string, bucket: string = 'notes'): Promise<string | null> {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data?.publicUrl || null;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
}

/**
 * Get a note with its file URL
 */
export async function getNoteWithFile(noteId: string): Promise<(Note & { file_url?: string }) | null> {
  try {
    const note = await getNoteById(noteId);
    if (!note) return null;

    if (note.file_path) {
      const fileUrl = await getFileUrl(note.file_path);
      return { ...note, file_url: fileUrl || undefined };
    }

    return note;
  } catch (error) {
    console.error('Error fetching note with file:', error);
    return null;
  }
}

/**
 * Get all notes with their file URLs
 */
export async function getAllNotesWithFiles(): Promise<(Note & { file_url?: string })[]> {
  try {
    const notes = await getAllNotes();
    
    const notesWithFiles = await Promise.all(
      notes.map(async (note) => {
        if (note.file_path) {
          const fileUrl = await getFileUrl(note.file_path);
          return { ...note, file_url: fileUrl || undefined };
        }
        return note;
      })
    );

    return notesWithFiles;
  } catch (error) {
    console.error('Error fetching notes with files:', error);
    return [];
  }
}
