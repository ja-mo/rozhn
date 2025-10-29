// services/fetchTranslationResources.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Fetch all available translation resources.
 * Saves them into output/resources/translations.json
 * and logs Persian ones to console.
 */
export async function fetchTranslationResources(token) {
  const url = 'https://apis.quran.foundation/content/api/v4/resources/translations';
  const headers = {
    Authorization: `Bearer ${token}`,
    'x-auth-token': token,
    'x-client-id': process.env.CLIENT_ID,
    Accept: 'application/json',
  };

  try {
    log('🌐 Fetching translation resources...');
    const res = await axios.get(url, { headers });
    const translations = res.data?.translations || res.data || [];

    if (!translations.length) {
      log('⚠️ No translations returned.');
      return;
    }

    // ذخیره در فایل
    const outDir = path.join(process.cwd(), 'output/resources');
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'translations.json');
    fs.writeFileSync(outFile, JSON.stringify(translations, null, 2), 'utf-8');
    log(`💾 Saved all translations list to ${outFile}`);

    // نمایش ترجمه‌های فارسی در لاگ
    const persian = translations.filter(t => t.language_name?.toLowerCase() === 'persian');
    if (persian.length) {
      log('📖 Persian translations found:');
      persian.forEach(t => {
        log(`   ID: ${t.id} | Author: ${t.author_name} | Name: ${t.translated_name?.name}`);
      });
    } else {
      log('⚠️ No Persian translations found in list.');
    }
  } catch (err) {
    log('❌ Error fetching translation resources:', err.response?.data || err.message);
  }
}