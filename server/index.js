const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Добавить это
const app = express();
const PORT = 5000;

app.use(cors());

// Настройки подключения к твоей базе
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'med_db',
  password: '17052006', // <-- ВПИШИ СВОЙ ПАРОЛЬ ЗДЕСЬ
  port: 5432,
});

// Новый маршрут, который отдает список факультетов
app.get('/faculties', async (req, res) => {
  try {
    // Сервер делает запрос в базу
    const result = await pool.query('SELECT * FROM faculties');
    // И отправляет результат в браузер
    res.json(result.rows); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при работе с базой данных');
  }
});

app.get('/subjects/:facultyId/:courseId', async (req, res) => {
  const { facultyId, courseId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM subjects WHERE faculty_id = $1 AND course_id = $2', 
      [facultyId, courseId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Ошибка сервера');
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

