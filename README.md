# 🌙 Rozhn (روژن لَکیر)

**پروژه Node.js برای دانلود و ذخیره‌سازی متن قرآن کریم، ترجمه‌ها و صوت‌های قاریان از Quran Foundation API**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![API](https://img.shields.io/badge/API-Quran%20Foundation-orange.svg)](https://apis.quran.foundation)

---

## 📖 معرفی

**Rozhn** (به معنای "روشنایی" در زبان بلوچی) یک ابزار خط فرمان (CLI) قدرتمند برای:

- 📥 **دانلود متن عربی قرآن** در دو خط `uthmani` و `imlaei`
- 🌍 **دانلود ترجمه‌ها** به زبان‌های مختلف (فارسی، بلوچی، انگلیسی و...)
- 🎙️ **دانلود اطلاعات قاریان** با دسته‌بندی بر اساس سبک تلاوت
- 🔐 **احراز هویت OAuth2** با Quran Foundation API
- 💾 **ذخیره‌سازی ساختارمند** در فایل‌های JSON
- ⚡ **سرعت بالا** و عملکرد بهینه

---

## 🚀 ویژگی‌ها

### ✅ قابلیت‌های اصلی

| ویژگی | توضیحات |
|-------|---------|
| 🔐 **OAuth2 Authentication** | احراز هویت خودکار با Client Credentials Flow |
| 📚 **دانلود تمام 114 سوره** | دریافت متن کامل قرآن با یک دستور |
| 🌐 **پشتیبانی از ترجمه‌ها** | دانلود ترجمه‌های متعدد به زبان‌های مختلف |
| 🎵 **اطلاعات قاریان** | لیست کامل قاریان با سبک‌های Murattal، Mujawwad، Muallim |
| 📂 **ساختار منظم** | فایل‌ها به صورت سازمان‌یافته در پوشه‌های جداگانه |
| 🔄 **دانلود انتخابی** | دانلود یک سوره خاص یا تمام سوره‌ها |
| 📊 **لاگ‌گذاری حرفه‌ای** | نمایش پیشرفت و خطاها با ایموجی‌های رنگی |

---

## 📦 نصب و راه‌اندازی

### پیش‌نیازها

- **Node.js** نسخه 16 یا بالاتر
- **npm** یا **yarn**
- **Client ID** و **Client Secret** از Quran Foundation

### 1️⃣ دریافت کد

```bash
git clone https://github.com/yourusername/rozhn.git
cd rozhn
```

### 2️⃣ نصب وابستگی‌ها

```bash
npm install
```

### 3️⃣ تنظیم متغیرهای محیطی

فایل `.env` در ریشه پروژه ایجاد کنید:

```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
```

> **📌 نکته:** برای دریافت Client ID و Secret به [Quran Foundation Developer Portal](https://quran.foundation) مراجعه کنید.

---

## 🎯 نحوه استفاده

### دستورات اصلی

#### 1. دانلود متن عربی سوره‌ها

```bash
# دانلود یک سوره خاص (مثلاً سوره یاسین - شماره 36)
node index.js fetchchapter 36

# دانلود یک سوره با خط imlaei
node index.js fetchchapter 36 imlaei

# دانلود تمام 114 سوره
node index.js fetchchapter
```

**خروجی:**
```
output/chapters/uthmani/36/chapter.json
output/chapters/uthmani/chapters_list.json
```

---

#### 2. دانلود ترجمه‌ها

```bash
# دانلود ترجمه سوره یاسین به فارسی (Translation ID: 135)
node index.js fetchtranslation 36 135

# دانلود ترجمه تمام سوره‌ها به بلوچی (Translation ID: 124)
node index.js fetchtranslation all 124

# دانلود با خط imlaei
node index.js fetchtranslation 36 135 imlaei
```

**خروجی:**
```
output/chapters/uthmani/36/translation_135.json
```

---

#### 3. دانلود متن + ترجمه (Combined)

```bash
# دانلود سوره یاسین با ترجمه فارسی در یک فایل
node index.js fetchcombined 36 135

# دانلود تمام سوره‌ها با ترجمه
node index.js fetchcombined all 135
```

**ساختار خروجی:**
```json
{
  "chapter": {
    "id": 36,
    "name": "يس",
    "verses_count": 83,
    "revelation_place": "makkah"
  },
  "verses": [
    {
      "verse_number": 1,
      "verse_key": "36:1",
      "text_uthmani": "يسٓ",
      "translation": "یاسین"
    }
  ]
}
```

---

#### 4. دریافت لیست ترجمه‌ها

```bash
node index.js fetchtranslationresources
```

**خروجی:**
```
output/resources/translations.json
```

**مثال:**
```json
{
  "translations": [
    {
      "id": 135,
      "name": "Fooladvand Persian Translation",
      "author_name": "محمدمهدی فولادوند",
      "language_name": "persian"
    },
    {
      "id": 124,
      "name": "Balochi Translation",
      "author_name": "مولوی محمد پناه",
      "language_name": "balochi"
    }
  ]
}
```

---

#### 5. دریافت لیست قاریان

```bash
# لیست تمام قاریان با دسته‌بندی سبک
node index.js fetchreciterresources
```

**خروجی:**
```
output/resources/reciters.json
```

---

#### 6. دانلود فایل‌های صوتی قاریان

```bash
node index.js fetchreciters
```

**ساختار خروجی:**
```
output/reciters/
├── Murattal/          # ترتیل (آهسته و آرام)
│   ├── reciter_1.json
│   └── reciter_2.json
├── Mujawwad/          # تجوید (با آواز و تحریر)
│   └── reciter_3.json
└── Muallim/           # آموزشی
    └── reciter_4.json
```

---

## 📂 ساختار پروژه

```
rozhn/
├── index.js                    # نقطه ورود اصلی
├── package.json                # وابستگی‌ها و تنظیمات
├── .env                        # متغیرهای محیطی (CLIENT_ID, CLIENT_SECRET)
├── README.md                   # مستندات
│
├── services/                   # ماژول‌های سرویس
│   ├── auth.js                 # احراز هویت OAuth2
│   ├── fetchChapters.js        # دانلود متن سوره‌ها
│   ├── fetchTranslations.js   # دانلود ترجمه‌ها
│   ├── fetchCombined.js        # دانلود متن + ترجمه
│   ├── fetchReciters.js        # دانلود اطلاعات قاریان
│   ├── fetchReciterResources.js      # لیست قاریان
│   └── fetchTranslationResources.js  # لیست ترجمه‌ها
│
├── utils/                      # ابزارهای کمکی
│   └── logger.js               # لاگ‌گذاری
│
└── output/                     # فایل‌های خروجی
    ├── chapters/               # متن و ترجمه سوره‌ها
    │   ├── uthmani/           # خط عثمانی
    │   │   ├── 1/
    │   │   ├── 2/
    │   │   └── ...
    │   └── imlaei/            # خط املایی
    │       ├── 1/
    │       └── ...
    ├── reciters/               # اطلاعات قاریان
    │   ├── Murattal/
    │   ├── Mujawwad/
    │   └── Muallim/
    └── resources/              # منابع و لیست‌ها
        ├── translations.json
        └── reciters.json
```

---

## 🔐 احراز هویت OAuth2

این پروژه از **OAuth2 Client Credentials Flow** استفاده می‌کند:

1. **دریافت Access Token:**
   - URL: `https://oauth2.quran.foundation/oauth2/token`
   - Method: `POST`
   - Header: `Authorization: Basic {base64(CLIENT_ID:CLIENT_SECRET)}`
   - Body: `grant_type=client_credentials&scope=content`

2. **استفاده از Token:**
   - تمام درخواست‌ها با header زیر ارسال می‌شوند:
   ```
   x-auth-token: {access_token}
   x-client-id: {CLIENT_ID}
   ```

---

## 📊 ID های مهم

### ترجمه‌های فارسی

| ID  | نام مترجم | سبک |
|-----|----------|-----|
| 135 | محمدمهدی فولادوند | لفظی دقیق |
| 131 | ناصر مکارم شیرازی | تفسیری |

### ترجمه‌های بلوچی

| ID  | نام مترجم | زبان |
|-----|----------|------|
| 124 | مولوی محمد پناه | بلوچی |
| 125 | مترجم دیگر | بلوچی |

### قاریان معروف

| Style | نمونه قاری |
|-------|-----------|
| Murattal | عبدالباسط عبدالصمد، محمود خلیل الحصری |
| Mujawwad | مشاری العفاسی، سعد الغامدی |
| Muallim | قاریان آموزشی برای کودکان |

> **💡 نکته:** برای دیدن لیست کامل دستور `fetchtranslationresources` یا `fetchreciterresources` را اجرا کنید.

---

## 🛠️ توسعه و مشارکت

### اضافه کردن ویژگی جدید

1. فایل سرویس جدید در `services/` ایجاد کنید
2. تابع اصلی را export کنید
3. در `index.js` به switch case اضافه کنید

**مثال:**

```javascript
// services/fetchNewFeature.js
export async function fetchNewFeature(token) {
  // Implementation
}

// index.js
case 'newfeat':
  await fetchNewFeature(token);
  break;
```

### اجرای تست‌ها

```bash
# تست احراز هویت
node index.js fetchtranslationresources

# تست دانلود
node index.js fetchchapter 1
```

---

## ⚠️ نکات مهم

### محدودیت‌های API

- **Rate Limiting:** حداکثر 100 درخواست در دقیقه
- **Token Expiry:** توکن‌ها بعد از 1 ساعت منقضی می‌شوند
- **Retry Logic:** در صورت خطا، 3 بار تلاش مجدد انجام می‌شود

### بهترین شیوه‌ها

1. ✅ همیشه فایل `.env` را به `.gitignore` اضافه کنید
2. ✅ قبل از دانلود تمام سوره‌ها، یک سوره تست کنید
3. ✅ برای دانلودهای بزرگ از شب استفاده کنید (کمترین بار API)
4. ✅ فایل‌های خروجی را به صورت دوره‌ای Backup بگیرید

---

## 🐛 رفع مشکلات رایج

### خطا: "Failed to get access token"

**راهکار:**
```bash
# بررسی کنید CLIENT_ID و CLIENT_SECRET درست است
cat .env

# اطمینان حاصل کنید فایل .env در ریشه پروژه است
ls -la | grep .env
```

### خطا: "401 Unauthorized"

**راهکار:**
- Client ID یا Secret اشتباه است
- به [Developer Portal](https://quran.foundation) مراجعه کنید و credentials جدید دریافت کنید

### خطا: "ECONNREFUSED"

**راهکار:**
- اتصال اینترنت را بررسی کنید
- فایروال یا VPN ممکن است API را بلاک کرده باشد

---

## 📚 منابع مفید

- 🌐 [Quran Foundation API Documentation](https://apis.quran.foundation/docs)
- 📖 [OAuth2 Client Credentials Guide](https://oauth.net/2/grant-types/client-credentials/)
- 💬 [GitHub Issues](https://github.com/yourusername/rozhn/issues)

---

## 📝 لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده است. برای جزئیات بیشتر فایل [LICENSE](LICENSE) را مطالعه کنید.

---

## 👨‍💻 نویسنده

**Mohammad Jamalzadeh**
- 📧 Email: your.email@example.com
- 🔗 GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 تشکر و قدردانی

- از **Quran Foundation** برای ارائه API رایگان و کامل
- از جامعه متن‌باز Node.js برای ابزارهای فوق‌العاده

---

## 🌟 ستاره دادن

اگر این پروژه برایتان مفید بود، لطفاً یک ⭐ ستاره در GitHub بدهید!

```bash
# دانلود آخرین نسخه
git pull origin main

# اجرای سریع
npm start
```

---

**ساخته شده با ❤️ برای جامعه مسلمانان جهان** 🌙
