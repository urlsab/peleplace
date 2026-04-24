import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Heart, Users, Target, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const HeroSection = () => {
  const navigate = useNavigate();
  const [communityOpen, setCommunityOpen] = useState(false);

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Soft dark vignette — stronger on mobile, subtle on desktop */}
      <div
        className="absolute inset-0 z-[1] md:hidden"
        style={{ background: "linear-gradient(180deg, hsla(210,18%,5%,0.35) 0%, hsla(210,18%,5%,0.55) 35%, hsla(210,18%,5%,0.55) 65%, hsla(210,18%,5%,0.25) 100%)" }}
      />
      <div
        className="absolute inset-0 z-[1] hidden md:block"
        style={{ background: "linear-gradient(to left, hsla(210,18%,5%,0.5) 20%, hsla(210,18%,5%,0.25) 50%, transparent 80%)" }}
      />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-20 right-10 h-60 w-60 rounded-full bg-secondary/10 blur-[80px]" />

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => setCommunityOpen(true)}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-cream/20 px-4 py-2 backdrop-blur-md border border-cream/25 hover:bg-cream/30 hover:border-cream/40 transition-all cursor-pointer group"
            >
              <Sparkles className="h-3.5 w-3.5 text-cream group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-medium text-cream tracking-wide">הקהילה שתמיד מחכה לכם</span>
              <span className="text-[10px] text-cream/70 group-hover:text-cream transition-colors">לחצו לסיפור המלא ←</span>
            </button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-[3.2rem] font-black leading-[1.1] tracking-tight md:text-[4.5rem] text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            תמיד יש לך
            <br />
            <span className="bg-gradient-to-l from-[hsl(20,50%,78%)] to-[hsl(155,30%,60%)] bg-clip-text text-transparent">
              איפה להיות.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 max-w-md text-base leading-relaxed text-cream-deep md:text-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
          >
            מחברים רווקים ורווקות למקומות חמים, אנשים מדהימים וחוויות משמעותיות — בכל שבת וחג.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              className="rounded-full text-sm font-bold px-7 h-11 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              onClick={() => navigate("/auth")}
            >
              מצאו את השבת שלכם
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full text-sm font-semibold px-7 h-11 bg-cream/10 border-cream/25 text-cream hover:bg-cream/20 hover:text-cream backdrop-blur-sm"
              onClick={() => navigate("/auth")}
            >
              אני רוצה לארח
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="h-5 w-5 text-cream/40" />
      </motion.div>

      <Dialog open={communityOpen} onOpenChange={setCommunityOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader className="text-right">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary tracking-wide">
                על הקהילה
              </span>
            </div>
            <DialogTitle className="text-2xl font-black font-display text-right leading-tight">
              פל״א — <span className="text-gradient-warm">פשוט לבחור איפה</span>
            </DialogTitle>
            <DialogDescription className="text-right text-sm text-muted-foreground">
              קהילה שמחברת בין אנשים, לבבות ובתים — בכל שבת וחג
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4 text-right">
            {/* החזון */}
            <div className="rounded-2xl border border-primary/15 p-5" style={{ background: "linear-gradient(160deg, hsla(155,30%,45%,0.12), hsla(60,20%,97%,0.6))" }}>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-bold font-display text-base">החזון</h3>
              </div>
              <p className="text-sm leading-[1.85] text-muted-foreground">
                שאף אחד לא ירגיש לבד בשבת או בחג. שלכל אדם — בכל גיל, בכל מצב, בכל מקום בארץ — תהיה
                <strong className="text-foreground"> בחירה </strong>
                איפה להיות, עם מי לחגוג, ואיך להרגיש שייך.
              </p>
            </div>

            {/* ההקמה */}
            <div className="rounded-2xl border border-secondary/15 p-5" style={{ background: "linear-gradient(170deg, hsla(20,50%,70%,0.15), hsla(60,20%,97%,0.6))" }}>
              <div className="flex items-center gap-2 mb-3">
                <Sprout className="h-5 w-5 text-secondary" />
                <h3 className="font-bold font-display text-base">איך זה התחיל</h3>
              </div>
              <p className="text-sm leading-[1.85] text-muted-foreground mb-3">
                פל״א נולד מתוך חוויה אישית של <strong className="text-foreground">אודיה עמרוסי</strong>, שהכירה מקרוב
                את הבדידות של רווקות ורווקים בשבתות וחגים. במקום לחכות שמישהו אחר יפתור — היא הקימה את הפלטפורמה שתמיד הייתה צריכה.
              </p>
              <p className="text-sm leading-[1.85] text-muted-foreground">
                היום פל״א הוא בית לקהילה גדלה והולכת של מארחים, מתנדבים, ארגונים ורווקות ורווקים שמחפשים מקום חם.
              </p>
            </div>

            {/* הערכים */}
            <div className="rounded-2xl border border-primary/15 p-5 bg-card/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="font-bold font-display text-base">הערכים שלנו</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { emoji: "🤝", title: "כבוד הדדי", desc: "כל אדם מתקבל כפי שהוא" },
                  { emoji: "🏡", title: "חמימות אמיתית", desc: "בית, לא רק כתובת" },
                  { emoji: "🔒", title: "ביטחון ואמון", desc: "תהליך אישור קפדני" },
                  { emoji: "✨", title: "פשטות", desc: "שלוש לחיצות עד שבת חמה" },
                ].map((v) => (
                  <div key={v.title} className="flex items-start gap-3 rounded-xl bg-background/50 p-3">
                    <span className="text-xl shrink-0">{v.emoji}</span>
                    <div>
                      <div className="font-bold text-sm">{v.title}</div>
                      <div className="text-xs text-muted-foreground">{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* הקהילה */}
            <div className="rounded-2xl border border-primary/15 p-5" style={{ background: "linear-gradient(180deg, hsla(155,30%,45%,0.1), hsla(60,20%,97%,0.5))" }}>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-bold font-display text-base">מי בקהילה</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li>💛 <strong className="text-foreground">רווקים ורווקות</strong> — מחפשים מקום חם להיות בו</li>
                <li>🏡 <strong className="text-foreground">משפחות מארחות</strong> — פותחות את הבית והלב</li>
                <li>🌱 <strong className="text-foreground">חוות וארגוני התנדבות</strong> — מקומות עם משמעות</li>
                <li>🕊️ <strong className="text-foreground">ארגוני שבתות</strong> — שבתות מאורגנות ומיוחדות</li>
                <li>💼 <strong className="text-foreground">מקומות עבודה</strong> — מלונות ובתי הארחה</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                className="rounded-full text-sm font-bold flex-1"
                onClick={() => {
                  setCommunityOpen(false);
                  navigate("/auth");
                }}
              >
                הצטרפו לקהילה
              </Button>
              <Button
                variant="outline"
                className="rounded-full text-sm font-semibold flex-1"
                onClick={() => {
                  setCommunityOpen(false);
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                קראו עוד עלינו
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
