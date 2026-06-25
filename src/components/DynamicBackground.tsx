// Static background images
import candlesImg from "@/assets/bg-candles.jpg";
import jerusalemImg from "@/assets/bg-jerusalem.jpg";
import fieldsImg from "@/assets/bg-fields.jpg";
import shabbatTableImg from "@/assets/bg-shabbat-table.jpg";
import seaImg from "@/assets/bg-sea.jpg";
import vineyardImg from "@/assets/bg-vineyard.jpg";

export type BackgroundVariant =
  | "candles"
  | "jerusalem"
  | "fields"
  | "shabbat-table"
  | "sea"
  | "vineyard";

const SOURCES: Record<BackgroundVariant, string> = {
  candles: candlesImg,
  jerusalem: jerusalemImg,
  fields: fieldsImg,
  "shabbat-table": shabbatTableImg,
  sea: seaImg,
  vineyard: vineyardImg,
};

interface DynamicBackgroundProps {
  variant: BackgroundVariant;
  /** Overlay opacity (0-1). Default 0.2 for content readability. */
  overlayOpacity?: number;
}

/**
 * Full-page static background image.
 * Renders behind page content (z-index: -10) with a cream overlay for readability.
 */
const DynamicBackground = ({ variant, overlayOpacity = 0.2 }: DynamicBackgroundProps) => {
  const image = SOURCES[variant];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      {/* Cream-tinted overlay for content readability */}
      <div
        className="absolute inset-0 bg-cream"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
};

export default DynamicBackground;
