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
  AlertCircle,
  LogOut,
  Save,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { 
  fetchUnits, addUnit, updateUnit, deleteUnit,
  fetchTopics, addTopic, updateTopic, deleteTopic,
  fetchNotes, addNote, updateNote, deleteNote,
  type Unit, type Topic, type Note 
} from '@/services/firestore';
import { uploadUnitFile, updateUnitFile, uploadTopicFile, updateTopicFile } from '@/services/api';

const ADMIN_KEY = 'Audi_111K254';

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

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  
  const [unitFormOpen, setUnitFormOpen] = useState(false);
  const [topicFormOpen, setTopicFormOpen] = useState(false);
  const [noteFormOpen, setNoteFormOpen] = useState(false);
  
  const [editUnit, setEditUnit] = useState<Unit | null>(null);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [editNote, setEditNote] = useState<Note | null>(null);
  
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'unit' | 'topic' | 'note'; item: any } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [unitsData, topicsData, notesData] = await Promise.all([
        fetchUnits(),
        fetchTopics(),
        fetchNotes(),
      ]);
      setUnits(unitsData);
      setTopics(topicsData);
      setNotes(notesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from Firestore');
    } finally {
      setLoading(false);
    }
  };

  const toggleUnitExpand = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const getUnitTopics = (unitId: string) => topics.filter(t => t.unit_id === unitId);
  const getTopicNotes = (topicId: string) => notes.filter(n => n.topic_id === topicId);
  const getUnitNotes = (unitId: string) => notes.filter(n => n.unit_id === unitId && !n.topic_id);

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === 'unit') {
        await deleteUnit(deleteTarget.item.id);
        setUnits(units.filter(u => u.id !== deleteTarget.item.id));
      } else if (deleteTarget.type === 'topic') {
        await deleteTopic(deleteTarget.item.id);
        setTopics(topics.filter(t => t.id !== deleteTarget.item.id));
      } else if (deleteTarget.type === 'note') {
        await deleteNote(deleteTarget.item.id);
        setNotes(notes.filter(n => n.id !== deleteTarget.item.id));
      }
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

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
            <p className="text-gray-600 text-sm font-medium">UNITS</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{units.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
            <p className="text-gray-600 text-sm font-medium">TOPICS</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{topics.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
            <p className="text-gray-600 text-sm font-medium">NOTES</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{notes.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
            <p className="text-gray-600 text-sm font-medium">STATUS</p>
            <p className="text-lg font-bold text-green-600 mt-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Online
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Units & Topics</h2>
                <Button
                  onClick={() => {
                    setEditUnit(null);
                    setUnitFormOpen(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Unit
                </Button>
              </div>

              {units.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No units yet</p>
                  <p className="text-sm mt-1">Click "Add Unit" to create your first unit.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {units.map((unit) => {
                    const unitTopics = getUnitTopics(unit.id);
                    const unitNotes = getUnitNotes(unit.id);
                    const isExpanded = expandedUnits.has(unit.id);

                    return (
                      <div key={unit.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => toggleUnitExpand(unit.id)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </button>
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: unit.color }}
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">{unit.name}</h3>
                              <p className="text-xs text-gray-600">{unitTopics.length} topics, {unitNotes.length} unit notes</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditUnit(unit);
                                setUnitFormOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'unit', item: unit })}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 space-y-4 bg-white border-t border-gray-200">
                            {/* Topics under this unit */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">Topics</h4>
                                <Button
                                  onClick={() => {
                                    setSelectedUnit(unit);
                                    setEditTopic(null);
                                    setTopicFormOpen(true);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Topic
                                </Button>
                              </div>

                              {unitTopics.length === 0 ? (
                                <p className="text-sm text-gray-500">No topics yet</p>
                              ) : (
                                <div className="space-y-2">
                                  {unitTopics.map((topic) => {
                                    const topicNotes = getTopicNotes(topic.id);
                                    return (
                                      <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 flex-1">
                                          <div
                                            className="w-3 h-3 rounded"
                                            style={{ backgroundColor: topic.color }}
                                          />
                                          <div>
                                            <p className="font-medium text-gray-900">{topic.name}</p>
                                            <p className="text-xs text-gray-600">{topicNotes.length} notes</p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              setEditTopic(topic);
                                              setTopicFormOpen(true);
                                            }}
                                            className="p-1 rounded text-gray-400 hover:text-orange-600"
                                          >
                                            <Pencil className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => setDeleteTarget({ type: 'topic', item: topic })}
                                            className="p-1 rounded text-gray-400 hover:text-red-600"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Unit-level notes */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">Unit Notes</h4>
                                <Button
                                  onClick={() => {
                                    setSelectedUnit(unit);
                                    setSelectedTopic(null);
                                    setEditNote(null);
                                    setNoteFormOpen(true);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Note
                                </Button>
                              </div>

                              {unitNotes.length === 0 ? (
                                <p className="text-sm text-gray-500">No unit-level notes yet</p>
                              ) : (
                                <div className="space-y-2">
                                  {unitNotes.map((note) => (
                                    <div key={note.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">{note.title}</p>
                                        <p className="text-xs text-gray-600">{note.description}</p>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            setEditNote(note);
                                            setNoteFormOpen(true);
                                          }}
                                          className="p-1 rounded text-gray-400 hover:text-orange-600"
                                        >
                                          <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => setDeleteTarget({ type: 'note', item: note })}
                                          className="p-1 rounded text-gray-400 hover:text-red-600"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Unit Form Dialog */}
      <UnitFormDialog
        open={unitFormOpen}
        onClose={() => {
          setUnitFormOpen(false);
          setEditUnit(null);
        }}
        onSave={() => {
          fetchData();
        }}
        editUnit={editUnit}
      />

      {/* Topic Form Dialog */}
      <TopicFormDialog
        open={topicFormOpen}
        onClose={() => {
          setTopicFormOpen(false);
          setEditTopic(null);
          setSelectedUnit(null);
        }}
        onSave={() => {
          fetchData();
        }}
        editTopic={editTopic}
        selectedUnit={selectedUnit}
      />

      {/* Note Form Dialog */}
      <NoteFormDialog
        open={noteFormOpen}
        onClose={() => {
          setNoteFormOpen(false);
          setEditNote(null);
          setSelectedUnit(null);
          setSelectedTopic(null);
        }}
        onSave={() => {
          fetchData();
        }}
        editNote={editNote}
        selectedUnit={selectedUnit}
        selectedTopic={selectedTopic}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === 'unit' ? 'Unit' : deleteTarget?.type === 'topic' ? 'Topic' : 'Note'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.item.name || deleteTarget?.item.title}"</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
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

// ─── Unit Form Dialog ─────────────────────────────────────────────────────────
function UnitFormDialog({
  open,
  onClose,
  onSave,
  editUnit,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editUnit: Unit | null;
}) {
  const [form, setForm] = useState({ name: '', description: '', color: '#3b82f6', file_path: '' });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (editUnit) {
      setForm(editUnit);
    } else {
      setForm({ name: '', description: '', color: '#3b82f6', file_path: '' });
    }
    setFile(null);
    setUploadError('');
  }, [editUnit, open]);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setUploadError('');

    try {
      let filePath = form.file_path;
      
      // Upload file if selected
      if (file) {
        try {
          if (editUnit) {
            const result = await updateUnitFile(editUnit.id, file, {
              name: form.name,
              description: form.description,
              color: form.color,
            });
            filePath = result.file_path;
          } else {
            const result = await uploadUnitFile(file, {
              name: form.name,
              description: form.description,
              color: form.color,
            });
            filePath = result.file_path;
            // File upload already created the unit, so just update Firebase
            await addUnit({
              name: form.name,
              description: form.description,
              color: form.color,
              file_path: filePath,
              created_at: new Date().toISOString(),
            } as Omit<Unit, 'id'>);
            onSave();
            onClose();
            return;
          }
        } catch (error) {
          setUploadError('Failed to upload file. Please try again.');
          console.error('File upload error:', error);
          setSaving(false);
          return;
        }
      }
      
      if (editUnit) {
        await updateUnit(editUnit.id, { ...form, file_path: filePath } as Partial<Unit>);
      } else {
        await addUnit({
          ...form,
          file_path: filePath,
          created_at: new Date().toISOString(),
        } as Omit<Unit, 'id'>);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving unit:', error);
      setUploadError('Failed to save unit. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editUnit ? 'Edit Unit' : 'Add New Unit'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Unit Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Introduction to Accounting"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description"
            />
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <Input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <Label>Unit File (PDF, DOC, DOCX, PPT, PPTX, TXT)</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={saving}
              className="cursor-pointer"
            />
            {file && <p className="text-xs text-green-600 mt-1">File selected: {file.name}</p>}
          </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{uploadError}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? 'Saving...' : 'Save Unit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Topic Form Dialog ────────────────────────────────────────────────────────
function TopicFormDialog({
  open,
  onClose,
  onSave,
  editTopic,
  selectedUnit,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editTopic: Topic | null;
  selectedUnit: Unit | null;
}) {
  const [form, setForm] = useState({ name: '', description: '', color: '#10b981', unit_id: '', file_path: '' });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (editTopic) {
      setForm(editTopic);
    } else {
      setForm({ name: '', description: '', color: '#10b981', unit_id: selectedUnit?.id || '', file_path: '' });
    }
    setFile(null);
    setUploadError('');
  }, [editTopic, selectedUnit, open]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.unit_id) return;
    setSaving(true);
    setUploadError('');

    try {
      let filePath = form.file_path;
      
      // Upload file if selected
      if (file) {
        try {
          if (editTopic) {
            const result = await updateTopicFile(editTopic.id, file, {
              name: form.name,
              description: form.description,
              unit_id: form.unit_id,
            });
            filePath = result.file_path;
          } else {
            const result = await uploadTopicFile(file, {
              name: form.name,
              description: form.description,
              unit_id: form.unit_id,
            });
            filePath = result.file_path;
            // File upload already created the topic, so just update Firebase
            await addTopic({
              name: form.name,
              description: form.description,
              color: form.color,
              unit_id: form.unit_id,
              file_path: filePath,
              created_at: new Date().toISOString(),
            } as Omit<Topic, 'id'>);
            onSave();
            onClose();
            return;
          }
        } catch (error) {
          setUploadError('Failed to upload file. Please try again.');
          console.error('File upload error:', error);
          setSaving(false);
          return;
        }
      }
      
      if (editTopic) {
        await updateTopic(editTopic.id, { ...form, file_path: filePath } as Partial<Topic>);
      } else {
        await addTopic({
          ...form,
          file_path: filePath,
          created_at: new Date().toISOString(),
        } as Omit<Topic, 'id'>);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving topic:', error);
      setUploadError('Failed to save topic. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editTopic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Topic Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Accounting Equation"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description"
            />
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <Input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="#10b981"
              />
            </div>
          </div>

          <div>
            <Label>Topic File (PDF, DOC, DOCX, PPT, PPTX, TXT)</Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={saving}
              className="cursor-pointer"
            />
            {file && <p className="text-xs text-green-600 mt-1">File selected: {file.name}</p>}
          </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{uploadError}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? 'Saving...' : 'Save Topic'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Note Form Dialog ─────────────────────────────────────────────────────────
function NoteFormDialog({
  open,
  onClose,
  onSave,
  editNote,
  selectedUnit,
  selectedTopic,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editNote: Note | null;
  selectedUnit: Unit | null;
  selectedTopic: Topic | null;
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    unit_id: '',
    topic_id: '',
    note_type: 'unit' as 'unit' | 'topic',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editNote) {
      setForm({
        title: editNote.title,
        description: editNote.description,
        content: editNote.content,
        unit_id: editNote.unit_id,
        topic_id: editNote.topic_id || '',
        note_type: editNote.note_type,
      });
    } else {
      setForm({
        title: '',
        description: '',
        content: '',
        unit_id: selectedUnit?.id || '',
        topic_id: selectedTopic?.id || '',
        note_type: selectedTopic ? 'topic' : 'unit',
      });
    }
  }, [editNote, selectedUnit, selectedTopic, open]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.unit_id) return;
    setSaving(true);

    try {
      if (editNote) {
        await updateNote(editNote.id, form as Partial<Note>);
      } else {
        await addNote({
          ...form,
          id: '',
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
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Note Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Note title"
            />
          </div>

          <div>
            <Label>Note Type</Label>
            <Select value={form.note_type} onValueChange={(value: any) => setForm({ ...form, note_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unit">Unit-Level Note</SelectItem>
                <SelectItem value="topic">Topic-Level Note</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description"
            />
          </div>

          <div>
            <Label>Content</Label>
            <textarea
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
              disabled={saving || !form.title.trim()}
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
