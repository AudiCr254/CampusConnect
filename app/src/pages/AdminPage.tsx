import { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
  BookOpen,
  FileText,
  AlertCircle,
  LogOut,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { fetchNotes, addNote, updateNote, deleteNote, fetchTopics, type Note, type Topic } from '@/services/firestore';

const ADMIN_KEY = 'Audi_111K254';

interface NoteFormData {
  title: string;
  description: string;
  content: string;
  topic_id: string;
}

const emptyForm: NoteFormData = {
  title: '',
  description: '',
  content: '',
  topic_id: '',
};

// ─── Admin Login Screen ───────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    
    // Verify the admin key
    if (key === ADMIN_KEY) {
      onLogin();
    } else {
      setError('Invalid admin key. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-center text-gray-600 mb-8">
            CampusConnect Management
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="key" className="text-gray-700 font-medium mb-2 block">
                Admin Key
              </Label>
              <div className="relative">
                <input
                  id="key"
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter your admin key"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

// ─── Note Form Dialog ─────────────────────────────────────────────────────────
function NoteFormDialog({
  open,
  onClose,
  onSave,
  topics,
  editNote,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  topics: Topic[];
  editNote: Note | null;
}) {
  const [form, setForm] = useState<NoteFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editNote) {
      setForm({
        title: editNote.title,
        description: editNote.description,
        content: editNote.content,
        topic_id: editNote.topic_id,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editNote, open]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.topic_id) return;
    setSaving(true);

    try {
      if (editNote) {
        await updateNote(editNote.id, {
          title: form.title,
          description: form.description,
          content: form.content,
          topic_id: form.topic_id,
        } as Partial<Note>);
      } else {
        await addNote({
          title: form.title,
          description: form.description,
          content: form.content,
          topic_id: form.topic_id,
          created_at: new Date().toISOString(),
        } as any);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
          <DialogDescription>
            {editNote ? 'Update the note details below.' : 'Fill in the details to create a new note.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Note title"
            />
          </div>

          <div>
            <Label htmlFor="topic">Topic</Label>
            <Select value={form.topic_id} onValueChange={(value) => setForm({ ...form, topic_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Full note content (supports Markdown)"
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.title.trim() || !form.topic_id}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [notesData, topicsData] = await Promise.all([fetchNotes(), fetchTopics()]);
      setNotes(notesData);
      setTopics(topicsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from Firestore');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteNote(deleteTarget.id);
      setNotes(notes.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  const topicMap = Object.fromEntries(topics.map((t) => [t.id, t]));

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">CampusConnect Management</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
            <p className="text-gray-600 text-sm font-medium">TOTAL NOTES</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{notes.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
            <p className="text-gray-600 text-sm font-medium">TOPICS</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{topics.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
            <p className="text-gray-600 text-sm font-medium">RECENT (7D)</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {notes.filter((n) => new Date(n.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
            <p className="text-gray-600 text-sm font-medium">STATUS</p>
            <p className="text-lg font-bold text-green-600 mt-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Online
            </p>
          </div>
        </div>

        {/* Notes Management */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Notes Management</h2>
              <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                {notes.length}
              </span>
            </div>
            <Button
              onClick={() => {
                setEditNote(null);
                setFormOpen(true);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Note
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : error && notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <AlertCircle className="w-10 h-10 mb-3 text-amber-400" />
              <p className="font-medium">{error}</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <FileText className="w-10 h-10 mb-3 text-gray-300" />
              <p className="font-medium">No notes yet</p>
              <p className="text-sm mt-1">Click "Add Note" to create your first note.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-semibold text-gray-600 w-8">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">
                      Topic
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">
                      Description
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {notes.map((note, idx) => {
                    const topic = topicMap[note.topic_id];
                    return (
                      <tr key={note.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 text-gray-400 text-xs">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900 line-clamp-1">
                            {note.title}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {topic ? (
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: topic.color }}
                            >
                              {topic.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs max-w-xs">
                          <span className="line-clamp-1">{note.description || '—'}</span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-gray-400 text-xs whitespace-nowrap">
                          {new Date(note.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditNote(note);
                                setFormOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                              title="Edit note"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(note)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete note"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Note Form Dialog */}
      <NoteFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditNote(null);
        }}
        onSave={() => {
          fetchData();
        }}
        topics={topics}
        editNote={editNote}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>"{deleteTarget?.title}"</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

// ─── Root Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(() =>
    sessionStorage.getItem('cc_admin_key')
  );

  const handleLogin = () => {
    sessionStorage.setItem('cc_admin_key', ADMIN_KEY);
    setAdminKey(ADMIN_KEY);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cc_admin_key');
    setAdminKey(null);
  };

  if (!adminKey) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
