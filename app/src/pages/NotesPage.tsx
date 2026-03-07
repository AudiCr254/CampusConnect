import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, BookOpen, ChevronRight, FileText, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { topicsApi, notesApi, type Topic, type Note } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Static topics for fallback
const staticTopics: Topic[] = [
  { id: 1, name: 'Introduction to Accounting', description: 'Learn the fundamentals of accounting', color: '#3b82f6', icon: 'BookOpen', note_count: 4, created_at: '' },
  { id: 2, name: 'Recording Transactions', description: 'Master source documents and journals', color: '#10b981', icon: 'FileText', note_count: 2, created_at: '' },
  { id: 3, name: 'Financial Statements', description: 'Understand income statements and balance sheets', color: '#8b5cf6', icon: 'BarChart3', note_count: 2, created_at: '' },
  { id: 4, name: 'Assets & Liabilities', description: 'Learn about depreciation and PPE', color: '#f97316', icon: 'Building2', note_count: 2, created_at: '' },
  { id: 5, name: 'Partnership Accounts', description: 'Study partnership agreements', color: '#ec4899', icon: 'Users', note_count: 2, created_at: '' },
  { id: 6, name: 'Company Accounts', description: 'Explore share capital', color: '#6366f1', icon: 'Building', note_count: 2, created_at: '' },
  { id: 7, name: 'Manufacturing Accounts', description: 'Learn cost classification', color: '#14b8a6', icon: 'Factory', note_count: 1, created_at: '' },
  { id: 8, name: 'Non-Profit Organizations', description: 'Understand receipts and payments', color: '#ef4444', icon: 'Heart', note_count: 1, created_at: '' },
  { id: 9, name: 'Correction of Errors', description: 'Master suspense accounts', color: '#eab308', icon: 'AlertCircle', note_count: 1, created_at: '' },
];

export function NotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(searchParams.get('topic'));
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // API state
  const [topics, setTopics] = useState<Topic[]>(staticTopics);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch topics and notes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch topics from API
        const topicsRes = await topicsApi.getAll();
        if (topicsRes.success && topicsRes.data) {
          setTopics(topicsRes.data);
        }

        // Try to fetch notes from API
        const notesRes = await notesApi.getAll();
        if (notesRes.success && notesRes.data && notesRes.data.length > 0) {
          setNotes(notesRes.data);
          setUsingFallback(false);
        } else {
          // Use fallback static notes
          setUsingFallback(true);
          // Import static notes as fallback
          const { notes: staticNotes } = await import('@/data/notes');
          setNotes(staticNotes.map((n, i) => ({
            id: i + 1,
            title: n.title,
            description: n.content.substring(0, 100) + '...',
            content: n.content,
            topic_id: parseInt(n.topicId) || 1,
            topic_name: staticTopics.find(t => t.id === (parseInt(n.topicId) || 1))?.name,
            created_at: new Date().toISOString(),
          })));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to connect to server. Using offline data.');
        setUsingFallback(true);
        // Load fallback data
        const { notes: staticNotes } = await import('@/data/notes');
        setNotes(staticNotes.map((n, i) => ({
          id: i + 1,
          title: n.title,
          description: n.content.substring(0, 100) + '...',
          content: n.content,
          topic_id: parseInt(n.topicId) || 1,
          topic_name: staticTopics.find(t => t.id === (parseInt(n.topicId) || 1))?.name,
          created_at: new Date().toISOString(),
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedTopic) params.set('topic', selectedTopic);
    setSearchParams(params);
  }, [searchQuery, selectedTopic, setSearchParams]);

  // Filter notes based on search and topic
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesTopic = !selectedTopic || note.topic_id === parseInt(selectedTopic);
      const matchesSearch = !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.description && note.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTopic && matchesSearch;
    });
  }, [searchQuery, selectedTopic, notes]);

  // Group notes by topic
  const groupedNotes = useMemo(() => {
    const grouped: Record<string, Note[]> = {};
    filteredNotes.forEach((note) => {
      const topicId = note.topic_id?.toString() || 'uncategorized';
      if (!grouped[topicId]) {
        grouped[topicId] = [];
      }
      grouped[topicId].push(note);
    });
    return grouped;
  }, [filteredNotes]);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsDialogOpen(true);
  };

  const selectedTopicData = topics.find((t) => t.id === parseInt(selectedTopic || ''));

  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16 bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading notes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Accounting Notes
          </h1>
          <p className="text-gray-600">
            Browse our comprehensive collection of accounting study materials
          </p>
          {usingFallback && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              <AlertCircle className="w-4 h-4" />
              Using offline data (server unavailable)
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg bg-white border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Topic Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTopic(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedTopic
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Topics
          </button>
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id.toString() === selectedTopic ? null : topic.id.toString())}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTopic === topic.id.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {topic.name}
            </button>
          ))}
        </div>

        {/* Selected Topic Info */}
        {selectedTopicData && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">{selectedTopicData.name}</h2>
                <p className="text-blue-100">{selectedTopicData.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredNotes.length}</span> note
            {filteredNotes.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Notes List */}
        {filteredNotes.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedNotes).map(([topicId, topicNotes]) => {
              const topic = topics.find((t) => t.id === parseInt(topicId));
              if (!topic && topicId !== 'uncategorized') return null;

              return (
                <div key={topicId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      {topic?.name || 'Uncategorized'}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {topicNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => handleNoteClick(note)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                            {note.title}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic(null);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Note Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {selectedNote?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="px-6 py-4">
              <div className="prose prose-blue max-w-none">
                {selectedNote?.content ? (
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {selectedNote.content}
                  </div>
                ) : selectedNote?.description ? (
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {selectedNote.description}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No content available</p>
                )}
              </div>
            </div>
          </ScrollArea>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
