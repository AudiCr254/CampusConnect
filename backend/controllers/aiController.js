const { OpenAI } = require('openai');
const db = require('../config/db');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI Search Controller
 * Prioritizes local notes, then falls back to general knowledge/internet
 */
exports.askAI = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // 1. Search local notes first
    const [notes] = await db.execute(
      `SELECT n.*, t.name as topic_name 
       FROM notes n 
       LEFT JOIN topics t ON n.topic_id = t.id 
       WHERE n.title LIKE ? OR n.content LIKE ? OR n.description LIKE ?
       LIMIT 3`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    let context = "";
    if (notes.length > 0) {
      context = "Here is some relevant information from the student's accounting notes:\n\n";
      notes.forEach(note => {
        context += `Topic: ${note.topic_name || 'General'}\nTitle: ${note.title}\nContent: ${note.content || note.description}\n\n`;
      });
    }

    // 2. Use OpenAI to generate a response
    // If context exists, it will prioritize it. If not, it uses general knowledge.
    const systemPrompt = `You are the CampusConnect AI Assistant, a specialized accounting tutor. 
    Your goal is to help students understand accounting concepts clearly.
    
    INSTRUCTIONS:
    1. If relevant notes are provided in the CONTEXT, prioritize that information.
    2. If the information is NOT in the notes, use your general knowledge (internet-based knowledge) to provide a comprehensive answer.
    3. Always be professional, encouraging, and clear.
    4. Use formatting (bolding, lists) to make complex topics easier to read.
    5. If you are using general knowledge because notes weren't found, you can mention "Based on general accounting principles..."
    
    ${context ? `CONTEXT:\n${context}` : "No specific notes were found for this query. Please provide a general expert answer."}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // Using the available model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      max_tokens: 1000,
    });

    const answer = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        answer,
        source: notes.length > 0 ? "notes" : "internet",
        relevant_notes: notes.map(n => ({ id: n.id, title: n.title }))
      }
    });

  } catch (error) {
    console.error("AI Search Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get AI response",
      error: error.message
    });
  }
};
