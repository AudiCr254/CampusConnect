import {
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from '@/lib/firebase';

export interface Note {
  id: string;
  title: string;
  topic_id: string;
  description: string;
  content: string;
  created_at: string;
}

export interface Topic {
  id: string;
  name: string;
  color: string;
  description: string;
}

// ─── NOTES OPERATIONS ───────────────────────────────────────────────────────

export async function fetchNotes(): Promise<Note[]> {
  try {
    const notesRef = collection(db, 'notes');
    const q = query(notesRef, orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Note));
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

export async function addNote(note: Omit<Note, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'notes'), {
      ...note,
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<void> {
  try {
    const noteRef = doc(db, 'notes', id);
    await updateDoc(noteRef, updates);
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

// ─── TOPICS OPERATIONS ──────────────────────────────────────────────────────

export async function fetchTopics(): Promise<Topic[]> {
  try {
    const topicsRef = collection(db, 'topics');
    const q = query(topicsRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Topic));
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
}

export async function addTopic(topic: Omit<Topic, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'topics'), topic);
    return docRef.id;
  } catch (error) {
    console.error('Error adding topic:', error);
    throw error;
  }
}

export async function updateTopic(id: string, updates: Partial<Topic>): Promise<void> {
  try {
    const topicRef = doc(db, 'topics', id);
    await updateDoc(topicRef, updates);
  } catch (error) {
    console.error('Error updating topic:', error);
    throw error;
  }
}

export async function deleteTopic(id: string): Promise<void> {
  try {
    const topicRef = doc(db, 'topics', id);
    await deleteDoc(topicRef);
  } catch (error) {
    console.error('Error deleting topic:', error);
    throw error;
  }
}
