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

// ─── UNITS (Top-level categories) ───────────────────────────────────────────

export interface Unit {
  id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export async function fetchUnits(): Promise<Unit[]> {
  try {
    const unitsRef = collection(db, 'units');
    const q = query(unitsRef, orderBy('created_at', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Unit));
  } catch (error) {
    console.error('Error fetching units:', error);
    return [];
  }
}

export async function addUnit(unit: Omit<Unit, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'units'), {
      ...unit,
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding unit:', error);
    throw error;
  }
}

export async function updateUnit(id: string, updates: Partial<Unit>): Promise<void> {
  try {
    const unitRef = doc(db, 'units', id);
    await updateDoc(unitRef, updates);
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
}

export async function deleteUnit(id: string): Promise<void> {
  try {
    const unitRef = doc(db, 'units', id);
    await deleteDoc(unitRef);
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
}

// ─── TOPICS (Under each unit) ───────────────────────────────────────────────

export interface Topic {
  id: string;
  unit_id: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export async function fetchTopics(unitId?: string): Promise<Topic[]> {
  try {
    const topicsRef = collection(db, 'topics');
    let q;
    
    if (unitId) {
      q = query(topicsRef, where('unit_id', '==', unitId), orderBy('created_at', 'asc'));
    } else {
      q = query(topicsRef, orderBy('created_at', 'asc'));
    }
    
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
    const docRef = await addDoc(collection(db, 'topics'), {
      ...topic,
      created_at: new Date().toISOString(),
    });
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

// ─── NOTES (Can be at unit or topic level) ──────────────────────────────────

export interface Note {
  id: string;
  unit_id: string;
  topic_id?: string; // Optional - if not set, note belongs to the unit
  title: string;
  description: string;
  content: string;
  note_type: 'unit' | 'topic'; // Indicates if this is a unit-level or topic-level note
  created_at: string;
}

export async function fetchNotes(unitId?: string, topicId?: string): Promise<Note[]> {
  try {
    const notesRef = collection(db, 'notes');
    let q;
    
    if (topicId) {
      q = query(notesRef, where('topic_id', '==', topicId), orderBy('created_at', 'desc'));
    } else if (unitId) {
      q = query(notesRef, where('unit_id', '==', unitId), orderBy('created_at', 'desc'));
    } else {
      q = query(notesRef, orderBy('created_at', 'desc'));
    }
    
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

// Import where for filtering
import { where } from '@/lib/firebase';
