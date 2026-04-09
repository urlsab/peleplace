import { motion } from "framer-motion";
import { Briefcase, HandHeart, Home, Star, Heart, Sparkles, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import founderPhoto from "@/assets/founder-photo.png";
import aboutWarmBg from "@/assets/about-warm-bg.jpg";
import HeroSection from "@/components/HeroSection";
import RegistrationCards from "@/components/RegistrationCards";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import warmTextureBg from "@/assets/warm-texture-bg.jpg";

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

      {/* Registration Cards */}
      <RegistrationCards />

      {/* About Us */}
      <section id="about" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutWarmBg} alt="" className="h-full w-full object-cover" loading="lazy" width={1920} height={1080} />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[3px]" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-[8%] animate-float-slow opacity-[0.07]">
          <Heart className="h-16 w-16 text-secondary" />
        </div>
        <div className="absolute bottom-24 left-[6%] animate-float-reverse opacity-[0.06]">
          <Home className="h-14 w-14 text-primary" />
        </div>
        <div className="absolute top-1/3 left-[3%] animate-drift opacity-[0.05]">
          <Sparkles className="h-10 w-10 text-terracotta" />
        </div>

        {/* Warm blurred orbs */}
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-primary/8 blur-[80px]" />

        <div className="container relative z-10 mx-auto px-6">
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
                src={founderPhoto}
                alt="אודיה, יוסף חיים ופלא — המשפחה מאחורי הפרויקט"
                className="w-full rounded-2xl shadow-card mb-2 object-cover max-h-[400px]"
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
                  desc: "ארגונים שזקוקים לעזרה בהתנדבות — עם לב ורצון לתת",
                },
                {
                  emoji: "💼",
                  title: "מקומות עבודה",
                  desc: "בתי מלון, בתי אבות ובתי הארחה שמחפשים עובדים טובים ואמינים",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/40 p-5 shadow-card text-right"
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

      {/* FAQ */}
      <FAQSection />

      {/* Contact */}
      <ContactSection />

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        {/* Warm texture background */}
        <div className="absolute inset-0">
          <img src={warmTextureBg} alt="" className="h-full w-full object-cover opacity-30" loading="lazy" width={1920} height={1080} />
          <div className="absolute inset-0 bg-cream/60" />
        </div>

        {/* Floating decorative */}
        <div className="absolute top-10 right-[15%] animate-float opacity-[0.06]">
          <Star className="h-12 w-12 text-primary" />
        </div>
        <div className="absolute bottom-10 left-[12%] animate-float-slow opacity-[0.05]">
          <Sun className="h-14 w-14 text-secondary" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] p-12 text-center md:p-20"
            style={{ background: "var(--gradient-warm)" }}
          >
            <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-cream/10 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-cream/8 blur-2xl" />

            <div className="relative z-10">
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
      <footer className="border-t border-border/60 bg-cream-deep py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black font-display">פל<span className="text-gradient-warm">״</span>א</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">תקנון</a>
              <span className="text-border">|</span>
              <p className="text-xs text-muted-foreground">
                © 2026 פל״א — פשוט לבחור איפה. כל הזכויות שמורות
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
