import { motion } from "framer-motion";
import { Heart, Users, Target, Sprout, Quote, Sparkles } from "lucide-react";
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
    <section id="hero" className="relative min-h-[96vh] flex items-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-20 right-10 h-60 w-60 rounded-full bg-secondary/10 blur-[80px]" />

      <div className="container relative z-10 mx-auto px-6 py-20 md:py-24">
        <div className="max-w-2xl mt-6 md:mt-10">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-[3.2rem] font-black leading-[1.1] tracking-tight md:text-[4.5rem] text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            תמיד יש לך
            <br />
            <span className="text-gradient-warm">
              איפה להיות.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 max-w-md text-base leading-relaxed text-cream font-bold md:text-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
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

      <Dialog open={communityOpen} onOpenChange={setCommunityOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" dir="rtl">
          {/* Hero header with gradient */}
          <div
            className="relative px-6 pt-8 pb-10 rounded-t-lg overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsla(25,80%,51%,0.15), hsla(155,30%,45%,0.12) 60%, hsla(20,50%,70%,0.18))" }}
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-secondary/10 blur-3xl" />
            <DialogHeader className="text-right relative">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold text-primary tracking-wide">
                  ✨ על הקהילה
                </span>
              </div>
              <DialogTitle className="text-3xl font-black font-display text-right leading-tight">
                פל״א — <span className="text-gradient-warm">פשוט לבחור איפה</span>
              </DialogTitle>
              <DialogDescription className="text-right text-sm text-foreground font-bold mt-2">
                קהילה שמחברת בין אנשים, לבבות ובתים — בכל שבת וחג
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 pb-6 space-y-8 text-right">
            {/* ציטוט מודגש - החזון */}
            <div className="relative pt-4">
              <Quote className="absolute -top-1 right-0 h-8 w-8 text-primary/20 rotate-180" />
              <div className="pr-10">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">החזון</span>
                </div>
                <p className="text-lg font-display leading-[1.7] text-foreground">
                  שאף אחד לא ירגיש לבד בשבת או בחג.
                  <br />
                  שלכל אדם תהיה <span className="text-gradient-warm font-bold">בחירה</span> איפה להיות,
                  עם מי לחגוג, ואיך להרגיש שייך.
                </p>
              </div>
            </div>

            {/* קו מפריד עדין */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/20 to-transparent" />
              <Sparkles className="h-3 w-3 text-primary/40" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>

            {/* סיפור - ציר זמן */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="h-4 w-4 text-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">איך הכל התחיל</span>
              </div>
              <div className="relative pr-6 border-r-2 border-dashed border-secondary/30 space-y-5">
                <div className="relative">
                  <div className="absolute -right-[29px] top-1 h-4 w-4 rounded-full bg-secondary border-4 border-background" />
                  <p className="text-sm leading-[1.85] text-foreground font-bold">
                    פל״א נולד מתוך חוויה אישית של <strong className="text-foreground">אודיה עמרוסי</strong>,
                    שהכירה מקרוב את הבדידות של רווקות ורווקים בשבתות וחגים.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -right-[29px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                  <p className="text-sm leading-[1.85] text-foreground font-bold">
                    במקום לחכות שמישהו אחר יפתור — היא הקימה את הפלטפורמה שתמיד הייתה צריכה להתקיים.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -right-[29px] top-1 h-4 w-4 rounded-full bg-accent border-4 border-background" />
                  <p className="text-sm leading-[1.85] text-foreground font-bold">
                    היום פל״א הוא <strong className="text-foreground">בית לקהילה גדלה והולכת</strong> של
                    מארחים, מתנדבים, ארגונים ורווקות ורווקים שמחפשים מקום חם.
                  </p>
                </div>
              </div>
            </div>

            {/* הערכים - שורה אופקית של אייקונים גדולים */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">הערכים שמובילים אותנו</span>
              </div>
              <div className="flex flex-wrap justify-between gap-y-5 gap-x-3">
                {[
                  { emoji: "🤝", title: "כבוד הדדי" },
                  { emoji: "🏡", title: "חמימות" },
                  { emoji: "🔒", title: "ביטחון" },
                  { emoji: "✨", title: "פשטות" },
                ].map((v) => (
                  <div key={v.title} className="flex flex-col items-center gap-2 flex-1 min-w-[70px]">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/15 shadow-sm">
                      {v.emoji}
                    </div>
                    <span className="text-xs font-bold text-foreground text-center">{v.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* קו מפריד */}
            <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent" />

            {/* מי בקהילה - רשימה זורמת */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">מי בקהילה</span>
              </div>
              <p className="text-sm leading-[1.95] text-foreground font-bold">
                הקהילה שלנו מורכבת מ
                <strong className="text-foreground"> רווקים ורווקות 💛</strong> שמחפשים מקום חם להיות בו,
                <strong className="text-foreground"> משפחות מארחות 🏡</strong> שפותחות את הבית והלב,
                <strong className="text-foreground"> חוות וארגוני התנדבות 🌱</strong> שמציעים מקומות עם משמעות,
                <strong className="text-foreground"> ארגוני שבתות 🕊️</strong> שמפיקים שבתות מאורגנות ומיוחדות, ו
                <strong className="text-foreground">מקומות עבודה 💼</strong> כמו מלונות ובתי הארחה.
              </p>
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
