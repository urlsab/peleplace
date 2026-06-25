import { motion } from "framer-motion";
import { Home, Star, Heart, Sun, CalendarPlus, Quote } from "lucide-react";
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
import catappLogo from "@/assets/catapp-logo.png";
import peleTextsLogo from "@/assets/pele_texts-removebg-preview.png";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const backgroundLayers = [
  {
    id: "hero",
    image: heroImage,
    overlayStyle: {
      background:
        "linear-gradient(to left, hsla(357,52%,10%,0.84) 20%, hsla(357,44%,12%,0.6) 50%, hsla(357,40%,14%,0.24) 100%)",
    },
  },

  // כהה מעט יותר כדי שהטקסט יבלוט
  {
    id: "opportunities",
    image: categoriesBg,
    overlayStyle: {
      backgroundColor: "hsla(357,44%,12%,0.24)",
      backdropFilter: "blur(1px)",
    },
  },

  // כהה מעט יותר
  {
    id: "about",
    image: aboutWarmBg,
    overlayStyle: {
      backgroundColor: "hsla(357,38%,12%,0.2)",
      backdropFilter: "blur(1px)",
    },
  },

  {
    id: "faq",
    image: warmLandscapeBg,
    overlayStyle: {
      backgroundColor: "hsla(357,38%,12%,0.22)",
      backdropFilter: "blur(1px)",
    },
  },

  {
    id: "contact",
    image: shabbatTableBg,
    overlayStyle: {
      backgroundColor: "hsla(357,44%,12%,0.26)",
      backdropFilter: "blur(1px)",
    },
  },

  // CTA מעט כהה יותר כדי לתת דרמטיות
  {
    id: "cta",
    image: shabbatTableBg,
    overlayStyle: {
      backgroundColor: "hsla(357,46%,12%,0.26)",
      backdropFilter: "blur(1px)",
    },
  },
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
              style={{ background: "linear-gradient(135deg, hsla(357,92%,34%,0.12), hsla(14,88%,62%,0.1))" }}
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

            {/* Asymmetric layout: image and text interlock instead of sitting in separate boxes */}
            <div className="relative grid gap-y-10 md:grid-cols-[1.05fr_1fr] items-start max-w-6xl mx-auto">
              {/* Connector glow — bridges the two columns visually */}
              <div className="hidden md:block absolute top-1/3 left-1/2 -translate-x-1/2 w-[26rem] h-[26rem] rounded-full bg-secondary/20 blur-[90px] pointer-events-none z-0" />

              {/* Image column */}
              <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }} className="md:order-2 self-start relative z-10">
                <div className="relative -rotate-1">
                  <img
                    src={founderPhoto}
                    alt="אודיה, יוסף חיים ופלא — המשפחה מאחורי הפרויקט"
                    className="w-full rounded-tl-xl rounded-tr-[4rem] rounded-bl-[4rem] rounded-br-xl shadow-card object-cover aspect-[4/5]"
                    loading="lazy"
                    width={800}
                    height={1000}
                  />
                  {/* Caption tag floating over image */}
                  <div className="absolute left-1/2 bottom-4 -translate-x-1/2 bg-cream rounded-full px-5 py-2.5 shadow-card border border-border/40 rotate-1">
                    <span className="text-xs font-bold text-foreground text-center block">יוסף חיים, פלא ואודיה💛</span>
                  </div>
                </div>
              </motion.div>

              {/* Text column — frosted panel that overlaps the image so the two interlock */}
              <motion.div
                {...fadeUp}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="md:order-1 self-start relative z-20 md:-ml-14 lg:-ml-20"
              >
                <div className="relative rounded-tl-[3rem] rounded-tr-xl rounded-bl-xl rounded-br-[3rem] bg-cream/90 backdrop-blur-md border border-white/50 shadow-card p-7 md:p-10 space-y-6 text-right">
                  <Quote className="absolute -top-5 right-8 h-12 w-12 text-secondary/15 rotate-180" />

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
                </div>

                {/* The need — flowing tags instead of a square grid */}
                {/* <div className="pt-10 mt-8">
                  <div className="flex flex-wrap gap-3 justify-end">
                    {[
                      { emoji: "💛", title: "רווקים ורווקות", desc: "מקום חם בשבתות וחגים", rotate: "rotate-1" },
                      { emoji: "🏡", title: "זוגות ומשפחות", desc: "לפתוח את הדלת ולהכיל", rotate: "-rotate-1" },
                      { emoji: "🌱", title: "חוות והתנדבות", desc: "עזרה עם לב ומשמעות", rotate: "rotate-1" },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className={`flex items-center gap-3 bg-cream/80 backdrop-blur-sm rounded-full px-5 py-3 shadow-card border border-white/40 ${item.rotate} hover:rotate-0 transition-transform`}
                      >
                        <span className="text-2xl shrink-0">{item.emoji}</span>
                        <div className="text-right">
                          <div className="font-bold font-display text-sm leading-tight">{item.title}</div>
                          <div className="text-xs text-foreground/80 font-bold mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Registration Cards */}
        <motion.div id="you" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <RegistrationCards />
        </motion.div>

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
                <h2 className="mb-5 text-3xl font-black text-white md:text-[3rem] leading-tight">
                  השבת הבאה שלכם
                  <br />
                  מתחילה כאן
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-white font-bold leading-[1.8]">
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
        <motion.footer initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-transparent py-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-1.5 justify-center">
                <img src={peleTextsLogo} alt='פל"א - פשוט לבחור איפה' className="h-7 w-auto object-contain" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
                <a href="/terms" className="text-white hover:text-primary transition-colors">תקנון</a>
                <span className="text-white/60">|</span>
                {/* <a href="/accessibility" className="text-white hover:text-primary transition-colors">הצהרת נגישות</a>
                <span className="text-white/60">|</span> */}
                <p className="text-white">© 2026 כל הזכויות שמורות</p>
                <span className="text-white/60">|</span>
                <p className="text-white">
                  <a
              href="https://catapp.it.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity"
            >
              בניהול 
              <img src={catappLogo} alt="catapp" className="h-5 w-auto" style={{marginRight:'4px'}} />
               
              </a>
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
