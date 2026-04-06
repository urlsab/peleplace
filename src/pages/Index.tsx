import { motion } from "framer-motion";
import { Briefcase, HandHeart, Home, ArrowLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import aboutIllustration from "@/assets/about-illustration.jpg";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import OpportunityCard from "@/components/OpportunityCard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: Briefcase,
    title: "עבודה זמנית",
    description: "הרוויחו כסף תוך כדי שהייה במקומות מיוחדים בשבתות וחגים",
    examples: ["בתי מלון", "בתי הארחה", "בתי אבות"],
    color: "primary" as const,
  },
  {
    icon: HandHeart,
    title: "התנדבות",
    description: "תנו מעצמכם ותקבלו חוויה משמעותית וחברה חמה",
    examples: ["נשות מילואים", "בתי ילד", "בתי חב״ד"],
    color: "secondary" as const,
  },
  {
    icon: Home,
    title: "אירוח",
    description: "זוגות ומשפחות שפותחים את הבית שלהם בשבילכם",
    examples: ["זוגות צעירים", "משפחות", "קהילות"],
    color: "terracotta" as const,
  },
];

const opportunities = [
  {
    title: "שבת בצימר בגליל",
    location: "ראש פינה",
    date: "שבת פרשת וירא",
    spots: 4,
    category: "אירוח",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
  },
  {
    title: "התנדבות בבית אבות",
    location: "ירושלים",
    date: "שבת פרשת חיי שרה",
    spots: 8,
    category: "התנדבות",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80",
  },
  {
    title: "עבודה במלון ספא",
    location: "ים המלח",
    date: "חנוכה",
    spots: 6,
    category: "עבודה",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
  },
];

