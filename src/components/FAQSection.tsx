import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Heart, Star, Sun } from "lucide-react";
import warmLandscapeBg from "@/assets/warm-landscape-bg.jpg";

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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary tracking-wide">
            <HelpCircle className="h-3.5 w-3.5" />
            שאלות נפוצות
          </span>
          <h2 className="mb-3 text-3xl font-black md:text-[2.75rem] leading-tight">
            שאלות <span className="text-gradient-warm">ותשובות</span>
          </h2>
          <p className="mx-auto max-w-md text-muted-foreground">
            כל מה שרציתם לדעת על פל״א במקום אחד
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => {
              const bgColors = [
                "hsl(155 30% 92%)",
                "hsl(20 40% 93%)",
                "hsl(30 40% 92%)",
                "hsl(155 25% 93%)",
                "hsl(20 35% 92%)",
                "hsl(155 20% 94%)",
                "hsl(30 35% 93%)",
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
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
              );
            })}

          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
