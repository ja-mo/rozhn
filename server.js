import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fetchSurahList, fetchSurahTafsir } from './services/fetchTafsirSaadi.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// لیست سوره‌ها
app.get('/api/surahs', async (req, res) => {
  const file = path.join('output/tafsir-saadi/index.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    try {
      const list = await fetchSurahList(); // ساخت در لحظه
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
});

// تفسیر یک سوره کامل
app.get('/api/tafsir/:slug', async (req, res) => {
  const slug = req.params.slug;
  const file = path.join('output/tafsir-saadi', slug, 'verses.json');
  if (fs.existsSync(file)) {
    res.json(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } else {
    try {
      const surahList = await fetchSurahList();
      const surah = surahList.find(s => s.slug === slug);
      if (!surah) return res.status(404).json({ error: 'Surah not found' });

      const result = await fetchSurahTafsir(surah); // ساخت در لحظه
      const verses = JSON.parse(fs.readFileSync(path.join(result.dir, 'verses.json'), 'utf-8'));
      res.json(verses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
});

// تفسیر یک آیه خاص
app.get('/api/tafsir/:slug/:ayah', async (req, res) => {
  const { slug, ayah } = req.params;
  const file = path.join('output/tafsir-saadi', slug, 'verses.json');
  if (fs.existsSync(file)) {
    const verses = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const match = verses.find(v => v.ayah === Number(ayah));
    if (match) {
      res.json(match);
    } else {
      res.status(404).json({ error: 'Ayah not found' });
    }
  } else {
    try {
      const surahList = await fetchSurahList();
      const surah = surahList.find(s => s.slug === slug);
      if (!surah) return res.status(404).json({ error: 'Surah not found' });

      const result = await fetchSurahTafsir(surah);
      const verses = JSON.parse(fs.readFileSync(path.join(result.dir, 'verses.json'), 'utf-8'));
      const match = verses.find(v => v.ayah === Number(ayah));
      if (match) {
        res.json(match);
      } else {
        res.status(404).json({ error: 'Ayah not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
});

app.get('/api/debug/surahs', async (req, res) => {
  const list = await fetchSurahList();
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
