import { getAllNotes, searchNotes, type Note } from './supabaseReadService';

/**
 * Search notes for relevant content based on a query
 */
export async function searchNotesForAnswer(query: string): Promise<Note[]> {
  try {
    // First try Supabase full-text search
    let allNotes = await searchNotes(query);
    
    // If no results, fall back to fetching all notes
    if (allNotes.length === 0) {
      allNotes = await getAllNotes();
    }
    
    // Convert query to lowercase for case-insensitive search
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

    // Score notes based on relevance
    const scoredNotes = allNotes
      .map(note => {
        let score = 0;
        const titleLower = note.title.toLowerCase();
        const descriptionLower = note.description.toLowerCase();
        const contentLower = note.content.toLowerCase();

        // Exact phrase match in title (highest priority)
        if (titleLower.includes(queryLower)) {
          score += 100;
        }

        // Word matches in title
        queryWords.forEach(word => {
          if (titleLower.includes(word)) score += 30;
        });

        // Word matches in description
        queryWords.forEach(word => {
          if (descriptionLower.includes(word)) score += 15;
        });

        // Word matches in content
        queryWords.forEach(word => {
          const matches = (contentLower.match(new RegExp(word, 'g')) || []).length;
          score += matches * 5;
        });

        return { note, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // Get top 5 relevant notes
      .map(item => item.note);

    return scoredNotes;
  } catch (error) {
    console.error('Error searching notes:', error);
    return [];
  }
}

/**
 * Extract relevant excerpts from notes
 */
export function extractRelevantExcerpts(notes: Note[], query: string): string {
  if (notes.length === 0) return '';

  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const excerpts: string[] = [];

  notes.forEach(note => {
    // Find sentences that contain query words
    const sentences = note.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach(sentence => {
      const sentenceLower = sentence.toLowerCase();
      const matchCount = queryWords.filter(word => sentenceLower.includes(word)).length;
      
      if (matchCount > 0) {
        excerpts.push(`**From "${note.title}"**: ${sentence.trim()}`);
      }
    });
  });

  return excerpts.slice(0, 3).join('\n\n'); // Return top 3 excerpts
}

/**
 * Build an answer from user notes
 */
export async function answerFromNotes(query: string): Promise<{ answer: string; foundInNotes: boolean }> {
  try {
    const relevantNotes = await searchNotesForAnswer(query);

    if (relevantNotes.length === 0) {
      return {
        answer: '',
        foundInNotes: false,
      };
    }

    const excerpts = extractRelevantExcerpts(relevantNotes, query);
    
    if (!excerpts) {
      return {
        answer: '',
        foundInNotes: false,
      };
    }

    const answer = `Based on your study notes:\n\n${excerpts}\n\n---\n*This answer was compiled from your personal study notes.*`;

    return {
      answer,
      foundInNotes: true,
    };
  } catch (error) {
    console.error('Error generating answer from notes:', error);
    return {
      answer: '',
      foundInNotes: false,
    };
  }
}

/**
 * Fetch answer from internet using Hugging Face API
 */
export async function answerFromInternet(query: string): Promise<string> {
  try {
    const hfApiKey = import.meta.env.VITE_HF_API_KEY;
    const hfModel = import.meta.env.VITE_HF_MODEL || 'google/flan-t5-base';

    if (!hfApiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    // Prepare the prompt for accounting education
    const systemPrompt = `You are an expert accounting tutor. Provide clear, concise, and educational answers to accounting questions. 
Focus on:
- Accuracy and clarity
- Practical examples when relevant
- Step-by-step explanations for complex concepts
- Referencing accounting principles and standards

Keep answers concise (2-3 paragraphs maximum).`;

    const fullPrompt = `${systemPrompt}\n\nQuestion: ${query}`;

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${hfModel}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_length: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Hugging Face API error:', errorData);
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response formats from Hugging Face
    let answer = '';
    if (Array.isArray(data)) {
      answer = data[0]?.generated_text || '';
    } else if (data.generated_text) {
      answer = data.generated_text;
    }

    // Clean up the response (remove the prompt from the output if it's included)
    if (answer.includes(fullPrompt)) {
      answer = answer.replace(fullPrompt, '').trim();
    }

    return answer ? `${answer}\n\n---\n*This answer was generated using AI based on general accounting knowledge.*` : '';
  } catch (error) {
    console.error('Error fetching from Hugging Face:', error);
    
    // Fallback: Return a helpful message
    return `I'm having trouble accessing my knowledge base right now. Try:\n- Checking your study materials\n- Searching for related topics\n- Breaking down the question into smaller parts\n\n*Note: Make sure your API key is properly configured.*`;
  }
}

/**
 * Main AI answer function that prioritizes notes then falls back to internet
 */
export async function getAIAnswer(query: string): Promise<{ answer: string; source: 'notes' | 'internet' }> {
  try {
    // First, try to answer from user's notes
    const notesAnswer = await answerFromNotes(query);
    
    if (notesAnswer.foundInNotes) {
      return {
        answer: notesAnswer.answer,
        source: 'notes',
      };
    }

    // If not found in notes, fetch from internet
    const internetAnswer = await answerFromInternet(query);
    
    return {
      answer: internetAnswer,
      source: 'internet',
    };
  } catch (error) {
    console.error('Error in getAIAnswer:', error);
    return {
      answer: 'Sorry, I encountered an error while processing your question. Please try again.',
      source: 'internet',
    };
  }
}
