import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  examples: string[];
  color: "primary" | "secondary" | "terracotta" | "amber";
}

const colorMap = {
  primary: "bg-accent text-accent-foreground border-primary/20",
  secondary: "bg-olive-light text-secondary border-secondary/20",
  terracotta: "bg-accent text-terracotta border-terracotta/20",
  amber: "bg-accent text-amber-soft border-amber-soft/20",
};

const iconBgMap = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  terracotta: "bg-terracotta text-primary-foreground",
  amber: "bg-amber-soft text-primary-foreground",
};

const CategoryCard = ({ icon: Icon, title, description, examples, color }: CategoryCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group cursor-pointer rounded-2xl bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover border border-border"
    >
      <div className={`mb-4 inline-flex rounded-xl p-3 ${iconBgMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-xl font-bold font-display">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <span
            key={example}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${colorMap[color]}`}
          >
            {example}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryCard;
