// services/fetchTafsirSaadi.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger.js';

const BASE = 'https://quranenc.com/api/v1/translation/sura/persian_saadi';

/**
 * Build and ensure output dir path
 */
function outDir(...segments) {
  const p = path.join(process.cwd(), 'output', 'tafsir-saadi', ...segments);
  fs.mkdirSync(p, { recursive: true });
  return p;
}

/**
 * Fetch tafsir for a surah by ID
 * Stores:
 *  - surah.json: { surahId, sourceUrl }
 *  - verses.json: [{ verse_number, arabic, tafsir }]
 */
export async function fetchSurahTafsir(surahId) {
  log(`🔎 Fetching tafsir for surah ${surahId}...`);
  const url = `${BASE}/${surahId}`;
  const res = await axios.get(url, { timeout: 30000 });
  const data = res.data;

  const verses = data.result.map(v => ({
    verse_number: Number(v.aya),
    arabic: v.arabic_text,
    tafsir: v.translation,
  }));

  // 👇 شماره سوره سه‌رقمی
  const dir = outDir(String(surahId).padStart(3, '0'));

  fs.writeFileSync(
    path.join(dir, 'surah.json'),
    JSON.stringify({ surahId, sourceUrl: url }, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(dir, 'verses.json'),
    JSON.stringify(verses, null, 2),
    'utf-8'
  );

  log(`💾 Saved surah ${surahId}: ${verses.length} verses`);
  return { dir, count: verses.length };
}

/**
 * Fetch tafsir for all surahs (1–114)
 */
export async function fetchTafsirSaadiAll() {
  for (let i = 1; i <= 114; i++) {
    try {
      await fetchSurahTafsir(i);
      await new Promise(r => setTimeout(r, 800)); // polite delay
    } catch (err) {
      log(`❌ Failed surah ${i}: ${err.message}`);
    }
  }
  log('✅ Tafsir Saadi tasks completed.');
}

/**
 * Optional: fetch a single surah by ID
 */
export async function fetchTafsirSaadiOne(id) {
  await fetchSurahTafsir(id);
  log('✅ Single surah fetched.');
}