const stats = [
  { number: "2,500+", label: "רווקים ורווקות" },
  { number: "450+", label: "מארחים" },
  { number: "180+", label: "מקומות פעילים" },
  { number: "98%", label: "שביעות רצון" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCTA = () => {
    navigate(user ? "/profile" : "/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Stats */}
      <section className="relative border-b border-border/60 bg-card py-14">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="text-3xl font-black font-display text-gradient-warm md:text-4xl">{stat.number}</div>
              <div className="mt-1.5 text-xs font-medium text-muted-foreground tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-24 pattern-dots">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-foreground tracking-wide">
              קטגוריות
            </span>
            <h2 className="mb-3 text-3xl font-black md:text-[2.75rem] leading-tight">
              מה מתאים <span className="text-gradient-warm">לכם?</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              בחרו את הדרך שלכם לשבת מושלמת — עבודה, התנדבות או אירוח חם
            </p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                {...fadeUp}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <CategoryCard {...cat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section id="opportunities" className="bg-cream-deep py-24">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-14 flex flex-col items-center text-center md:flex-row md:justify-between md:text-right">
            <div>
              <span className="mb-3 inline-block rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary tracking-wide">
                הזדמנויות
              </span>
              <h2 className="mb-2 text-3xl font-black md:text-[2.75rem] leading-tight">הזדמנויות קרובות</h2>
              <p className="text-muted-foreground text-base">השבת הבאה מחכה לכם</p>
            </div>
            <Button
              variant="outline"
              className="mt-4 md:mt-0 rounded-full gap-2 text-xs font-semibold"
              onClick={() => navigate("/explore")}
            >
              ראו הכל
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp.title}
                {...fadeUp}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <OpportunityCard {...opp} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary tracking-wide">
              קצת עלינו
            </span>
            <h2 className="mb-3 text-3xl font-black md:text-[2.75rem] leading-tight">
              הסיפור <span className="text-gradient-warm">שלנו</span>
            </h2>
          </motion.div>
          <div className="grid gap-10 md:grid-cols-2 items-start max-w-5xl mx-auto">
            {/* Personal story */}
            <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} className="space-y-5 text-right">
              <img
                src={aboutIllustration}
                alt="אילוסטרציה של ארוחת שבת משותפת"
                className="w-full rounded-2xl shadow-card mb-2"
                loading="lazy"
                width={800}
                height={600}
              />
              <p className="text-muted-foreground leading-[1.85] text-[15px]">
                שלום, אני <strong className="text-foreground">אודיה עמרוסי</strong>, בת 32, נשואה ליוסף חיים ואמא לפלא בן 9 חודשים.
                התחתנתי בגיל 30 — אחרי שנים ארוכות של שבתות וחגים שבהם הרגשתי קצת בודדה בתוך ההמולה המשפחתית.
              </p>
              <p className="text-muted-foreground leading-[1.85] text-[15px]">
                כשאחים שלי — הגדול ממני אבל גם קטנים ממני — התחתנו, הקושי רק גדל.
                העדפתי כל שבת וחג להתארח אצל חברים או לעבוד כאחות בבית חולים, רק כדי לא להרגיש את החלל.
              </p>
              <p className="text-muted-foreground leading-[1.85] text-[15px]">
                הקמתי את <strong className="text-foreground">פל״א</strong> כדי לתת לרווקים ורווקות את מה שהייתי צריכה — <em>בחירה</em>.
                בחירה אם להישאר אצל ההורים, או למצוא מקום אחר להיות בו. כי המטרה פשוטה:
              </p>
              <p className="text-lg font-bold font-display text-foreground leading-relaxed">
                שכל אחד ירגיש שתמיד יש לו איפה להיות. ❤️
              </p>
            </motion.div>

            {/* The need from both sides */}
            <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.5 }} className="space-y-4">
              <h3 className="font-bold font-display text-lg mb-4 text-right">הצורך הוא דו-צדדי</h3>
              {[
                {
                  emoji: "💛",
                  title: "רווקים ורווקות",
                  desc: "מחפשים מקום חם ומשמעותי להיות בו בשבתות ובחגים",
                },
                {
                  emoji: "🏡",
                  title: "זוגות ומשפחות",
                  desc: "רוצים להרגיש חלק, לפתוח את הדלת ולהכיל — גם כשאין יכולת לשדך",
                },
                {
                  emoji: "🌱",
                  title: "חוות ונוער בסיכון",
                  desc: "ארגונים שזקוקים למתנדבים עם לב ורצון לתת",
                },
                {
                  emoji: "💼",
                  title: "מקומות עבודה",
                  desc: "בתי מלון, בתי אבות ובתי הארחה שמחפשים עובדים טובים ואמינים",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl bg-background border border-border/60 p-5 shadow-card text-right"
                >
                  <div className="text-2xl mt-0.5 shrink-0">{item.emoji}</div>
                  <div>
                    <div className="font-bold font-display text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 pattern-dots">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] p-12 text-center md:p-20"
            style={{ background: "var(--gradient-warm)" }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-cream/10 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-cream/8 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-cream/15 px-3 py-1 text-[11px] font-medium text-cream/80 backdrop-blur-sm">
                <Star className="h-3 w-3" fill="currentColor" />
                הצטרפו ל-2,500+ חברי קהילה
              </div>
              <h2 className="mb-4 text-3xl font-black text-cream md:text-[2.75rem] leading-tight">
                השבת הבאה שלכם
                <br />
                מתחילה כאן
              </h2>
              <p className="mx-auto mb-8 max-w-md text-base text-cream-deep">
                הצטרפו לקהילה שלנו ותמצאו את המקום המושלם לכל שבת וחג
              </p>
              <Button
                onClick={handleCTA}
                size="lg"
                className="rounded-full bg-cream px-8 h-11 text-sm font-bold text-foreground shadow-lg hover:bg-cream-deep transition-all hover:shadow-xl"
              >
                הצטרפו עכשיו — בחינם
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black font-display">פל<span className="text-gradient-warm">״</span>א</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 פל״א — פשוט לבחור איפה. כל הזכויות שמורות
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;