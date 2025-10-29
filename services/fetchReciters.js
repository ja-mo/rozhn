// services/fetchReciters.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export async function fetchReciters(token) {
  const url = 'https://apis.quran.foundation/content/api/v4/resources/recitations';
  const headers = {
    Authorization: `Bearer ${token}`,
    'x-auth-token': token,
    'x-client-id': process.env.CLIENT_ID,
    Accept: 'application/json',
  };

  try {
    log('🎧 Fetching recitations (reciters)...');
    const res = await axios.get(url, { headers });
    const recitations = res.data?.recitations || res.data || [];

    if (!recitations.length) {
      log('⚠️ No recitations returned.');
      return;
    }

    const recitersDir = path.join(process.cwd(), 'output/reciters');
    fs.mkdirSync(recitersDir, { recursive: true });

    for (const r of recitations) {
      const style = r.style || 'unknown';
      const styleDir = path.join(recitersDir, style);
      fs.mkdirSync(styleDir, { recursive: true });

      const reciterName = r.reciter?.name || r.reciter_name || 'Unknown';
      const translatedName = r.reciter?.translated_name?.name || r.translated_name?.name || '';
      const slug = String(reciterName).replace(/[^\w]+/g, '_');

      const data = {
        id: r.id,
        style: r.style,
        reciterName,
        translatedName,
      };

      fs.writeFileSync(
        path.join(styleDir, `${r.id}_${slug}.json`),
        JSON.stringify(data, null, 2),
        'utf-8'
      );

      log(`💾 Saved reciter: ${reciterName} (style: ${style})`);
    }
  } catch (err) {
    log('❌ Error fetching reciters:', err.response?.data || err.message);
  }
}