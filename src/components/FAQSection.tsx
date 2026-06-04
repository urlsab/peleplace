import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Heart, Star, Sun } from "lucide-react";


const faqs = [
  {
    question: "מי יכול/ה להירשם לפל״א?",
    answer:
      "ההרשמה פתוחה לרווקים ורווקות בגילאי 18 עד 45, וכן למשפחות, מעסיקים ומציעי התנדבות שרוצים לפתוח את הדלת ולארח. כל בקשה מחוץ לטווח הגילאים תעבור לאישור נפרד של הצוות שלנו.",
  },
  {
    question: "איך תהליך ההרשמה עובד?",
    answer:
      "ההרשמה פשוטה — בוחרים את הקטגוריה שמתאימה לכם וממלאים פרופיל מלא ישר בהתחלה (כולל ממליץ/ה). הצוות שלנו בודק כל פרופיל לפני אישור — כדי לשמור על קהילה בטוחה ואיכותית. לאחר אישור תוכלו להתחיל לגלות הזדמנויות.",
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
      "בהחלט! בעמוד ״הפרופיל שלי״ יש כפתור החלפה בראש המסך — מעבר בין ״רווק/ה״ ל״מארח/ת״ בלחיצה אחת. תוכלו למלא את שני הפרופילים ולעבור ביניהם בקלות בכל פעם, וכך גם לחפש מקום לשבת וגם לארח אורחים אצלכם.",
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
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black leading-[1.15] font-display">
              שאלות נפוצות על פל"א
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="space-y-3 max-w-2xl mx-auto">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-2xl border border-border/50 px-6 shadow-card data-[state=open]:shadow-hover transition-shadow"
                  style={{ backgroundColor: "hsl(30 40% 88%)" }}
                >
                  <AccordionTrigger className="justify-center gap-3 text-center font-bold font-display text-sm py-5 hover:no-underline [&>svg]:shrink-0">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-center text-foreground font-bold text-sm leading-relaxed pb-5">
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
