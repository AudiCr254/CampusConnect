import { supabase, getStorageUrl } from '../lib/supabase';

export interface Unit {
  id: string;
  name: string;
  description?: string;
  file_url?: string;
  created_at: string;
}

export interface Topic {
  id: string;
  unit_id: string;
  name: string;
  description?: string;
  file_url?: string;
  created_at: string;
}

export interface Note {
  id: string;
  topic_id: string;
  unit_id: string;
  title: string;
  content: string;
  file_url?: string;
  created_at: string;
}

// Units
export const addUnit = async (name: string, description: string, file?: File): Promise<Unit> => {
  let fileUrl: string | undefined;

  if (file) {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('units')
      .upload(fileName, file);

    if (uploadError) throw uploadError;
    fileUrl = getStorageUrl('units', fileName);
  }

  const { data, error } = await supabase
    .from('units')
    .insert([{ name, description, file_url: fileUrl }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUnits = async (): Promise<Unit[]> => {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteUnit = async (unitId: string): Promise<void> => {
  const { error } = await supabase
    .from('units')
    .delete()
    .eq('id', unitId);

  if (error) throw error;
};

// Topics
export const addTopic = async (
  unitId: string,
  name: string,
  description: string,
  file?: File
): Promise<Topic> => {
  let fileUrl: string | undefined;

  if (file) {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('topics')
      .upload(`${unitId}/${fileName}`, file);

    if (uploadError) throw uploadError;
    fileUrl = getStorageUrl('topics', `${unitId}/${fileName}`);
  }

  const { data, error } = await supabase
    .from('topics')
    .insert([{ unit_id: unitId, name, description, file_url: fileUrl }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTopics = async (unitId: string): Promise<Topic[]> => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('unit_id', unitId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getAllTopics = async (): Promise<Topic[]> => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteTopic = async (topicId: string): Promise<void> => {
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', topicId);

  if (error) throw error;
};

// Notes
export const addNote = async (
  topicId: string,
  unitId: string,
  title: string,
  content: string,
  file?: File
): Promise<Note> => {
  let fileUrl: string | undefined;

  if (file) {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('notes')
      .upload(`${unitId}/${topicId}/${fileName}`, file);

    if (uploadError) throw uploadError;
    fileUrl = getStorageUrl('notes', `${unitId}/${topicId}/${fileName}`);
  }

  const { data, error } = await supabase
    .from('notes')
    .insert([{ topic_id: topicId, unit_id: unitId, title, content, file_url: fileUrl }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getNotes = async (topicId: string): Promise<Note[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getAllNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const deleteNote = async (noteId: string): Promise<void> => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);

  if (error) throw error;
};

// Search notes by content
export const searchNotes = async (query: string): Promise<Note[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};
