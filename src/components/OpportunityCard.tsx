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
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-shadow border border-border"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            {category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="mb-2 text-lg font-bold font-display">{title}</h4>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            <span>{spots} מקומות פנויים</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
