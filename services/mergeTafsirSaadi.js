// services/mergeTafsirSaadi.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

/**
 * Merge Tafsir Saadi with combined_135.json files
 * @param {number|null} surahNumber - number of surah (1–114) or null for all
 */
export async function mergeTafsirSaadi(surahNumber = null) {
  const startTime = Date.now();
  const spinner = ora('شروع فرآیند ادغام تفسیر سعدی...').start();

  try {
    const chapters = surahNumber ? [surahNumber] : Array.from({ length: 114 }, (_, i) => i + 1);
    let processed = 0;

    for (const surah of chapters) {
      const file1Path = `output/chapters/uthmani/${surah}/combined_135.json`;
      const file2Path = `output/tafsir-saadi/${surah.toString().padStart(3, '0')}/verses.json`;
      const outputPath = `output/chapters/uthmani/${surah}/combined_with_tafsir.json`;

      spinner.text = `📖 در حال پردازش سوره ${surah}...`;

      // بررسی وجود فایل‌ها
      if (!fs.existsSync(file1Path) || !fs.existsSync(file2Path)) {
        console.log(chalk.yellow(`⚠️ سوره ${surah}: فایل(ها) یافت نشد، پرش...`));
        continue;
      }

      const data1 = JSON.parse(fs.readFileSync(file1Path, 'utf8'));
      const data2 = JSON.parse(fs.readFileSync(file2Path, 'utf8'));

      if (!data1.verses || !Array.isArray(data1.verses)) {
        console.log(chalk.red(`⚠️ ساختار اشتباه در سوره ${surah}`));
        continue;
      }

      // ادغام آیات
      const mergedVerses = data1.verses.map((verse) => {
        const tafsirMatch = data2.find((v) => v.verse_number === verse.verse_number);
        return tafsirMatch
          ? { ...verse, tafsir_saadi: tafsirMatch.tafsir }
          : verse;
      });

      const mergedData = { ...data1, verses: mergedVerses };

      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), 'utf8');

      processed++;
      const percent = ((processed / chapters.length) * 100).toFixed(1);
      console.log(
        chalk.green(
          `✅ سوره ${surah} ادغام شد (${processed}/${chapters.length} - ${percent}%)`
        )
      );
    }

    spinner.succeed(chalk.cyan(`تمام سوره‌ها با موفقیت ادغام شدند ✅`));
    console.log(chalk.magenta(`⏱ زمان کل: ${((Date.now() - startTime) / 1000).toFixed(2)} ثانیه`));

  } catch (err) {
    spinner.fail(chalk.red(`❌ خطا در ادغام تفسیر: ${err.message}`));
  }
}
