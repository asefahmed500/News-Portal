// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read database
const readDB = () => {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
};

// Helper function to write database
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};


app.get('/', (req, res) => {
    res.send('Welcome to the News Portal API');
  
});


// ============ USERS ENDPOINTS ============

// GET /users - List all users
app.get('/users', (req, res) => {
  try {
    const db = readDB();
    res.json(db.users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /users/:id - Get a single user
app.get('/users/:id', (req, res) => {
  try {
    const db = readDB();
    const user = db.users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ============ NEWS ENDPOINTS ============

// GET /news - List all news (with optional search)
app.get('/news', (req, res) => {
  try {
    const db = readDB();
    let news = db.news;
    
    // Search functionality
    if (req.query.title) {
      const searchTerm = req.query.title.toLowerCase();
      news = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm)
      );
    }
    
    // Pagination
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedNews = news.slice(startIndex, endIndex);
    
    // Add pagination headers
    res.setHeader('X-Total-Count', news.length);
    res.setHeader('X-Page', page);
    res.setHeader('X-Per-Page', limit);
    
    res.json(paginatedNews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// GET /news/:id - Get full news including comments
app.get('/news/:id', (req, res) => {
  try {
    const db = readDB();
    const newsItem = db.news.find(n => n.id === parseInt(req.params.id));
    
    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// POST /news - Create news item
app.post('/news', (req, res) => {
  try {
    const { title, body, author_id } = req.body;
    
    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'News title cannot be empty' });
    }
    
    if (!body || body.length < 20) {
      return res.status(400).json({ 
        error: 'News body must be at least 20 characters' 
      });
    }
    
    if (!author_id) {
      return res.status(400).json({ error: 'Author ID is required' });
    }
    
    const db = readDB();
    
    // Check if author exists
    const author = db.users.find(u => u.id === parseInt(author_id));
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    // Create new news item
    const newNews = {
      id: db.news.length > 0 ? Math.max(...db.news.map(n => n.id)) + 1 : 1,
      title: title.trim(),
      body: body.trim(),
      author_id: parseInt(author_id),
      comments: []
    };
    
    db.news.push(newNews);
    writeDB(db);
    
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create news' });
  }
});

// PATCH /news/:id - Edit news or add comments
app.patch('/news/:id', (req, res) => {
  try {
    const db = readDB();
    const newsIndex = db.news.findIndex(n => n.id === parseInt(req.params.id));
    
    if (newsIndex === -1) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    const newsItem = db.news[newsIndex];
    const { title, body, comments, author_id } = req.body;
    
    // If updating title or body (editing news)
    if (title !== undefined || body !== undefined) {
      // Verify author
      if (author_id && newsItem.author_id !== parseInt(author_id)) {
        return res.status(403).json({ 
          error: 'You can only edit your own news' 
        });
      }
      
      // Validation
      if (title !== undefined && title.trim() === '') {
        return res.status(400).json({ error: 'News title cannot be empty' });
      }
      
      if (body !== undefined && body.length < 20) {
        return res.status(400).json({ 
          error: 'News body must be at least 20 characters' 
        });
      }
      
      if (title !== undefined) newsItem.title = title.trim();
      if (body !== undefined) newsItem.body = body.trim();
    }
    
    // If adding/updating comments
    if (comments !== undefined) {
      // Validate comment if it's a new comment being added
      if (Array.isArray(comments) && comments.length > newsItem.comments.length) {
        const newComment = comments[comments.length - 1];
        if (!newComment.text || newComment.text.trim() === '') {
          return res.status(400).json({ 
            error: 'Comment text cannot be empty' 
          });
        }
        
        // Add comment metadata
        newComment.id = newsItem.comments.length > 0 
          ? Math.max(...newsItem.comments.map(c => c.id)) + 1 
          : 1;
        newComment.timestamp = new Date().toISOString();
        newComment.text = newComment.text.trim();
      }
      
      newsItem.comments = comments;
    }
    
    db.news[newsIndex] = newsItem;
    writeDB(db);
    
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// DELETE /news/:id - Delete news item
app.delete('/news/:id', (req, res) => {
  try {
    const db = readDB();
    const newsIndex = db.news.findIndex(n => n.id === parseInt(req.params.id));
    
    if (newsIndex === -1) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    const newsItem = db.news[newsIndex];
    const { author_id } = req.query;
    
    // Verify author
    if (author_id && newsItem.author_id !== parseInt(author_id)) {
      return res.status(403).json({ 
        error: 'You can only delete your own news' 
      });
    }
    
    db.news.splice(newsIndex, 1);
    writeDB(db);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

// ============ UTILITY ENDPOINTS ============

// GET /news/:id/comments-count - Get comment count for a news item
app.get('/news/:id/comments-count', (req, res) => {
  try {
    const db = readDB();
    const newsItem = db.news.find(n => n.id === parseInt(req.params.id));
    
    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.json({ count: newsItem.comments.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get comment count' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'News Portal API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 News Portal API running on http://localhost:${PORT}`);
  console.log(`📊 Database file: ${DB_FILE}`);
});

module.exports = app;