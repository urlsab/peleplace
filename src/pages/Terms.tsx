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

            <section className="rounded-xl bg-accent/60 p-5">
              <p className="text-sm font-medium text-foreground text-center">
                בהרשמה לפל״א, אני מאשר/ת שקראתי את התקנון ואני מתחייב/ת לפעול על פיו.
                <br />
                <span className="text-muted-foreground">צוות פל״א שומר על הזכות לעדכן תקנון זה מעת לעת.</span>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
