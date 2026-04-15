

# תוכנית: מסלול הרשמה חדש לרווק/רווקה — מקצה לקצה

## סיכום

עמוד Auth מעוצב מחדש בשפת האתר, עם הרשמה שכוללת: שם, מייל, סיסמה (נבחרת ע״י המשתמש), טלפון, ת.ז. (אופציונלי), תאריך לידה, מין. לאחר הגשה — ממתין לאישור, מקבל מייל אישור, יכול לגלוש אך לא להזמין. לאחר אישור אדמין — מייל אישור, כניסה ראשונה פותחת בניית פרופיל מורחבת.

## שלבים

### 1. עמוד Auth מעוצב מחדש (`src/pages/Auth.tsx`)
- עיצוב בצבעי האתר (olive, cream, terracotta)
- שני טאבים: **התחברות** (מייל+סיסמה) / **הצטרפות** (טופס מלא)
- טאב הצטרפות כולל בשלב אחד:
  - שם ומשפחה, מייל, סיסמה (בחירת המשתמש), טלפון
  - תאריך לידה (date picker), מין (זכר/נקבה)
  - העלאת ת.ז. (אופציונלי) עם הערה "לא חובה אבל יקל על תהליך האישור"
  - אישור תקנון
- כפתור כניסה עם Google (Lovable managed OAuth)
- לאחר הגשה: יצירת חשבון (`signUp`), העלאת ת.ז. ל-storage, שמירת profile ב-DB עם `registration_status: pending`
- הפניה לעמוד "ההרשמה נקלטה" + שליחת מייל אישור קליטה

### 2. הפעלת auto-confirm + Google Auth
- הפעלת auto-confirm למיילים (כי ממילא יש אישור ידני של אדמין)
- הגדרת Google OAuth דרך Lovable managed solution

### 3. עמוד "ממתין לאישור" (חלק מ-Profile.tsx — כבר קיים)
- כבר קיים עמוד pending ב-Profile.tsx
- הרחבה: הוספת הסבר על מרחב בטוח, זמן אישור ממוצע
- המשתמש יכול לגלוש באתר אבל לא להזמין

### 4. Route guards ב-Explore ו-MyBookings
- Explore: מציג תוכן לכולם, אך כפתור "שליחת בקשה" חסום ל-pending
- MyBookings: רק למשתמשים approved

### 5. הפניה חכמה אחרי התחברות
- ב-Auth.tsx: אחרי login, בדיקת סטטוס:
  - אין profile → `/register` (עדיין נשאיר למקרה שהמשתמש יצר חשבון ישן)
  - pending → `/profile` (מסך המתנה)
  - approved, אין detailed profile → `/profile` (בניית פרופיל)
  - approved עם profile → `/explore`

### 6. מייל אישור קליטה (חדש)
- תבנית `registration-received` — "ההרשמה שלך התקבלה, אנחנו בודקים"
- נשלח אוטומטית אחרי הגשת הטופס

### 7. בניית פרופיל מורחבת (עדכון `src/pages/Profile.tsx`)
- בכניסה ראשונה לאחר אישור, עמוד בניית פרופיל עם:
  - תמונת פרופיל + תמונת באנר (העלאה ל-storage bucket חדש)
  - אזור מגורים (בחירה: צפון, מרכז וכו')
  - עיר (אופציונלי)
  - פרטי ממליץ + הערה שהממליץ ייחשף רק למארחים שנשלחה אליהם בקשה
  - מספר טלפון + הערה שהמספר ייחשף רק למארחים שנשלחה אליהם בקשה

### 8. נאבבר מותאם
- הסתרת "הזמנות" ו"חיפוש" למשתמשים pending
- ברכה "שלום [שם]" (כבר קיים)

### 9. הסרת עמוד Register הישן
- כל הלוגיקה עוברת לעמוד Auth החדש
- Route `/register` מפנה ל-`/auth`

## שינויי DB
- **Storage bucket חדש** `profile-images` (public) לתמונות פרופיל ובאנר
- **עמודות חדשות ב-`single_profiles`**: `profile_image_url`, `banner_image_url`
- **עדכון `profiles`**: הסרת חובת ממליץ בהרשמה (עובר לפרופיל)
- **תבנית מייל חדשה**: `registration-received`

## קבצים שישתנו
- `src/pages/Auth.tsx` — שכתוב מלא
- `src/pages/Profile.tsx` — הרחבת בניית פרופיל
- `src/pages/Explore.tsx` — guard על הזמנות
- `src/pages/MyBookings.tsx` — guard
- `src/components/Navbar.tsx` — התאמה לסטטוס
- `src/App.tsx` — הסרת route של register
- `src/contexts/AuthContext.tsx` — ללא שינוי (כבר תומך)
- `supabase/functions/_shared/transactional-email-templates/` — תבנית חדשה
- Migration: storage bucket + עמודות חדשות

