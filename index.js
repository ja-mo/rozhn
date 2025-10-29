// index.js
import { getAccessToken } from './services/auth.js';
import { fetchChapters } from './services/fetchChapters.js';
import { fetchTranslations } from './services/fetchTranslations.js';
import { fetchCombined } from './services/fetchCombined.js';
import { fetchReciters } from './services/fetchReciters.js';
import { fetchTranslationResources } from './services/fetchTranslationResources.js';
import { fetchReciterResources } from './services/fetchReciterResources.js';
import { fetchTafsirSaadiAll, fetchTafsirSaadiOne } from './services/fetchTafsirSaadi.js';
import { log } from './utils/logger.js';

const args = process.argv.slice(2);
const command = args[0];

(async () => {
  try {
    // 👇 اگر دستور تفسیر سعدی بود، بدون توکن اجرا کن
    if (command === 'fetchtafsirsaadi') {
      const match = args[1];
      if (match) {
        await fetchTafsirSaadiOne(match);
      } else {
        await fetchTafsirSaadiAll();
      }
      return;
    }

    const token = await getAccessToken();

    switch (command) {
      // Arabic text for specific chapter or all
      case 'fetchchapter': {
        const chapterId = Number(args[1]) || null;
        const script = args[2] || 'uthmani';
        if (chapterId) {
          await fetchChapters(token, script, chapterId);
        } else {
          await fetchChapters(token, script);
        }
        break;
      }

      // Translation using translationId for specific chapter or all
      case 'fetchtranslation': {
        const chapterId = Number(args[1]) || null;
        const translationId = Number(args[2]);
        const script = args[3] || 'uthmani';
        if (!translationId) return log('⚠️ Use: node index.js fetchtranslation <chapterId|all> <translationId> [script]');
        await fetchTranslations(token, translationId, script, chapterId || null);
        break;
      }

      // Combined Arabic+translation using translationId
      case 'fetchcombined': {
        const chapterId = Number(args[1]) || null;
        const translationId = Number(args[2]);
        const script = args[3] || 'uthmani';
        if (!translationId) return log('⚠️ Use: node index.js fetchcombined <chapterId|all> <translationId> [script]');
        await fetchCombined(token, translationId, script, chapterId || null);
        break;
      }

      // Reciter resources listing (IDs, styles, names)
      case 'fetchreciterresources':
        await fetchReciterResources(token);
        break;

      // Save reciters into per-style folders
      case 'fetchreciters':
        await fetchReciters(token);
        break;

      // Translation resources listing (IDs, languages, authors)
      case 'fetchtranslationresources':
        await fetchTranslationResources(token);
        break;

      default:
    log('⚡ Running ALL tasks (default mode)...');

    // متن عربی (عثمانی و املایی)
    await fetchChapters(token, 'uthmani');
    await fetchChapters(token, 'imlaei');

    // ترجمه‌ها (مثال: فارسی 135 و انگلیسی 131)
    await fetchTranslations(token, 135, 'uthmani');

    // فایل‌های ترکیبی
    await fetchCombined(token, 135, 'uthmani');

    // لیست منابع ترجمه و قاریان
    await fetchTranslationResources(token);
    await fetchReciterResources(token);

    // ذخیره قاریان
    await fetchReciters(token);

    }

    log('✅ Task(s) completed.');
  } catch (err) {
    log('❌ Error in index.js:', err.message);
  }
})();