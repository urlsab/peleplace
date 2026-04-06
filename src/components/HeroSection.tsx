import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-shabbat.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="שקיעה ושבת" width={1920} height={1024} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

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
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/15">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs font-medium text-white/80 tracking-wide">הקהילה שתמיד מחכה לכם</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-[3.2rem] font-black leading-[1.1] tracking-tight md:text-[4.5rem] text-white"
          >
            תמיד יש לך
            <br />
            <span className="bg-gradient-to-l from-[hsl(14,75%,72%)] to-[hsl(168,45%,60%)] bg-clip-text text-transparent">
              איפה להיות.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
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
              className="rounded-full text-sm font-semibold px-7 h-11 bg-white/8 border-white/20 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm"
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
        <ArrowDown className="h-5 w-5 text-white/40" />
      </motion.div>
    </section>
  );
};

export default HeroSection;