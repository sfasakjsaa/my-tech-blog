import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 8080;
const DATA_DIR = path.join(process.cwd(), 'data');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
async function initDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Initialize categories file if not exists
    const categoriesPath = path.join(DATA_DIR, 'categories.json');
    try {
      await fs.access(categoriesPath);
    } catch {
      await fs.writeFile(categoriesPath, JSON.stringify([], null, 2));
    }

    // Initialize questions file if not exists
    const questionsPath = path.join(DATA_DIR, 'questions.json');
    try {
      await fs.access(questionsPath);
    } catch {
      await fs.writeFile(questionsPath, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Failed to initialize data directory:', error);
  }
}

// Helper functions
async function readData(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

async function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function successResponse(data) {
  return { success: true, data };
}

// ============ Categories API ============

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await readData('categories.json');
    res.json(successResponse(categories.sort((a, b) => a.order - b.order)));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create category
app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const categories = await readData('categories.json');
    const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) : 0;

    const newCategory = {
      id: Date.now().toString(),
      name,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    categories.push(newCategory);
    await writeData('categories.json', categories);

    res.json(successResponse(newCategory));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;

    const categories = await readData('categories.json');
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    categories[index] = {
      ...categories[index],
      name: name || categories[index].name,
      order: order !== undefined ? order : categories[index].order,
      updatedAt: new Date().toISOString()
    };

    await writeData('categories.json', categories);
    res.json(successResponse(categories[index]));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await readData('categories.json');
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const filtered = categories.filter(c => c.id !== id);
    await writeData('categories.json', filtered);
    res.json(successResponse(null));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reorder categories
app.post('/api/categories/reorder', async (req, res) => {
  try {
    const { categories: newCategories } = req.body;

    const categories = await readData('categories.json');
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    const updated = newCategories.map(item => {
      const cat = categoryMap.get(item.id);
      return cat ? { ...cat, order: item.order, updatedAt: new Date().toISOString() } : null;
    }).filter(Boolean);

    await writeData('categories.json', updated);
    res.json(successResponse(null));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ Questions API ============

// Get questions list
app.get('/api/questions', async (req, res) => {
  try {
    const { categoryId, search } = req.query;

    let questions = await readData('questions.json');

    // Filter by category
    if (categoryId) {
      questions = questions.filter(q => q.categoryId === categoryId);
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      questions = questions.filter(q =>
        q.title.toLowerCase().includes(searchLower) ||
        q.content.toLowerCase().includes(searchLower)
      );
    }

    res.json(successResponse(questions));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create question
app.post('/api/questions', async (req, res) => {
  try {
    const { title, content, categoryId, isFrequent = false } = req.body;

    if (!title || !content || !categoryId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const questions = await readData('questions.json');

    const newQuestion = {
      id: Date.now().toString(),
      title,
      content,
      categoryId,
      isFrequent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    questions.push(newQuestion);
    await writeData('questions.json', questions);

    res.json(successResponse(newQuestion));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update question
app.put('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId, isFrequent } = req.body;

    const questions = await readData('questions.json');
    const index = questions.findIndex(q => q.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    questions[index] = {
      ...questions[index],
      title: title || questions[index].title,
      content: content || questions[index].content,
      categoryId: categoryId || questions[index].categoryId,
      isFrequent: isFrequent !== undefined ? isFrequent : questions[index].isFrequent,
      updatedAt: new Date().toISOString()
    };

    await writeData('questions.json', questions);
    res.json(successResponse(questions[index]));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete question
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const questions = await readData('questions.json');
    const index = questions.findIndex(q => q.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const filtered = questions.filter(q => q.id !== id);
    await writeData('questions.json', filtered);
    res.json(successResponse(null));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reorder questions
app.post('/api/questions/reorder', async (req, res) => {
  try {
    const { questions: newQuestions } = req.body;

    const questions = await readData('questions.json');
    const questionMap = new Map(questions.map(q => [q.id, q]));

    const updated = newQuestions.map(item => {
      const q = questionMap.get(item.id);
      return q ? { ...q, order: item.order, updatedAt: new Date().toISOString() } : null;
    }).filter(Boolean);

    await writeData('questions.json', updated);
    res.json(successResponse(null));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
async function startServer() {
  await initDataDir();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Data directory: ${DATA_DIR}`);
  });
}

startServer();
