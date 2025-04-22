const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();
const db = require('./db.js'); 
const auth = require('./middlewares/authMiddleware');

const PORT = process.env.PORT || 4002;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const initializeServer = async () => {
  try {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing server:', error);
    process.exit(1);
  }
};

async function getAllNotes() {
    return db('notes').select('*');
  }
  
  async function getNoteById(id) {
    return db('notes').where({ id }).first();
  }

  async function getNoteByTitle(title) {
    return db('notes').where({ title }).first();
  }
  
  async function createNote(noteData) {
  
    return db('notes').insert(noteData);
  }
  
  async function deleteNote(id) {
    return db('notes').where({ id }).del();
  }
  
  async function updateNote(id, changes) {
    // changes: { orders: true/false, sell: true/false, profit: ... }
    return db('notes').where({ id }).update(changes);
  }
  // Import routes
const authRoutes = require('./routes/auth.js');

  app.use('/', router); 
  app.use('/', authRoutes); 


router.post('/add', async (req, res) => {
    const {title, content} = req.body;
  
    if (!title || !content) {
      return res.status(400).json({ error: 'title и content обязательны' });
    }
  
    try {
      const existing = await getNoteByTitle(title);
      if (existing) {
        return res.status(400).json({ error: 'Note с таким именем уже существует' });
      }
  
      // Создаем запись в таблице с дополнительными полями
      await createNote({
        title,
        content,
      });
  
  
      res.json({ message: `Note ${title} добавлен`});
    } catch (error) {
      console.error(`Ошибка сохранения данных Note в БД: ${error.message}`);
      res.status(500).json({ type: 'error', message: 'Ошибка сохранения данных Note в БД' });
    }
  });


  router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id Note обязательно' });
    }
  
    try {
      const deletedCount = await deleteNote(id);
      if (!deletedCount) {
        return res.status(404).json({ error: 'Note с таким именем не найдено' });
      }
  

  
      res.json({ message: `Note ${id} удалён` });
    } catch (error) {
      console.error(`Ошибка при удалении данных Note из БД: ${error.message}`);
      res.status(500).json({ type: 'error', message: 'Ошибка при удалении данных Note из БД' });
    }
  });

  router.get('/notes', auth, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const records = await db('notes')
        .where({ user_id: userId })
        .select('*');
  
      res.json(records);
    } catch (error) {
      console.error(`Ошибка при получении заметок: ${error.message}`);
      res.status(500).json({ message: 'Ошибка при получении заметок' });
    }
  });
  

  router.get('/notes/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    if (!id) {
      return res.status(400).json({ error: 'id Note обязательно' });
    }
    try {
      const NoteById = await getNoteById(id);
      if (!NoteById) {
      return res.status(404).json({ error: 'Заметка не найдена' });
      }
      res.json(NoteById); 
    } catch (error) {
      console.error(`Ошибка при удалении данных Note из БД: ${error.message}`);
      res.status(500).json({ type: 'error', message: 'Ошибка при удалении данных Note из БД' });
    }
  });


  router.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Имя Note обязательно' });
    }
    
    try {
      // Проверяем, существует ли Note с таким именем
      const existing = await getNoteById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Note с таким именем не найдено' });
      }
      
      // Обновляем запись в БД
      await updateNote(id, updates);
      
      res.json({ 
        message: `Note ${id} обновлен успешно`,
      });
    } catch (error) {
      console.error(`Ошибка при обновлении данных Note в БД: ${error.message}`);
      res.status(500).json({ 
        type: 'error', 
        message: 'Ошибка при обновлении данных Note в БД'
      });
    }
  });




// Start the server
initializeServer();

module.exports = app;