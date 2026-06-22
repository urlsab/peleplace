import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const CONTACT_EMAIL = "yairsabag213@gmail.com";
const CONTACT_EMAIL2 = "support@peleplace.com";

const ContactSection = () => {
  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Warm blurred orbs */}
      <div className="absolute top-0 right-1/3 h-56 w-56 rounded-full bg-secondary/10 blur-[80px]" />
      <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-primary/8 blur-[60px]" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-display font-black leading-[1.1] mb-4">
            <span className="text-gradient-warm">צרו</span>{" "}
            <span>קשר.</span>
          </h2>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="max-w-md mx-auto flex flex-col gap-6"
          dir="rtl"
        >
          {/* פניות טכניות */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-4 bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border/40 shadow-card hover:border-primary/40 transition-colors group"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-muted-foreground mb-0.5">לתמיכה טכנית</span>
              <span className="font-semibold text-foreground">{CONTACT_EMAIL}</span>
            </div>
          </a>

          {/* פניות כלליות */}
          <a
            href={`mailto:${CONTACT_EMAIL2}`}
            className="flex items-center gap-4 bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border/40 shadow-card hover:border-secondary/40 transition-colors group"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <Mail className="h-6 w-6 text-secondary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-muted-foreground mb-0.5">לפניות כלליות</span>
              <span className="font-semibold text-foreground">{CONTACT_EMAIL2}</span>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
