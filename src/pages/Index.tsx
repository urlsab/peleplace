import { motion } from "framer-motion";
import { Briefcase, HandHeart, Home, Utensils } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import OpportunityCard from "@/components/OpportunityCard";

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
  {
    icon: Utensils,
    title: "חברה לארוחה",
    description: "מצאו בני גיל לאכול איתם ולבלות שבת ביחד",
    examples: ["ארוחת שישי", "סעודת שבת", "ארוחת חג"],
    color: "amber" as const,
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
  {
    title: "ארוחת שישי קהילתית",
    location: "תל אביב",
    date: "כל שבת",
    spots: 12,
    category: "חברה",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80",
  },
];

const stats = [
  { number: "2,500+", label: "רווקים ורווקות" },
  { number: "450+", label: "מארחים" },
  { number: "180+", label: "מקומות פעילים" },
  { number: "98%", label: "שביעות רצון" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Stats */}
      <section className="border-b border-border bg-card py-12">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-black font-display text-primary">{stat.number}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-black md:text-4xl">
              מה מתאים <span className="text-gradient-warm">לכם?</span>
            </h2>
            <p className="text-muted-foreground text-lg">בחרו את הדרך שלכם לשבת מושלמת</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <CategoryCard {...cat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section id="opportunities" className="bg-cream-deep py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-black md:text-4xl">הזדמנויות קרובות</h2>
            <p className="text-muted-foreground text-lg">השבת הבאה מחכה לכם</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <OpportunityCard {...opp} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 text-center md:p-16"
            style={{ background: "var(--gradient-warm)" }}
          >
            <h2 className="mb-4 text-3xl font-black text-primary-foreground md:text-4xl">
              השבת הבאה שלכם מתחילה כאן
            </h2>
            <p className="mx-auto mb-8 max-w-md text-lg text-primary-foreground/80">
              הצטרפו לקהילה שלנו ותמצאו את המקום המושלם לכל שבת וחג
            </p>
            <button className="rounded-full bg-background px-8 py-3 text-base font-bold text-foreground shadow-warm transition-transform hover:scale-105">
              הצטרפו עכשיו — בחינם
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 פל״א — פשוט לבחור איפה. כל הזכויות שמורות ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
