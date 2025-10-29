import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { log } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export async function fetchTranslations(token, translationId, script = 'uthmani', chapterId = null) {
  const baseUrl = 'https://apis.quran.foundation/content/api/v4';
  const headers = {
    Authorization: `Bearer ${token}`,
    'x-auth-token': token,
    'x-client-id': process.env.CLIENT_ID,
    Accept: 'application/json',
  };

  const fetchOne = async (id) => {
    const chapterDir = path.join(process.cwd(), `output/chapters/${script}/${id}`);
    fs.mkdirSync(chapterDir, { recursive: true });

    const metaRes = await axios.get(`${baseUrl}/chapters/${id}`, { headers }).catch(() => ({ data: {} }));
    const meta = metaRes.data?.chapter || {};
    const name = meta.name || meta.translated_name?.name || `Chapter_${id}`;

    const versesRes = await axios.get(`${baseUrl}/verses/by_chapter/${id}`, {
      headers,
      params: {
        translations: translationId,
        per_page: 100,
      },
    });

    const verses = versesRes.data?.verses || [];
    fs.writeFileSync(path.join(chapterDir, `translation_${translationId}.json`), JSON.stringify({ id, name, verses }, null, 2), 'utf-8');
    log(`💾 Saved translation ${translationId} for surah ${id} (${script})`);
  };

  if (chapterId) return fetchOne(chapterId);

  const chaptersRes = await axios.get(`${baseUrl}/chapters`, { headers });
  const chapters = chaptersRes.data?.chapters || [];
  for (const ch of chapters) await fetchOne(ch.id);
}