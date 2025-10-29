// services/fetchReciterResources.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Fetch the full list of recitation resources and save them.
 * Logs reciter names, styles, and IDs for easy selection.
 */
export async function fetchReciterResources(token) {
  const url = 'https://apis.quran.foundation/content/api/v4/resources/recitations';
  const headers = {
    Authorization: `Bearer ${token}`,
    'x-auth-token': token,
    'x-client-id': process.env.CLIENT_ID,
    Accept: 'application/json',
  };

  try {
    log('🎧 Fetching reciter resources...');
    const res = await axios.get(url, { headers });
    const recitations = res.data?.recitations || res.data || [];

    if (!recitations.length) {
      log('⚠️ No recitations returned.');
      return;
    }

    const outDir = path.join(process.cwd(), 'output/resources');
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'recitations.json');

    fs.writeFileSync(outFile, JSON.stringify(recitations, null, 2), 'utf-8');
    log(`💾 Saved recitations list to ${outFile}`);

    log('📜 Reciters found:');
    for (const r of recitations) {
      const name = r.reciter?.name || r.reciter_name || 'Unknown';
      const style = r.style || 'unknown';
      log(`   ID: ${r.id} | Style: ${style} | Reciter: ${name}`);
    }
  } catch (err) {
    log('❌ Error fetching reciter resources:', err.response?.data || err.message);
  }
}