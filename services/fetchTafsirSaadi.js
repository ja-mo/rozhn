// services/fetchTafsirSaadi.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger.js';

const BASE = 'https://saadi.islamenc.com/fa/browse/tafsir/saadi';

/**
 * Build and ensure output dir path
 */
function outDir(...segments) {
  const p = path.join(process.cwd(), 'output', 'tafsir-saadi', ...segments);
  fs.mkdirSync(p, { recursive: true });
  return p;
}

/**
 * Fetch HTML with reasonable headers
 */
async function fetchHtml(url) {
  const res = await axios.get(url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'Mozilla/5.0 (Rozhn/1.0; +https://quran.foundation)',
    },
    timeout: 30000,
  });
  return res.data;
}

/**
 * Extract list of surah links from the index page
 * Returns [{ name, url, slug }]
 */
export async function fetchSurahList() {
  log('📜 Fetching Saadi index...');
  const html = await fetchHtml(BASE);
  const $ = cheerio.load(html);

  const items = [];
  $('div.collapse-item a').each((_, el) => {
    const href = $(el).attr('href');
    const name = $(el).text().trim();
    if (href && name) {
      const url = href.startsWith('http') ? href : new URL(href, BASE).href;
      const slug = name
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .toLowerCase();
      items.push({ name, url, slug });
    }
  });

  fs.writeFileSync(
    path.join(outDir(), 'index.json'),
    JSON.stringify(items, null, 2),
    'utf-8'
  );
  log(`💾 Saved surah list (${items.length}) to output/tafsir-saadi/index.json`);
  return items;
}




/**
 * Extract per-surah tafsir from its page
 * Stores:
 *  - surah.json: { name, sourceUrl, sections }
 *  - verses.json: [{ ayah, text, html? }]
 */




export async function fetchSurahTafsir(surah) {
  log(`🔎 Fetching tafsir: ${surah.name}`);
  const html = await fetchHtml(surah.url);
  const $ = cheerio.load(html);

  const verses = [];

  // هر آیه با یک anchor مشخص می‌شود
  $('a.aya-anchor[id]').each((_, el) => {
    const anchor = $(el);
    const idAttr = anchor.attr('id'); // مثل aya-1
    const ayah = Number((idAttr.match(/\d+/) || [])[0]) || null;

    // بلاک والد (div با margin-bottom) را پیدا کن
    const parentBlock = anchor.closest('div[style*="margin-bottom"]');

    // متن فارسی: همه‌ی span و متن‌هایی که بعد از div._ar هستند
    let tafsirText = '';
    parentBlock.contents().each((__, child) => {
      const c = $(child);
      // بلاک عربی را رد کن
      if (c.hasClass('_ar')) return;
      // متن فارسی را جمع کن
      const text = c.text().trim();
      if (text) tafsirText += text + '\n';
    });

    tafsirText = tafsirText.trim();
    if (tafsirText) {
      verses.push({ ayah, text: tafsirText });
    }
  });

  const dir = outDir(`${surah.slug}`);
  fs.writeFileSync(
    path.join(dir, 'surah.json'),
    JSON.stringify({ name: surah.name, sourceUrl: surah.url }, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(dir, 'verses.json'),
    JSON.stringify(verses, null, 2),
    'utf-8'
  );
  log(`💾 Saved ${surah.name}: ${verses.length} verses`);
  return { dir, count: verses.length };
}




/**
 * Main entry: fetch all surahs and their tafsir
 */
export async function fetchTafsirSaadiAll() {
  const surahs = await fetchSurahList();
  for (const surah of surahs) {
    try {
      await fetchSurahTafsir(surah);
      // polite delay
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      log(`❌ Failed ${surah.name}: ${err.message}`);
    }
  }
  log('✅ Tafsir Saadi tasks completed.');
}

/**
 * Optional: fetch a single surah by name or slug (exact match)
 */
export async function fetchTafsirSaadiOne(match) {
  const surahs = await fetchSurahList();
  const target =
    surahs.find(s => s.slug === match) ||
    surahs.find(s => s.name.trim() === match);
  if (!target) {
    log(`⚠️ Surah not found for: ${match}`);
    return;
  }
  await fetchSurahTafsir(target);
  log('✅ Single surah fetched.');
}