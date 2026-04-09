import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-[1]" style={{ backgroundColor: "hsla(210, 18%, 8%, 0.6)" }} />

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
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-cream/20 px-4 py-2 backdrop-blur-md border border-cream/25">
              <span className="text-xs font-medium text-cream tracking-wide">הקהילה שתמיד מחכה לכם</span>
            </div>
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
    </section>
  );
};

export default HeroSection;
