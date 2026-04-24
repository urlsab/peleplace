import { useIsMobile } from "@/hooks/use-mobile";

// Video assets (CDN-hosted .mp4)
import candlesVideo from "@/assets/video-candles.mp4.asset.json";
import jerusalemVideo from "@/assets/video-jerusalem.mp4.asset.json";
import fieldsVideo from "@/assets/video-fields.mp4.asset.json";
import shabbatTableVideo from "@/assets/video-shabbat-table.mp4.asset.json";
import seaVideo from "@/assets/video-sea.mp4.asset.json";
import vineyardVideo from "@/assets/video-vineyard.mp4.asset.json";

// Static fallback images for mobile
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

const SOURCES: Record<BackgroundVariant, { video: string; image: string }> = {
  candles: { video: candlesVideo.url, image: candlesImg },
  jerusalem: { video: jerusalemVideo.url, image: jerusalemImg },
  fields: { video: fieldsVideo.url, image: fieldsImg },
  "shabbat-table": { video: shabbatTableVideo.url, image: shabbatTableImg },
  sea: { video: seaVideo.url, image: seaImg },
  vineyard: { video: vineyardVideo.url, image: vineyardImg },
};

interface DynamicBackgroundProps {
  variant: BackgroundVariant;
  /** Overlay opacity (0-1). Default 0.75 for content readability. */
  overlayOpacity?: number;
}

/**
 * Full-page animated background.
 * - Desktop: looping video.
 * - Mobile: static image (saves bandwidth).
 * Renders behind page content (z-index: -10) with a cream overlay for readability.
 */
const DynamicBackground = ({ variant, overlayOpacity = 0.75 }: DynamicBackgroundProps) => {
  const isMobile = useIsMobile();
  const { video, image } = SOURCES[variant];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {isMobile ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      ) : (
        <video
          key={video}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          poster={image}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* Cream-tinted overlay for content readability */}
      <div
        className="absolute inset-0 bg-cream"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
};

export default DynamicBackground;
