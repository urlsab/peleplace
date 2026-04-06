import { motion } from "framer-motion";
import { LucideIcon, ArrowUpLeft } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  examples: string[];
  color: "primary" | "secondary" | "terracotta" | "amber";
}

const iconBgMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  terracotta: "bg-[hsl(24,75%,52%)]/10 text-[hsl(24,75%,52%)]",
  amber: "bg-[hsl(14,70%,60%)]/10 text-[hsl(14,70%,60%)]",
};

const accentLine = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  terracotta: "bg-[hsl(24,75%,52%)]",
  amber: "bg-[hsl(14,70%,60%)]",
};

const CategoryCard = ({ icon: Icon, title, description, examples, color }: CategoryCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative cursor-pointer rounded-2xl bg-card p-6 shadow-card hover:shadow-hover transition-all duration-300 border border-border/60 overflow-hidden"
    >
      {/* Accent line */}
      <div className={`absolute top-0 right-0 left-0 h-[3px] ${accentLine[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex rounded-xl p-2.5 ${iconBgMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpLeft className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors -rotate-90" />
      </div>
      <h3 className="mb-2 text-lg font-bold font-display">{title}</h3>
      <p className="mb-5 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {examples.map((example) => (
          <span
            key={example}
            className="rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
          >
            {example}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryCard;