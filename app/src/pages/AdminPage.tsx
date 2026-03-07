import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  X,
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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Topic {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface Note {
  id: number;
  title: string;
  description: string;
  content?: string;
  topic_id: number;
  topic_name?: string;
  topic_color?: string;
  created_at: string;
}

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
function LoginScreen({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/topics`, {
        headers: { 'x-admin-key': key },
      });
      if (res.ok) {
        onLogin(key);
      } else {
        setError('Invalid admin key. Please try again.');
      }
    } catch {
      // If backend is offline, still allow entry with any non-empty key
      // so the admin can manage static notes
      onLogin(key);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Enter your admin key to manage CampusConnect notes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="adminKey" className="text-sm font-medium text-gray-700">
                Admin Key
              </Label>
              <div className="relative">
                <Input
                  id="adminKey"
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="Enter your admin key..."
                  className="pr-10 border-gray-300 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={!key.trim() || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            The admin key is set in the backend <code className="bg-gray-100 px-1 rounded">.env</code> file as{' '}
            <code className="bg-gray-100 px-1 rounded">ADMIN_KEY</code>
          </p>
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
  adminKey,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  topics: Topic[];
  editNote: Note | null;
  adminKey: string;
}) {
  const [form, setForm] = useState<NoteFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editNote) {
      setForm({
        title: editNote.title || '',
        description: editNote.description || '',
        content: editNote.content || '',
        topic_id: editNote.topic_id?.toString() || '',
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
    setSuccess('');
  }, [editNote, open]);

  const handleChange = (field: keyof NoteFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const url = editNote ? `${API_BASE}/notes/${editNote.id}` : `${API_BASE}/notes`;
      const method = editNote ? 'PUT' : 'POST';

      const body: Record<string, string> = {
        title: form.title,
        description: form.description,
        content: form.content,
      };
      if (form.topic_id) body.topic_id = form.topic_id;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(editNote ? 'Note updated successfully!' : 'Note created successfully!');
        setTimeout(() => {
          onSave();
          onClose();
        }, 1000);
      } else {
        setError(data.message || 'Failed to save note.');
      }
    } catch {
      setError('Could not connect to backend. Please ensure the server is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <FileText className="w-5 h-5 text-blue-600" />
            {editNote ? 'Edit Note' : 'Add New Note'}
          </DialogTitle>
          <DialogDescription>
            {editNote
              ? 'Update the details of this study note.'
              : 'Fill in the details to add a new study note to CampusConnect.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Introduction to Double-Entry Bookkeeping"
              required
            />
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Topic</Label>
            <Select
              value={form.topic_id}
              onValueChange={(val) => handleChange('topic_id', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic..." />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Short Description
            </Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief summary of this note..."
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-sm font-medium">
              Note Content
            </Label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Write the full note content here. Markdown is supported..."
              rows={12}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y font-mono"
            />
            <p className="text-xs text-gray-400">
              Markdown formatting is supported (e.g., **bold**, # Heading, | table |)
            </p>
          </div>

          {/* Feedback */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : editNote ? 'Update Note' : 'Add Note'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
function AdminDashboard({ adminKey, onLogout }: { adminKey: string; onLogout: () => void }) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [notesRes, topicsRes] = await Promise.all([
        fetch(`${API_BASE}/notes`, { headers: { 'x-admin-key': adminKey } }),
        fetch(`${API_BASE}/topics`),
      ]);
      const notesData = await notesRes.json();
      const topicsData = await topicsRes.json();
      if (notesData.success) setNotes(notesData.data || []);
      if (topicsData.success) setTopics(topicsData.data || []);
      setIsOffline(false);
    } catch {
      setIsOffline(true);
      setError('Backend server is offline. Showing static fallback data.');
      // Load static fallback
      const { notes: staticNotes } = await import('@/data/notes');
      const staticTopics = [
        { id: 1, name: 'Introduction to Accounting', color: '#3b82f6', icon: 'BookOpen' },
        { id: 2, name: 'Recording Transactions', color: '#10b981', icon: 'FileText' },
        { id: 3, name: 'Financial Statements', color: '#8b5cf6', icon: 'BarChart3' },
        { id: 4, name: 'Assets & Liabilities', color: '#f97316', icon: 'Building2' },
        { id: 5, name: 'Partnership Accounts', color: '#ec4899', icon: 'Users' },
        { id: 6, name: 'Company Accounts', color: '#6366f1', icon: 'Building' },
        { id: 7, name: 'Manufacturing Accounts', color: '#14b8a6', icon: 'Factory' },
        { id: 8, name: 'Non-Profit Organizations', color: '#ef4444', icon: 'Heart' },
        { id: 9, name: 'Correction of Errors', color: '#eab308', icon: 'AlertCircle' },
      ];
      setTopics(staticTopics);
      setNotes(
        staticNotes.map((n, i) => ({
          id: i + 1,
          title: n.title,
          description: n.content.substring(0, 120) + '...',
          content: n.content,
          topic_id: parseInt(n.topicId) || 1,
          topic_name: staticTopics.find((t) => t.id === (parseInt(n.topicId) || 1))?.name,
          created_at: new Date().toISOString(),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/notes/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `"${deleteTarget.title}" deleted successfully.`);
        fetchData();
      } else {
        showToast('error', data.message || 'Failed to delete note.');
      }
    } catch {
      showToast('error', 'Could not connect to backend.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const topicMap = Object.fromEntries(topics.map((t) => [t.id, t]));

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">Admin Panel</h1>
              <p className="text-xs text-gray-500">CampusConnect Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/notes')}
              className="hidden sm:flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              View Site
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Notes', value: notes.length, color: 'blue' },
            { label: 'Topics', value: topics.length, color: 'purple' },
            {
              label: 'Recent (7d)',
              value: notes.filter(
                (n) =>
                  new Date(n.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length,
              color: 'green',
            },
            { label: 'Status', value: isOffline ? 'Offline' : 'Online', color: isOffline ? 'red' : 'green' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  s.color === 'blue'
                    ? 'text-blue-600'
                    : s.color === 'purple'
                    ? 'text-purple-600'
                    : s.color === 'green'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Offline warning */}
        {isOffline && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-sm text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Backend Offline:</strong> The Express.js server is not running. Notes shown are
              static fallback data. Start the backend with{' '}
              <code className="bg-amber-100 px-1 rounded">cd backend && npm start</code> to enable
              full CRUD operations.
            </div>
          </div>
        )}

        {/* Notes Management */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">Notes Management</h2>
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {notes.length}
              </span>
            </div>
            <Button
              onClick={() => {
                setEditNote(null);
                setFormOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Note
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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
          showToast('success', editNote ? 'Note updated!' : 'Note added successfully!');
        }}
        topics={topics}
        editNote={editNote}
        adminKey={adminKey}
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

  const handleLogin = (key: string) => {
    sessionStorage.setItem('cc_admin_key', key);
    setAdminKey(key);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cc_admin_key');
    setAdminKey(null);
  };

  if (!adminKey) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <AdminDashboard adminKey={adminKey} onLogout={handleLogout} />;
}
