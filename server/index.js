const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
// Railway сам выдает порт через переменную PORT, используем её
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Настройки подключения для Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Берем из переменных Railway
  ssl: {
    rejectUnauthorized: false // Обязательно для облачных баз
  }
});

// Маршрут для факультетов
app.get('/faculties', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faculties');
    res.json(result.rows); 
  } catch (err) {
    console.error('Ошибка БД:', err);
    res.status(500).json({ error: 'Ошибка при работе с базой данных' });
  }
});

// Маршрут для предметов
app.get('/subjects/:facultyId/:courseId', async (req, res) => {
  const { facultyId, courseId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM subjects WHERE faculty_id = $1 AND course_id = $2', 
      [facultyId, courseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка БД:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для проверки связи
app.get('/health', (req, res) => {
  res.send('Сервер работает!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
