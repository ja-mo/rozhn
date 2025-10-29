import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// متن عربی سوره با رسم‌الخط انتخابی (uthmani یا imlaei)
app.get('/api/surah/:id', (req, res) => {
  const script = req.query.script || 'uthmani';
  const file = path.join('data/chapters', script, req.params.id, 'surah.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Surah not found' });
  }
});

// ترجمه فارسی با شناسه ترجمه (مثلاً 135)
app.get('/api/surah/:id/translation/:translationId', (req, res) => {
  const script = req.query.script || 'uthmani';
  const file = path.join('data/chapters', script, req.params.id, `translation_${req.params.translationId}.json`);
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Translation not found' });
  }
});

// متن عربی همراه ترجمه فارسی ترکیبی
app.get('/api/surah/:id/combined/:translationId', (req, res) => {
  const script = req.query.script || 'uthmani';
  const file = path.join('data/chapters', script, req.params.id, `combined_${req.params.translationId}.json`);
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Combined text not found' });
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

// لیست ترجمه‌های موجود
app.get('/api/translations', (req, res) => {
  const file = path.join('data/resources/translations.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Translation list not found' });
  }
});

// لیست قاریان برجسته
app.get('/api/reciters', (req, res) => {
  const file = path.join('data/resources/recitations.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Reciter list not found' });
  }
});

// اطلاعات یک قاری خاص از یک سبک خاص
app.get('/api/reciter/:style/:filename', (req, res) => {
  const file = path.join('data/reciters', req.params.style, `${req.params.filename}.json`);
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Reciter info not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Rozhn API running on port ${PORT}`);
});
