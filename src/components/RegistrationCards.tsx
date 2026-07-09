import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


import cardFarm from "@/assets/card-farm.jpg";
import cardGuesthouse from "@/assets/card-guesthouse.jpg";
import cardHosting from "@/assets/card-hosting.jpg";
import cardSingle from "@/assets/card-single.jpg";
import cardSinglesGroup from "@/assets/card-singles-group.jpg";
import cardOrganizedShabbat from "@/assets/card-organized-shabbat.jpg";
import cardReservist from "@/assets/card-reservist.jpg";

const registrationCards = [
  {
    image: cardSingle,
    title: "רווק/ה?",
    subtitle: "מחפש/ת מקום חם להיות בו בשבת?",
    description: "הירשמו ותמצאו אירוח, התנדבות או עבודה — כל שבת במקום אחר",
    cta: "הירשמו כרווק/ה",
    userType: "single",
  },
  {
    image: cardHosting,
    title: "משפחה מארחת?",
    subtitle: "הזמינו אורח/ת לשולחן השבת",
    description: "הצטרפו כמארחים והזמינו רווקים ורווקות לשולחן השבת שלכם",
    cta: "הירשמו כמארחים",
    userType: "host",
  },
  {
    image: cardReservist,
    title: "אשת מילואים?",
    subtitle: "בעלך במילואים ושמחה לחברה בבית?",
    description: "הזמיני אורחת שתבוא לעזור עם הילדים, בהכנות לשבת, או פשוט להיות חברה",
    cta: "הירשמי כאשת מילואים",
    userType: "host",
  },
  {
    image: cardSinglesGroup,
    title: "חבורת רווקים/ות?",
    subtitle: "מתארגנים על שבת ביחד?",
    description: "פרסמו את השבת שלכם והזמינו רווקים נוספים בני גילכם להצטרף לחבורה",
    cta: "הירשמו כחבורה",
    userType: "host",
  },
  {
    image: cardOrganizedShabbat,
    title: "שבת מאורגנת?",
    subtitle: "סמינר ערכים, שבת שידוכים או ארגון?",
    description: "פרסמו את השבתות המאורגנות שלכם ותגיעו לקהל הרלוונטי",
    cta: "הירשמו כארגון",
    userType: "host",
  },
  {
    image: cardFarm,
    title: "חווה או ארגון?",
    subtitle: "מחפשים מתנדבים לשמירה, מרעה או פעילות?",
    description: "רווקים ורווקות מחפשים חוויות משמעותיות — הירשמו ונחבר ביניכם",
    cta: "הירשמו כמארחי התנדבות",
    userType: "host",
  },
  {
    image: cardGuesthouse,
    title: "בית הארחה או מלון?",
    subtitle: "מחפשים עובדים זמניים או קבועים?",
    description: "פרסמו משרות לשבתות וחגים ומצאו עובדים אמינים ואיכותיים",
    cta: "הירשמו כמעסיקים",
    userType: "host",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const FlipCard = ({ card, index, onNavigate }: { card: typeof registrationCards[0]; index: number; onNavigate: () => void }) => {
  return (
    <motion.div
      {...fadeUp}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group perspective-[1000px] min-h-[300px] md:min-h-[320px] cursor-pointer"
      onClick={onNavigate}
    >
      <div className="relative w-full h-full min-h-[300px] md:min-h-[320px] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front - title + image only */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-card">
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            width={800}
            height={512}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210,18%,8%)]/95 via-[hsl(210,18%,12%)]/60 to-[hsl(210,18%,12%)]/30" />
          <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-center md:items-center md:inset-0 md:p-0">
            <h3 className="text-3xl md:text-4xl font-black text-cream font-display text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
              {card.title}
            </h3>
          </div>
        </div>

        {/* Back - details */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-card">
          <img
            src={card.image}
            alt={card.title}
            loading="lazy"
            width={800}
            height={512}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210,18%,12%)]/90 via-[hsl(210,18%,12%)]/70 to-[hsl(210,18%,12%)]/40" />
          <div className="absolute inset-0 flex flex-col justify-end p-7 text-right">
            <h3 className="text-2xl font-black text-cream mb-1 font-display">
              {card.title}
            </h3>
            <p className="text-base font-semibold text-cream/90 mb-2">
              {card.subtitle}
            </p>
            <p className="text-sm text-cream-deep/80 leading-relaxed max-w-sm">
              {card.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RegistrationCards = () => {
  const navigate = useNavigate();

  return (
    <section id="opportunities" className="relative py-24 overflow-hidden">
      {/* Clean text heading — separate from card styling */}
      <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="container mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-[3.5rem] font-black leading-[1.05]" style={{ color: '#FAF6F5CC' }}>
          מי <span className="text-gradient-warm">אתם?</span>
        </h2>
      </motion.div>

      <div className="container relative z-10 mx-auto px-6">

        <div className="grid gap-6 sm:grid-cols-2">
          {registrationCards.map((card, i) => (
            <FlipCard
              key={card.title}
              card={card}
              index={i}
              onNavigate={() => navigate("/auth")}
            />
          ))}
        </div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex justify-center"
        >
          <Button
            size="lg"
            className="rounded-full text-base font-bold px-10 h-12 shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate("/auth")}
          >
            הירשמו עכשיו
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationCards;
