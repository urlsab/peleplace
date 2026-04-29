import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Heart, Star, Sun } from "lucide-react";
import sceneOpenDoor from "@/assets/scene-open-door.jpg";


const faqs = [
  {
    question: "מי יכול/ה להירשם לפל״א?",
    answer:
      "ההרשמה פתוחה לרווקים ורווקות בגילאי 18 עד 45, וכן למשפחות, מעסיקים ומציעי התנדבות שרוצים לפתוח את הדלת ולארח. כל בקשה מחוץ לטווח הגילאים תעבור לאישור נפרד של הצוות שלנו.",
  },
  {
    question: "איך תהליך ההרשמה עובד?",
    answer:
      "נרשמים ומלאים פרטים בסיסיים (כולל ממליץ/ה). הצוות שלנו בודק כל הרשמה לפני אישור — כדי לשמור על קהילה בטוחה ואיכותית. לאחר אישור תוכלו לבנות פרופיל מלא ולהתחיל לגלות הזדמנויות.",
  },
  {
    question: "כמה זה עולה?",
    answer:
      "פל״א היא פלטפורמה חינמית לחלוטין! אין דמי הרשמה או עמלות — הכל מתוך רצון לחבר בין אנשים.",
  },
  {
    question: "האם המידע שלי מאובטח?",
    answer:
      "בהחלט. כל הפרטים שלכם מאובטחים ולא ישותפו ללא אישורכם. מסמכי זיהוי נשמרים בצורה מוצפנת ומשמשים לאימות בלבד.",
  },
  {
    question: "מה ההבדל בין עבודה, התנדבות ואירוח?",
    answer:
      "עבודה — עבודה בתשלום בשבתות וחגים (בתי מלון, בתי אבות ועוד). התנדבות — פעילות התנדבותית במקומות שזקוקים לעזרה. אירוח — משפחות וזוגות שמזמינים אליהם הביתה לשבת או לחג.",
  },
  {
    question: "איך שולחים בקשה להתארח?",
    answer:
      "אחרי שההרשמה מאושרת, נכנסים ל״לוח שבתות״ או ל״חיפוש״, בוחרים הצעה שמתאימה ולוחצים ״שלחו בקשה״. המארח/מעסיק יקבל הודעה ויחזור אליכם.",
  },
  {
    question: "האם אפשר לדרג אחרי שבת?",
    answer:
      "כן! לאחר שהאירוח הושלם, תוכלו לדרג את החוויה בשלושה קטגוריות: אירוח, אוכל ואווירה. הדירוגים עוזרים לנו לשמור על רמה גבוהה ולסנן מתארחים או מארחים שלא עומדים בתקנון ובנהלים של הקהילה.",
  },
  {
    question: "מה קורה אם בקשה שלי נדחית?",
    answer:
      "לא נורא — לכל מארח יש שיקולים משלו (כמות מקומות, התאמה משפחתית וכו׳). תוכלו לשלוח בקשות נוספות להזדמנויות אחרות באותה שבת, ולגלות מגוון רחב של אפשרויות בלוח השבתות ובדף החיפוש.",
  },
  {
    question: "מתי כדאי להירשם לשבת מסוימת?",
    answer:
      "ככל שמוקדם יותר — טוב יותר. מומלץ לשלוח בקשות עד יום שלישי שלפני השבת, כדי לאפשר למארחים זמן להיערך. בקשות של הרגע האחרון אפשריות, אבל הסיכוי קטן יותר.",
  },
  {
    question: "האם אני יכול/ה להירשם גם כאורח/ת וגם כמארח/ת?",
    answer:
      "בהחלט! הרבה מהמשתמשים שלנו מארחים בחלק מהשבתות ומתארחים באחרות. בפרופיל שלכם תוכלו להגדיר את שתי האופציות ולעבור ביניהן בקלות.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="relative py-24 overflow-hidden">

      {/* Floating decorative elements */}
      <div className="absolute top-16 right-[10%] animate-float-slow opacity-[0.08]">
        <HelpCircle className="h-20 w-20 text-primary" />
      </div>
      <div className="absolute bottom-20 left-[8%] animate-float-reverse opacity-[0.06]">
        <Heart className="h-16 w-16 text-secondary" />
      </div>
      <div className="absolute top-1/3 left-[5%] animate-drift opacity-[0.05]">
        <Star className="h-12 w-12 text-terracotta" />
      </div>
      <div className="absolute bottom-1/4 right-[6%] animate-float opacity-[0.07]">
        <Sun className="h-14 w-14 text-amber-soft" />
      </div>

      {/* Warm blurred orbs */}
      <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-secondary/8 blur-[80px]" />
      <div className="absolute bottom-10 right-1/4 h-48 w-48 rounded-full bg-primary/6 blur-[60px]" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid gap-12 md:gap-16 md:grid-cols-12 items-start max-w-6xl mx-auto">
          {/* Left: Image + headline (sticky) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-5 md:sticky md:top-24"
          >
            {/* Numbered marker — magazine style */}
            <div className="flex items-baseline gap-4 mb-6 justify-center md:justify-start">
              <span className="font-display text-7xl md:text-8xl font-black text-primary/20 leading-none">07</span>
              <span className="text-[10px] font-bold text-muted-foreground tracking-[0.25em] uppercase">FAQ — שאלות נפוצות</span>
            </div>
            {/* Centered serif-flavored headline with hand-drawn underline */}
            <h2 className="mb-6 text-center md:text-right text-3xl md:text-5xl font-black leading-[1.15] font-display">
              <span className="block">כל מה ש</span>
              <span className="relative inline-block mt-2">
                <span className="text-gradient-warm italic">רציתם לדעת</span>
                <svg className="absolute -bottom-2 right-0 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M2,8 Q50,2 100,7 T198,5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-primary/60" />
                </svg>
              </span>
              <span className="block mt-3">על פל״א.</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-8 text-center md:text-right max-w-xs mx-auto md:mx-0">
              כל מה שרציתם לדעת על פל״א — במקום אחד.
            </p>
            <div className="relative rounded-[2rem] overflow-hidden shadow-card">
              <img
                src={sceneOpenDoor}
                alt="דלת פתוחה — בית מזמין לשבת"
                loading="lazy"
                width={896}
                height={1280}
                className="w-full h-[280px] md:h-[360px] object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsla(210,18%,8%,0.4), transparent 60%)" }} />
            </div>
          </motion.div>

          {/* Right: Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="md:col-span-7"
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-2xl border border-border/50 px-6 shadow-card data-[state=open]:shadow-hover transition-shadow"
                  style={{ backgroundColor: "hsl(30 40% 88%)" }}
                >
                  <AccordionTrigger className="text-right font-bold font-display text-sm py-5 hover:no-underline [&>svg]:shrink-0">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 text-sm leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
