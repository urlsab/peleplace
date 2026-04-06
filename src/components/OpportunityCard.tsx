import { motion } from "framer-motion";
import { MapPin, Calendar, Users } from "lucide-react";

interface OpportunityCardProps {
  title: string;
  location: string;
  date: string;
  spots: number;
  category: string;
  image: string;
}

const OpportunityCard = ({ title, location, date, spots, category, image }: OpportunityCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-hover transition-all duration-300 border border-border/60"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm">
            {category}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
            {spots} מקומות פנויים
          </span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="mb-3 text-base font-bold font-display">{title}</h4>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;