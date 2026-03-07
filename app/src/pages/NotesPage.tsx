import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, ChevronRight, FileText, Loader2, AlertCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchNotes, fetchTopics, type Note, type Topic } from '@/services/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notes as staticNotes } from '@/data/notes';

// Static topics for fallback
const staticTopics: Topic[] = [
  { id: '1', name: 'Introduction to Accounting', description: 'Learn the fundamentals of accounting', color: '#3b82f6' },
  { id: '2', name: 'Recording Transactions', description: 'Master source documents and journals', color: '#10b981' },
  { id: '3', name: 'Financial Statements', description: 'Understand income statements and balance sheets', color: '#8b5cf6' },
  { id: '4', name: 'Assets & Liabilities', description: 'Learn about depreciation and PPE', color: '#f97316' },
  { id: '5', name: 'Partnership Accounts', description: 'Study partnership agreements', color: '#ec4899' },
  { id: '6', name: 'Company Accounts', description: 'Explore share capital', color: '#6366f1' },
  { id: '7', name: 'Manufacturing Accounts', description: 'Learn cost classification', color: '#14b8a6' },
  { id: '8', name: 'Non-Profit Organizations', description: 'Understand receipts and payments', color: '#ef4444' },
  { id: '9', name: 'Correction of Errors', description: 'Master suspense accounts', color: '#eab308' },
];

export function NotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(searchParams.get('topic'));
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Firebase state
  const [topics, setTopics] = useState<Topic[]>(staticTopics);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch topics and notes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from Firebase
        const [firebaseTopics, firebaseNotes] = await Promise.all([
          fetchTopics(),
          fetchNotes(),
        ]);

        if (firebaseTopics.length > 0) {
          setTopics(firebaseTopics);
        }

        if (firebaseNotes.length > 0) {
          setNotes(firebaseNotes);
          setUsingFallback(false);
        } else {
          // Use fallback static notes
          setUsingFallback(true);
          setNotes(staticNotes.map((n: any) => ({
            id: n.id || Math.random().toString(),
            title: n.title,
            description: n.content.substring(0, 100) + '...',
            content: n.content,
            topic_id: n.topicId,
            created_at: new Date().toISOString(),
          })));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to connect to Firestore. Using offline data.');
        setUsingFallback(true);
        // Load fallback data
        setNotes(staticNotes.map((n: any) => ({
          id: n.id || Math.random().toString(),
          title: n.title,
          description: n.content.substring(0, 100) + '...',
          content: n.content,
          topic_id: n.topicId,
          created_at: new Date().toISOString(),
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedTopic) params.set('topic', selectedTopic);
    setSearchParams(params);
  };

  // Filter notes based on search and topic
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTopic = !selectedTopic || note.topic_id === selectedTopic;
    
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Notes</h1>
          <p className="text-lg text-gray-600">
            Browse our comprehensive collection of accounting notes and topics
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search accounting topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Fallback Warning */}
        {usingFallback && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Using Offline Data</p>
              <p className="text-sm text-amber-800">
                {error || 'Showing cached notes. Live updates will be available when connected to Firebase.'}
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Topics Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Topics
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedTopic(null);
                    setSearchParams(new URLSearchParams());
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    !selectedTopic
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Topics
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      const params = new URLSearchParams();
                      params.set('topic', topic.id);
                      setSearchParams(params);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTopic === topic.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: topic.color }}
                    />
                    {topic.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No notes found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search or topic filter
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((note) => {
                  const topic = topics.find((t) => t.id === note.topic_id);
                  return (
                    <button
                      key={note.id}
                      onClick={() => {
                        setSelectedNote(note);
                        setIsDialogOpen(true);
                      }}
                      className="w-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {note.title}
                            </h3>
                            {topic && (
                              <span
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: topic.color }}
                              >
                                {topic.name}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {note.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-3">
                            {new Date(note.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {selectedNote?.title}
                </DialogTitle>
                {selectedNote && topics.find((t) => t.id === selectedNote.topic_id) && (
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white mt-2"
                    style={{
                      backgroundColor: topics.find((t) => t.id === selectedNote.topic_id)?.color,
                    }}
                  >
                    {topics.find((t) => t.id === selectedNote.topic_id)?.name}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-200px)] pr-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 mb-6">{selectedNote?.description}</p>
              <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {selectedNote?.content}
              </div>
            </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
    </div>
  );
}
