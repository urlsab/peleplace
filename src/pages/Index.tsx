import { motion } from "framer-motion";
import { Briefcase, HandHeart, Home, Star, Heart, Sparkles, Sun, ShieldCheck, UserCheck, Lock, Eye, CalendarPlus } from "lucide-react";
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
import warmLandscapeBg from "@/assets/warm-landscape-bg.jpg";
import shabbatTableBg from "@/assets/shabbat-table-bg.jpg";
import categoriesBg from "@/assets/categories-bg.jpg";
import heroImage from "@/assets/hero-shabbat.jpg";
import ScrollingBackground from "@/components/ScrollingBackground";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const backgroundLayers = [
  { id: "hero", image: heroImage, overlayStyle: { background: "linear-gradient(to left, hsla(210,18%,6%,0.7) 20%, hsla(210,18%,6%,0.4) 50%, hsla(210,18%,6%,0.15) 100%)" } },
  { id: "opportunities", image: categoriesBg, overlayStyle: { backgroundColor: "hsla(50,20%,97%,0.55)", backdropFilter: "blur(1px)" } },
  { id: "about", image: aboutWarmBg, overlayStyle: { backgroundColor: "hsla(50,20%,97%,0.6)", backdropFilter: "blur(1px)" } },
  { id: "trust", image: aboutWarmBg, overlayStyle: { backgroundColor: "hsla(50,20%,97%,0.62)", backdropFilter: "blur(1px)" } },
  { id: "faq", image: warmLandscapeBg, overlayStyle: { backgroundColor: "hsla(50,20%,97%,0.55)", backdropFilter: "blur(1px)" } },
  { id: "contact", image: shabbatTableBg, overlayStyle: { backgroundColor: "hsla(50,20%,97%,0.6)", backdropFilter: "blur(1px)" } },
  { id: "cta", image: shabbatTableBg, overlayStyle: { backgroundColor: "hsla(50,20%,97%,0.62)", backdropFilter: "blur(1px)" } },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const isApprovedHost = profile?.user_type === "host" && profile?.registration_status === "approved";

  const handleCTA = () => {
    navigate(user ? "/profile" : "/auth");
  };

  return (
    <div className="home-page min-h-screen relative">
      <ScrollingBackground layers={backgroundLayers} />

      <div className="relative z-10">
        <Navbar />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <HeroSection />
        </motion.div>

        {/* Host quick action banner */}
        {isApprovedHost && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative z-10 container mx-auto px-6 -mt-8 mb-4"
          >
            <div
              className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card border border-primary/15"
              style={{ background: "linear-gradient(135deg, hsla(25,80%,51%,0.08), hsla(155,30%,45%,0.06))" }}
            >
              <div className="flex items-center gap-3 text-right">
                <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">ברוכים הבאים, {profile.first_name || "מארח/ת"}!</p>
                  <p className="text-xs text-foreground font-bold">רוצים לפתוח את הבית בשבת הקרובה?</p>
                </div>
              </div>
              <Button
                onClick={() => navigate("/profile#dates")}
                className="rounded-full bg-primary px-5 h-10 text-xs font-bold text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 transition-all whitespace-nowrap"
              >
                <CalendarPlus className="h-4 w-4 ml-1.5" />
                הוסיפו שבת לאירוח
              </Button>
            </div>
          </motion.section>
        )}

        {/* Registration Cards */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <RegistrationCards />
        </motion.div>

        {/* About — asymmetric editorial layout */}
        <motion.section id="about" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.65 }} className="relative py-28 overflow-hidden">
          {/* Floating decorative elements */}
          <div className="absolute top-20 right-[8%] animate-float-slow opacity-[0.07]">
            <Heart className="h-16 w-16 text-secondary" />
          </div>
          <div className="absolute bottom-24 left-[6%] animate-float-reverse opacity-[0.06]">
            <Home className="h-14 w-14 text-primary" />
          </div>

          <div className="container relative z-10 mx-auto px-6">
            {/* Section label — top right, no card */}
            <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-12 text-right max-w-3xl mr-auto">
              <h2 className="text-4xl md:text-[3.5rem] font-black leading-[1.05]">
                הסיפור <span className="text-gradient-warm">שלנו</span>
              </h2>
            </motion.div>

            {/* Asymmetric layout: large image left, text overflowing right */}
            <div className="grid gap-10 md:grid-cols-2 items-start max-w-6xl mx-auto">
              {/* Image column — large, no frame */}
              <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }} className="md:order-2 self-start">
                <div className="relative">
                  <img
                    src={founderPhoto}
                    alt="אודיה, יוסף חיים ופלא — המשפחה מאחורי הפרויקט"
                    className="w-full rounded-[2rem] shadow-card object-cover aspect-[4/5]"
                    loading="lazy"
                    width={800}
                    height={1000}
                  />
                  {/* Caption tag floating over image */}
                  <div className="absolute left-1/2 bottom-4 -translate-x-1/2 bg-cream rounded-full px-5 py-2.5 shadow-card border border-border/40">
                    <span className="text-xs font-bold text-foreground text-center block">אודיה, יוסף חיים ופלא 💛</span>
                  </div>
                </div>
              </motion.div>

              {/* Text column — flowing, no card background */}
              <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }} className="md:order-1 space-y-6 text-right self-start">
                <p className="text-2xl md:text-[1.85rem] font-display font-black leading-[1.45] text-foreground">
                  שלום, אני <span className="text-gradient-warm">אודיה עמרוסי</span> — בת 32, נשואה ליוסף חיים ואמא לפלא בן שנה.
                </p>

                <p className="text-lg md:text-xl text-foreground font-bold leading-[1.9]">
                  התחתנתי בגיל 30 — אחרי שנים ארוכות של שבתות וחגים שבהם הרגשתי קצת בודדה בתוך ההמולה המשפחתית. כשאחים שלי — הגדול ממני אבל גם קטנים ממני — התחתנו, הקושי רק גדל.
                </p>

                <p className="text-lg md:text-xl text-foreground font-bold leading-[1.9]">
                  העדפתי כל שבת וחג להתארח אצל חברים או לעבוד כאחות בבית חולים, רק כדי לא להרגיש את החלל.
                </p>

                <p className="text-lg md:text-xl text-foreground font-bold leading-[1.9]">
                  הקמתי את <strong className="text-foreground">פל״א</strong> כדי לתת לרווקים ורווקות את מה שהייתי צריכה — <em className="text-primary not-italic font-semibold">בחירה</em>. בחירה אם להישאר אצל ההורים, או למצוא מקום אחר להיות בו.
                </p>

                <p className="text-lg md:text-xl text-foreground font-bold leading-[1.9] pt-1">
                  שכל אחד ירגיש שתמיד יש לו איפה להיות. <span className="inline-block animate-float">❤️</span>
                </p>

                {/* The need — minimal inline list, no boxes */}
                <div className="pt-8 mt-8 border-t border-border/40">
                  <h3 className="font-display font-bold text-sm text-primary tracking-[0.15em] uppercase mb-5">הצורך הוא דו-צדדי</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { emoji: "💛", title: "רווקים ורווקות", desc: "מקום חם בשבתות וחגים" },
                      { emoji: "🏡", title: "זוגות ומשפחות", desc: "לפתוח את הדלת ולהכיל" },
                      { emoji: "🌱", title: "חוות והתנדבות", desc: "עזרה עם לב ומשמעות" },
                      { emoji: "💼", title: "מקומות עבודה", desc: "עובדים אמינים לשבתות" },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3 group">
                        <span className="text-2xl mt-0.5 shrink-0 group-hover:scale-110 transition-transform">{item.emoji}</span>
                        <div>
                          <div className="font-bold font-display text-sm">{item.title}</div>
                          <div className="text-xs text-foreground font-bold mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Trust & Safety — מניעת זיוף זהויות והגנה על המשתמשים */}
        <motion.section id="trust" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.65 }} className="relative py-24 overflow-hidden">
          <div className="absolute top-16 left-[10%] animate-float-slow opacity-[0.06]">
            <ShieldCheck className="h-16 w-16 text-primary" />
          </div>

          <div className="container relative z-10 mx-auto px-6">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-12 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-[2.75rem] font-black leading-[1.1]">
                קהילה <span className="text-gradient-warm">מאומתת</span>
                <br />
                שאפשר לסמוך עליה
              </h2>
              <p className="mt-5 text-lg md:text-xl text-foreground font-bold leading-[1.85]">
                כל פרופיל בפל״א עובר תהליך אישור ידני. אנחנו מקפידים על אמיתות הזהויות
                ועל הגנה מירבית על המידע שלכם — כי שבת חמה מתחילה מתוך תחושת ביטחון.
              </p>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2 max-w-5xl mx-auto">
              {[
                {
                  icon: UserCheck,
                  title: "אישור ידני לכל הרשמה",
                  desc: "צוות פל״א בודק כל פרופיל לפני שהוא נכנס לקהילה — שם מלא, טלפון, ממליץ/ה ופרטי זיהוי.",
                },
                {
                  icon: ShieldCheck,
                  title: "מניעת זיוף זהויות",
                  desc: "אסור להירשם תחת שם בדוי או להתחזות. הפרת הכלל גוררת חסימה מיידית — ואחריות פלילית לפי החוק.",
                },
                {
                  icon: Lock,
                  title: "פרטים שנחשפים רק כשצריך",
                  desc: "מספר הטלפון והכתובת של המארח/ת והאורח/ת נחשפים אך ורק לאחר אישור הדדי של בקשת האירוח.",
                },
                {
                  icon: Eye,
                  title: "דיווח אנונימי על חשד",
                  desc: "כל חבר/ת קהילה יכול/ה לדווח על פרופיל חשוד. נבדוק כל דיווח תוך 48 שעות — וזהותך נשמרת חסויה.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ duration: 0.5 }}
                  className="group flex items-start gap-4 rounded-2xl border border-primary/15 bg-card/70 backdrop-blur-sm p-6 hover:border-primary/30 hover:shadow-card transition-all"
                >
                  <div className="shrink-0 h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/15 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="font-bold font-display text-base mb-1.5">{item.title}</h3>
                    <p className="text-sm text-foreground font-bold leading-[1.75]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-10 text-center">
              <a
                href="/terms"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                קראו עוד על מדיניות האימות וההגנה שלנו
                <span aria-hidden>←</span>
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.6 }}>
          <FAQSection />
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.6 }}>
          <ContactSection />
        </motion.div>

        {/* CTA */}
        <motion.section id="cta" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.6 }} className="relative py-24 overflow-hidden">
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
              className="relative mx-auto max-w-4xl p-2 text-center md:p-4"
            >
              <div className="relative z-10">
                <h2 className="mb-5 text-3xl font-black text-foreground md:text-[3rem] leading-tight">
                  השבת הבאה שלכם
                  <br />
                  מתחילה כאן
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-foreground font-bold leading-[1.8]">
                  הצטרפו לקהילה שלנו ותמצאו את המקום המושלם לכל שבת וחג
                </p>
                <Button
                  onClick={handleCTA}
                  size="lg"
                  className="rounded-full px-8 h-12 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
                >
                  הצטרפו עכשיו — בחינם
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="border-t border-border/40 bg-transparent py-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-1.5 justify-center">
                <span className="text-lg font-black font-display">פל<span className="text-gradient-warm">״</span>א</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
                <a href="/terms" className="text-foreground hover:text-primary transition-colors">תקנון</a>
                <span className="text-foreground/60">|</span>
                <a href="/accessibility" className="text-foreground hover:text-primary transition-colors">הצהרת נגישות</a>
                <span className="text-foreground/60">|</span>
                <p className="text-foreground">
                  © 2026 פל״א — פשוט לבחור איפה. כל הזכויות שמורות
                </p>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
