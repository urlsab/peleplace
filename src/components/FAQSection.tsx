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
      "כל רווק או רווקה מעל גיל 18 שמחפשים מקום חם להיות בו בשבתות וחגים, וכן משפחות, מעסיקים ומציעי התנדבות שרוצים לפתוח את הדלת ולארח.",
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
      "אחרי שההרשמה מאושרת, נכנסים לדף ״גלה הזדמנויות״, בוחרים הצעה שמתאימה ולוחצים ״שלחו בקשה״. המארח/מעסיק יקבל הודעה ויחזור אליכם.",
  },
  {
    question: "האם אפשר לדרג אחרי שבת?",
    answer:
      "כן! לאחר שהאירוח הושלם, תוכלו לדרג את החוויה בשלושה קטגוריות: אירוח, אוכל ואווירה. הדירוגים עוזרים לנו לשמור על רמה גבוהה ולסנן מתארחים או מארחים שלא עומדים בתקנון ובנהלים של הקהילה.",
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
            className="md:col-span-5 md:sticky md:top-24 text-right"
          >
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary tracking-[0.15em] uppercase">
              <HelpCircle className="h-3.5 w-3.5" />
              שאלות נפוצות
            </span>
            <h2 className="mb-5 text-4xl md:text-[3.5rem] font-black leading-[1.05]">
              שאלות
              <br />
              <span className="text-gradient-warm italic">ותשובות.</span>
            </h2>
            <p className="text-muted-foreground text-base mb-8 max-w-sm mr-auto">
              כל מה שרציתם לדעת על פל״א — במקום אחד, בלי סיבוב.
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
              <p className="absolute bottom-5 right-5 text-cream font-display font-bold text-sm drop-shadow-lg">
                הדלת תמיד פתוחה.
              </p>
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
              {faqs.map((faq, i) => {
                const bgColors = [
                  "hsl(155 30% 75%)",
                  "hsl(20 40% 80%)",
                  "hsl(30 40% 78%)",
                  "hsl(155 25% 77%)",
                  "hsl(20 35% 79%)",
                  "hsl(155 20% 78%)",
                  "hsl(30 35% 78%)",
                ];
                return (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-2xl border border-border/50 px-6 shadow-card data-[state=open]:shadow-hover transition-shadow"
                  style={{ backgroundColor: bgColors[i % bgColors.length] }}
                >
                  <AccordionTrigger className="text-right font-bold font-display text-sm py-5 hover:no-underline [&>svg]:shrink-0">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 text-sm leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
                );
              })}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
