import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <DynamicBackground variant="vineyard" />
      <Navbar />
      <div className="container mx-auto px-6 py-16 max-w-3xl" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
              <ScrollText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-black font-display">תקנון, תנאי שימוש ומדיניות פרטיות</h1>
            <p className="mt-2 text-muted-foreground">עודכן לאחרונה: אפריל 2026</p>
          </div>

          <div className="space-y-8 rounded-2xl border border-border bg-card p-8 shadow-card text-right leading-relaxed">
            <section>
              <h2 className="text-lg font-bold font-display mb-3">1. כללי</h2>
              <p className="text-muted-foreground text-sm leading-[1.85]">
                פל״א (״פשוט לבחור איפה״) היא פלטפורמה המחברת בין רווקים ורווקות לבין מארחים, מעסיקים ומציעי התנדבות לשבתות וחגים.
                השימוש בפלטפורמה מותנה בקבלת תנאי תקנון זה במלואם.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">2. הרשמה וזיהוי</h2>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>כל משתמש/ת מתחייב/ת למסור פרטים אמיתיים ומדויקים בעת ההרשמה.</li>
                <li>יש לספק פרטי ממליץ/ה תקינים ונגישים לבדיקה.</li>
                <li>העלאת מסמך מזהה (תעודת זהות / רישיון נהיגה) אינה חובה, אך מסייעת לזירוז תהליך האישור.</li>
                <li>צוות פל״א רשאי לדחות או לבטל הרשמה ללא מתן נימוק.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">3. כללי התנהגות</h2>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>יש להתנהג בכבוד, סבלנות ואדיבות כלפי כל המשתמשים — מארחים ומתארחים כאחד.</li>
                <li>אין להפלות על רקע מגדר, עדה, מוצא, גיל או השקפה.</li>
                <li>אין לעשות שימוש בפלטפורמה למטרות שידוך, פרסום או מכירה.</li>
                <li>יש לשמור על פרטיות המשתמשים — אין לשתף מידע אישי של אחרים ללא אישורם.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">4. מתארחים</h2>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>יש לאשר או לדחות בקשות אירוח תוך זמן סביר.</li>
                <li>ביטול ברגע האחרון ללא סיבה מוצדקת עלול להוביל להגבלת החשבון.</li>
                <li>יש לכבד את כללי הבית של המארח/ת ולהתנהג בהתאם.</li>
                <li>אין להגיע עם אורחים נוספים ללא תיאום מראש.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">5. מארחים</h2>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>יש לספק תיאור מדויק של תנאי האירוח.</li>
                <li>אין לדרוש תשלום או שירות כתנאי לאירוח (למעט קטגוריית עבודה).</li>
                <li>יש ליידע את המתארח/ת מראש על כללי הבית ומנהגים.</li>
                <li>ביטול אירוח לאחר אישור ללא סיבה מוצדקת עלול להוביל להגבלת החשבון.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">6. דירוגים ומשוב</h2>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>לאחר כל אירוח, שני הצדדים מוזמנים לדרג את החוויה.</li>
                <li>דירוגים נועדו לשמור על רמה גבוהה ולסנן משתמשים שאינם עומדים בתקנון.</li>
                <li>דירוג נמוך באופן חוזר עלול להוביל לבדיקה ואף להשעיית החשבון.</li>
                <li>אין לכתוב תגובות פוגעניות, מעליבות או לא ענייניות.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">7. עבודה והתנדבות</h2>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>מעסיקים מתחייבים לתנאי עבודה הוגנים ובטוחים.</li>
                <li>תנאי התשלום (אם ישנם) יוגדרו מראש ובצורה ברורה.</li>
                <li>מציעי התנדבות מתחייבים לסביבה בטוחה ומכבדת למתנדבים.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">8. הפרת תקנון</h2>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>הפרת התקנון עלולה להוביל לאזהרה, השעיה זמנית או הרחקה לצמיתות.</li>
                <li>צוות פל״א רשאי לנקוט פעולה לפי שיקול דעתו לשמירה על בטיחות הקהילה.</li>
                <li>ניתן לדווח על הפרות דרך יצירת קשר באתר.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">9. פרטיות ומידע</h2>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>פרטים אישיים ישמשו אך ורק לצורך הפעלת הפלטפורמה ולא יועברו לצדדים שלישיים.</li>
                <li>מסמכי זיהוי נשמרים בצורה מוצפנת ומאובטחת.</li>
                <li>ניתן לבקש מחיקת המידע בכל עת דרך פנייה לצוות.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">10. תנאי שימוש</h2>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>השימוש בפלטפורמת פל״א מותר לבני 18 ומעלה בלבד.</li>
                <li>המשתמש/ת מתחייב/ת להשתמש בפלטפורמה אך ורק למטרות שלשמן נועדה — חיבור בין רווקים/ות למארחים, מעסיקים ומציעי התנדבות לשבתות וחגים.</li>
                <li>אסור להשתמש בפלטפורמה לצורך איסוף מידע על משתמשים אחרים, שליחת ספאם, פרסום, או כל פעילות מסחרית שלא אושרה מראש על ידי צוות פל״א.</li>
                <li>אין להעלות תוכן פוגעני, גזעני, מיני, אלים או כל תוכן הסותר את החוק במדינת ישראל.</li>
                <li>אין לבצע ניסיונות פריצה, הנדסה לאחור, גרידת מידע (scraping) או שיבוש פעילות הפלטפורמה.</li>
                <li>כל הזכויות בתוכן הפלטפורמה — עיצוב, קוד, לוגו וטקסטים — שמורות לפל״א. אין להעתיק, לשכפל או לעשות בהם שימוש ללא אישור בכתב.</li>
                <li>השירות ניתן כפי שהוא ("AS IS"). פל״א אינה אחראית לנזק ישיר או עקיף שייגרם כתוצאה משימוש בפלטפורמה או ממפגשים שנוצרו דרכה.</li>
                <li>פל״א רשאית להפסיק את השירות, לשנות את תכונותיו או לעדכן את התקנון בכל עת, על פי שיקול דעתה.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">11. מדיניות פרטיות</h2>
              <p className="text-muted-foreground text-sm leading-[1.85] mb-3">
                פל״א מחויבת להגנה על פרטיותך. סעיף זה מפרט אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם וכיצד אנו מגנים עליהם.
              </p>

              <h3 className="text-base font-semibold mb-2 mt-4">11.1 איזה מידע אנו אוספים</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>פרטים אישיים שמסרת בעת ההרשמה: שם מלא, גיל, מגדר, מצב משפחתי, טלפון, אימייל, עיר מגורים.</li>
                <li>פרטי ממליץ/ה ומסמכי זיהוי (אם הועלו).</li>
                <li>תמונות פרופיל ותיאור עצמי.</li>
                <li>היסטוריית בקשות אירוח, אישורים, ביטולים ודירוגים.</li>
                <li>נתוני שימוש טכניים: כתובת IP, סוג דפדפן, מערכת הפעלה, תאריכי כניסה ופעולות שבוצעו.</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 mt-4">11.2 כיצד אנו משתמשים במידע</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>הצגת פרופילים רלוונטיים בין מארחים למתארחים.</li>
                <li>אימות זהות ובדיקת התאמה לתקנון.</li>
                <li>שליחת התראות, אישורים ועדכונים תפעוליים באימייל ובאמצעים נוספים.</li>
                <li>שיפור הפלטפורמה, ניתוח שימוש וזיהוי תקלות.</li>
                <li>מניעת הונאות, התנהגות פוגענית והפרת תקנון.</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 mt-4">11.3 שיתוף מידע עם צדדים שלישיים</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>פרטים אישיים לא יימכרו ולא יועברו לצדדים שלישיים למטרות שיווק.</li>
                <li>פרטי קשר של מארח/ת ומתארח/ת ייחשפו זה לזה אך ורק לאחר אישור בקשת אירוח על ידי שני הצדדים.</li>
                <li>אנו עושים שימוש בספקי שירות מקצועיים (אחסון בענן, שירותי דוא״ל, אנליטיקה) הכפופים להתחייבויות סודיות ואבטחת מידע.</li>
                <li>מידע עשוי להימסר לרשויות מוסמכות מכוח חוק או צו שיפוטי בלבד.</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 mt-4">11.4 אבטחת מידע</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>הנתונים נשמרים בשרתים מאובטחים עם הצפנה בתקשורת (HTTPS) ובמאגר הנתונים.</li>
                <li>סיסמאות נשמרות בצורה מוצפנת (hashed) ואינן ניתנות לשחזור.</li>
                <li>הגישה למידע מוגבלת לחברי צוות פל״א המורשים לכך בלבד, לצרכי תפעול ותמיכה.</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 mt-4">11.5 עוגיות (Cookies)</h3>
              <p className="text-muted-foreground text-sm leading-[1.85]">
                אנו משתמשים בעוגיות לצורך שמירת מצב התחברות, העדפות שימוש וניתוח סטטיסטי של הפעילות באתר.
                ניתן לחסום עוגיות דרך הגדרות הדפדפן, אך הדבר עלול לפגוע בפעילות התקינה של הפלטפורמה.
              </p>

              <h3 className="text-base font-semibold mb-2 mt-4">11.6 הזכויות שלך</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>זכות עיון: ניתן לבקש לראות אילו נתונים נשמרו עליך.</li>
                <li>זכות תיקון: ניתן לעדכן או לתקן מידע שגוי דרך עמוד הפרופיל או בפנייה לצוות.</li>
                <li>זכות מחיקה: ניתן לבקש מחיקת חשבון ומידע אישי בכל עת. מידע מסוים עשוי להישמר לצרכים חוקיים או תפעוליים.</li>
                <li>זכות הסרה מרשימות תפוצה: ניתן להסיר מנוי מאימיילים שיווקיים בקישור שבתחתית כל הודעה.</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 mt-4">11.7 יצירת קשר בנושאי פרטיות</h3>
              <p className="text-muted-foreground text-sm leading-[1.85]">
                לשאלות, בקשות או תלונות בנושא פרטיות ניתן לפנות אלינו דרך טופס "צור קשר" באתר.
                נשתדל להגיב בתוך 14 ימי עסקים.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">12. מניעת זיוף זהויות והגנה על המשתמשים</h2>
              <p className="text-muted-foreground text-sm leading-[1.85] mb-3">
                פל״א מקפידה על אמיתות הפרופילים בפלטפורמה ומפעילה מנגנונים למניעת זיוף זהויות, כדי להגן על כלל חברי הקהילה.
              </p>

              <h3 className="text-base font-semibold mb-2 mt-4">12.1 אימות זהות</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>כל הרשמה עוברת תהליך אישור ידני על ידי צוות פל״א לפני הפעלת החשבון.</li>
                <li>המשתמש/ת נדרש/ת לספק שם מלא, מספר טלפון, כתובת אימייל ופרטי ממליץ/ה.</li>
                <li>העלאת מסמך מזהה (תעודת זהות / רישיון נהיגה) מסייעת לזירוז האישור ולחיזוק אמינות הפרופיל.</li>
                <li>צוות פל״א רשאי לדרוש אימות נוסף (שיחת טלפון, מסמכים תומכים) ככל שיידרש.</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 mt-4">12.2 איסור התחזות וזיוף</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>חל איסור מוחלט להירשם תחת שם בדוי, להשתמש בתמונת פרופיל שאינה של המשתמש/ת, או להציג פרטים כוזבים.</li>
                <li>חל איסור ליצור יותר מחשבון אחד לאותו אדם ללא אישור מראש.</li>
                <li>חל איסור להתחזות למארח/ת, לארגון, לעסק או לכל גורם אחר שלא הסמיך לכך.</li>
                <li>הפרת סעיף זה תגרור חסימה מיידית של החשבון ומחיקתו, ללא התראה מוקדמת.</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 mt-4">12.3 דיווח על חשד לזיוף</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>כל משתמש/ת מוזמן/ת ומעודד/ת לדווח על פרופילים חשודים באמצעות טופס "צור קשר" או פנייה ישירה לצוות.</li>
                <li>צוות פל״א מתחייב לבדוק כל דיווח בתוך 48 שעות ולנקוט צעדים מתאימים, כולל השעיה או חסימה של חשבונות.</li>
                <li>זהות המדווח/ת תישמר חסויה.</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 mt-4">12.4 מנגנוני הגנה טכנולוגיים</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>פרטי קשר בין מארח/ת למתארח/ת נחשפים רק לאחר אישור בקשת אירוח — לא לפני כן.</li>
                <li>מסמכי זיהוי נשמרים באחסון מאובטח ומוצפן, ואינם נגישים למשתמשים אחרים.</li>
                <li>הפלטפורמה מנטרת דפוסי פעילות חריגים (מספר בקשות גבוה, שינויים תכופים בפרטים) ומתריעה לצוות הניהול.</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 mt-4">12.5 אחריות משפטית</h3>
              <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside">
                <li>התחזות וזיוף זהות מהווים עבירה פלילית בהתאם לחוק העונשין, התשל״ז-1977, ולחוק המחשבים, התשנ״ה-1995.</li>
                <li>פל״א שומרת לעצמה את הזכות לפנות לרשויות אכיפת החוק בכל מקרה של חשד סביר לזיוף זהות.</li>
                <li>משתמש/ת שזייף/ה זהות עלול/ה לשאת באחריות אזרחית כלפי משתמשים שנפגעו, בנוסף לאחריות פלילית.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold font-display mb-3">13. דין וסמכות שיפוט</h2>
              <p className="text-muted-foreground text-sm leading-[1.85]">
                על תקנון זה ועל כל הקשור לשימוש בפלטפורמת פל״א יחולו דיני מדינת ישראל בלבד.
                סמכות השיפוט הבלעדית בכל מחלוקת מסורה לבתי המשפט המוסמכים במחוז תל אביב–יפו.
              </p>
            </section>

            <section className="rounded-xl bg-accent/60 p-5">
              <p className="text-sm font-medium text-foreground text-center">
                בהרשמה לפל״א, אני מאשר/ת שקראתי את התקנון, תנאי השימוש ומדיניות הפרטיות, ואני מתחייב/ת לפעול על פיהם.
                <br />
                <span className="text-muted-foreground">צוות פל״א שומר על הזכות לעדכן מסמכים אלו מעת לעת.</span>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
