// services/fetchTafsirResources.js
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export async function fetchTafsirResources(token) {
  const url = 'https://apis.quran.foundation/content/api/v4/resources/tafsirs';
   const headers = {
    Authorization: `Bearer ${token}`,
    'x-auth-token': token,
    'x-client-id': process.env.CLIENT_ID,
    Accept: 'application/json',
  };

  try {
    log('🌐 Fetching tafsir resources...');
    const res = await axios.get(url, { headers });
    const tafsirs = res.data?.tafsirs || res.data || [];

    if (!tafsirs.length) {
      log('⚠️ No tafsirs returned.');
      return;
    }

    const outDir = path.join(process.cwd(), 'output/resources');
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, 'tafsirs.json');
    fs.writeFileSync(outFile, JSON.stringify(tafsirs, null, 2), 'utf-8');
    log(`💾 Saved all tafsirs list to ${outFile}`);

    const persian = tafsirs.filter(t => t.language_name?.toLowerCase() === 'persian');
    if (persian.length) {
      log('📖 Persian tafsirs found:');
      persian.forEach(t => {
        log(`   ID: ${t.id} | Author: ${t.author_name} | Name: ${t.name}`);
      });
    } else {
      log('⚠️ No Persian tafsirs found in list.');
    }
  } catch (err) {
    log('❌ Error fetching tafsir resources:', err.response?.data || err.message);
  }
}