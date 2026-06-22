import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import DynamicBackground from "@/components/DynamicBackground";
import { Button } from "@/components/ui/button";

type Lang = "he" | "en";

const Accessibility = () => {
  const [lang, setLang] = useState<Lang>("he");
  const isHe = lang === "he";

  return (
    <div className="min-h-screen">
      <DynamicBackground variant="vineyard" />
      <Navbar />
      <div className="container mx-auto px-6 py-16 max-w-3xl" dir={isHe ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="mt-4 text-3xl font-black font-display">
              {isHe ? "הצהרת נגישות" : "Accessibility Statement"}
            </h1>
            <p style={{color:'black'}} className="mt-2 text-muted-foreground">
              {isHe ? "עודכן לאחרונה: אפריל 2026" : "Last updated: April 2026"}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8" dir="ltr">
            <Button
              size="sm"
              variant={lang === "he" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setLang("he")}
            >
              עברית
            </Button>
            <Button
              size="sm"
              variant={lang === "en" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setLang("en")}
            >
              English
            </Button>
          </div>

          <div className={`space-y-8 rounded-2xl border border-border bg-card p-8 shadow-card leading-relaxed ${isHe ? "text-right" : "text-left"}`}>
            {isHe ? <HebrewContent /> : <EnglishContent />}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const HebrewContent = () => (
  <>
    <section>
      <h2 className="text-lg font-bold font-display mb-3">1. מחויבות לנגישות</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        פל״א (״פשוט לבחור איפה״) רואה בנגישות האתר ערך עליון, ופועלת להנגיש את שירותיה למרב האנשים, לרבות אנשים עם מוגבלויות.
        אנו עושים מאמצים מתמשכים לעמוד בדרישות תקן ישראלי ת״י 5568 ברמת AA וב-WCAG 2.1 ברמת AA.
      </p>
    </section>

    <section>
      <h2 className="text-lg font-bold font-display mb-3">2. רכיב הנגישות</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        באתר מוטמע רכיב נגישות של חברת <strong>Enable</strong>, המאפשר התאמות אישיות לגלישה נוחה. ניתן להפעילו באמצעות כפתור הנגישות
        המופיע בצד המסך, ולכלול בין היתר:
      </p>
      <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside mt-3">
        <li>הגדלה והקטנה של גודל הטקסט.</li>
        <li>שינוי ניגודיות צבעים (ניגודיות גבוהה, רקע כהה/בהיר).</li>
        <li>הדגשת קישורים וכותרות.</li>
        <li>החלפת הגופן לגופן קריא.</li>
        <li>עצירת אנימציות ותכנים נעים.</li>
        <li>ניווט מלא באמצעות מקלדת.</li>
        <li>תאימות לקוראי מסך (NVDA, JAWS, VoiceOver).</li>
        <li>סמן עכבר מוגדל.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold font-display mb-3">3. תקן והתאמות</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        האתר נבנה תוך שאיפה לעמוד בתקן ת״י 5568 ברמה AA, התואם להמלצות ה-WCAG 2.1 של ארגון W3C.
        השימוש בעיצוב רספונסיבי מאפשר גלישה נוחה במגוון מכשירים — מחשב, טאבלט וטלפון נייד.
      </p>
    </section>

    <section>
      <h2 className="text-lg font-bold font-display mb-3">4. חלקים שאינם נגישים</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        על אף מאמצינו להנגיש את כלל עמודי האתר, ייתכנו חלקים או תכנים אשר טרם הונגשו במלואם, או שעלולה להתגלות בהם בעיית נגישות.
        אנו ממשיכים לפעול לשיפור הנגישות באתר כחלק ממחויבותנו לאפשר את השימוש בו לכלל הציבור.
      </p>
    </section>

    <section>
      <h2 className="text-lg font-bold font-display mb-3">5. פנייה בנושא נגישות</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        אם נתקלת בבעיית נגישות באתר, או שיש ברצונך להציע שיפור — נשמח לשמוע ממך. ניצור קשר ונטפל בפנייה בהקדם האפשרי.
      </p>
      <div className="mt-3 text-sm text-muted-foreground leading-[1.85]">
        <p><strong>רכזת נגישות:</strong> צוות פל״א</p>
        <p>
          <strong>דוא״ל:</strong>{" "}
          <a href="mailto:support@peleplace.com" className="text-primary hover:underline">
            support@peleplace.com
          </a>
        </p>
      </div>
    </section>
  </>
);

const EnglishContent = () => (
  <>
    <section>
      <h2 className="text-lg font-bold font-display mb-3">1. Our commitment to accessibility</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        Pele ("Pashut Livchor Eifo" — Simply Choose Where) is committed to making its website accessible to as many people
        as possible, including people with disabilities. We continuously work to comply with Israeli Standard IS 5568 Level AA
        and WCAG 2.1 Level AA.
      </p>
    </section>

    <section>
      <h2 className="text-lg font-bold font-display mb-3">2. Accessibility widget</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        The website includes an accessibility widget by <strong>Enable</strong>, which can be activated via the accessibility
        button on the side of the screen and provides features such as:
      </p>
      <ul className="text-muted-foreground text-sm leading-[1.85] space-y-2 list-disc list-inside mt-3">
        <li>Text resizing (larger / smaller).</li>
        <li>High-contrast and inverted color modes.</li>
        <li>Highlighting of links and headings.</li>
        <li>Switching to a more readable font.</li>
        <li>Pausing animations and moving content.</li>
        <li>Full keyboard navigation.</li>
        <li>Screen reader compatibility (NVDA, JAWS, VoiceOver).</li>
        <li>Enlarged mouse cursor.</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold font-display mb-3">3. Standards & compatibility</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        The website was built to meet Israeli Standard IS 5568 Level AA, in line with the W3C WCAG 2.1 recommendations.
        A responsive design ensures comfortable use across devices — desktop, tablet and mobile.
      </p>
    </section>

    <section>
      <h2 className="text-lg font-bold font-display mb-3">4. Areas that may not be fully accessible</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        Despite our efforts, some pages or content may not yet be fully accessible, or may contain accessibility issues.
        We continue to work on improving accessibility as part of our ongoing commitment to all users.
      </p>
    </section>

    <section>
      <h2 className="text-lg font-bold font-display mb-3">5. Contact us about accessibility</h2>
      <p className="text-muted-foreground text-sm leading-[1.85]">
        If you encounter an accessibility issue, or have a suggestion for improvement, we would love to hear from you.
        We will respond and address the matter as soon as possible.
      </p>
      <div className="mt-3 text-sm text-muted-foreground leading-[1.85]">
        <p><strong>Accessibility coordinator:</strong> The Pele team</p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@peleplace.com" className="text-primary hover:underline">
            support@peleplace.com
          </a>
        </p>
      </div>
    </section>
  </>
);

export default Accessibility;
