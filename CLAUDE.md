# NoMap Landing Page — הנחיות עבודה

## פרויקט
דף נחיתה ל-NoMap — אפליקציית טיולים לישראלים. Next.js 15 / TypeScript / RTL Hebrew.
Repo: https://github.com/Fly-Oz/no-map-lp
Production: https://nomap.flybiz.co.il

---

## כלל ראשון — סינק עם GitHub

**לפני כל עדכון** — תמיד לרוץ קודם:
```bash
git pull origin main
```

**בסוף כל עדכון** — commit + push:
```bash
git add .
git commit -m "תיאור קצר של השינוי"
git push origin main
```

Vercel מחובר לריפו ו-deploy מתבצע אוטומטית בכל push ל-main.

---

## סביבה

- **Framework**: Next.js 15, TypeScript, App Router
- **כיוון**: RTL עברית (`lang="he" dir="rtl"`)
- **עיצוב**: CSS גלובלי (`app/globals.css`), ללא Tailwind
- **Breakpoints**: mobile-first — `640px` / `820px` / `1060px`

## משתני סביבה (Vercel + .env.local)
```
AIRTABLE_API_KEY=pat0FeQoACULxjblZ...
AIRTABLE_BASE_ID=appjBEe1KYfshVgTm
```
`.env.local` לא עולה ל-GitHub (מוגדר ב-.gitignore).

---

## Airtable

- **Base ID**: `appjBEe1KYfshVgTm`
- **Pilot Applicants** (tblY3JZVTQs06iUSP) — רישום לפיילוט
- **Update Subscribers** (tbl3GwdXjn34QwIia) — עדכון בהשקה
- **Devices** (tbldvKsVlSYursY0t) — טבלת מכשירים עם שדה `Device Model`

ה-API route שולח ל-Airtable: `app/api/submit/route.ts`
הגשת טופס → `POST /api/submit`

### חיבור מכשיר
אלגוריתם `matchDevices()` ב-`route.ts` מתאים אפשרות מהטופס לרשומה ב-Devices ע"פ שם מודל.

---

## קבצים מרכזיים

| קובץ | תיאור |
|------|--------|
| `app/page.tsx` | דף ראשי — סדר הקומפוננטות |
| `app/globals.css` | כל העיצוב |
| `app/layout.tsx` | HTML wrapper, fonts |
| `app/api/submit/route.ts` | Airtable POST handler |
| `components/FormBlock.tsx` | טופס הרשמה (pilot + update) |
| `components/ValueBlock.tsx` | accordion "מה זה NoMap" — **observer מובנה בתוך הקומפוננטה** |
| `components/AnimationObserver.tsx` | scroll-in animations לـ `.how-step`, `.why-card` |
| `public/` | תמונות — שמות קבצים **חייבים להיות lowercase** (Vercel = Linux) |

---

## נקודות חשובות

### ValueBlock Accordion
ה-IntersectionObserver של אנימציית הכניסה מוגדר **בתוך `ValueBlock.tsx`** ולא ב-`AnimationObserver`.
הסיבה: React מחליף את כל `className` בכל render — אם observer חיצוני מוסיף `in-view` ישירות ל-DOM, הוא נמחק. הפתרון: `in-view` מנוהל כ-React state בתוך הקומפוננטה.

### קבצים ב-public
שמות קבצים חייבים להיות lowercase (`.png` לא `.PNG`) — Vercel רץ על Linux.

### em-dashes
השתמשי ב-`-` ולא ב-`—` בטקסטים העבריים.
