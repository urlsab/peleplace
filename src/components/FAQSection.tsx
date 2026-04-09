import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

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
      "כן! לאחר שהאירוע הושלם, תוכלו לדרג את החוויה בשלושה קטגוריות: אירוח, אוכל ואווירה. הדירוגים עוזרים לקהילה לגדול.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-6">
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
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-2xl border border-border bg-card px-6 shadow-card data-[state=open]:shadow-hover transition-shadow"
              >
                <AccordionTrigger className="text-right font-bold font-display text-sm py-5 hover:no-underline [&>svg]:shrink-0">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
