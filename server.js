import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// متن عربی سوره (مثلاً یاسین = 36)
app.get('/api/surah/:id', (req, res) => {
  const file = path.join('data/chapters/imlaei', `${req.params.id}.json`);
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Surah not found' });
  }
});

// ترجمه سوره به زبان خاص (fa, en, ...)
app.get('/api/surah/:id/translation/:lang', (req, res) => {
  const file = path.join('data/translations', req.params.lang, `${req.params.id}.json`);
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Translation not found' });
  }
});

// تفسیر سعدی برای یک سوره
app.get('/api/tafsir/:id', (req, res) => {
  const file = path.join('data/tafsir-saadi', req.params.id, 'verses.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Tafsir not found' });
  }
});

// لیست قاریان
app.get('/api/reciters', (req, res) => {
  const file = path.join('data/resources/recitations.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Reciter list not found' });
  }
});

// لیست ترجمه‌ها
app.get('/api/translations', (req, res) => {
  const file = path.join('data/resources/translations.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Translation list not found' });
  }
});

// فایل صوتی یک سوره از یک قاری خاص
app.get('/api/audio/:reciter/:id', (req, res) => {
  const file = path.join('data/reciters', req.params.reciter, `${req.params.id}.mp3`);
  if (fs.existsSync(file)) {
    res.sendFile(path.resolve(file));
  } else {
    res.status(404).json({ error: 'Audio not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Rozhn API running on port ${PORT}`);
});
