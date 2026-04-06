import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import cardFarm from "@/assets/card-farm.jpg";
import cardGuesthouse from "@/assets/card-guesthouse.jpg";
import cardHosting from "@/assets/card-hosting.jpg";
import cardSingle from "@/assets/card-single.jpg";

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
    subtitle: "פתחו את הדלת לאורח/ת לשבת",
    description: "הצטרפו כמארחים והזמינו רווקים ורווקות לשולחן השבת שלכם",
    cta: "הירשמו כמארחים",
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

const RegistrationCards = () => {
  const navigate = useNavigate();

  return (
    <section id="opportunities" className="py-24 bg-[hsl(var(--pastel-sage))]/30">
      <div className="container mx-auto px-6">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary tracking-wide">
            הצטרפו אלינו
          </span>
          <h2 className="mb-3 text-3xl font-black md:text-[2.75rem] leading-tight">
            מי <span className="text-gradient-warm">אתם?</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            בחרו את הקטגוריה שמתאימה לכם והירשמו — זה חינם ולוקח דקה
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {registrationCards.map((card, i) => (
            <motion.div
              key={card.title}
              {...fadeUp}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate("/auth")}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  width={800}
                  height={512}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210,18%,12%)]/85 via-[hsl(210,18%,12%)]/50 to-[hsl(210,18%,12%)]/20" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end p-7 min-h-[280px] md:min-h-[300px] text-right">
                <h3 className="text-2xl font-black text-cream mb-1 font-display">
                  {card.title}
                </h3>
                <p className="text-base font-semibold text-cream/90 mb-2">
                  {card.subtitle}
                </p>
                <p className="text-sm text-cream-deep/80 mb-5 leading-relaxed max-w-sm">
                  {card.description}
                </p>
                <Button
                  size="sm"
                  className="self-start rounded-full text-xs font-bold px-6 h-9 shadow-md hover:shadow-lg transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/auth");
                  }}
                >
                  {card.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegistrationCards;
