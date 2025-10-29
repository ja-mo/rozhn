import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// لیست سوره‌ها
app.get('/api/surahs', (req, res) => {
  const file = path.join('output/tafsir-saadi/index.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Surah list not found' });
  }
});

// تفسیر یک سوره
app.get('/api/tafsir/:slug', (req, res) => {
  const slug = req.params.slug;
  const file = path.join('output/tafsir-saadi', slug, 'verses.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    res.status(404).json({ error: 'Tafsir not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
