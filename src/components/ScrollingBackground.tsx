import { useEffect, useState } from "react";

interface BackgroundLayer {
  id: string;
  image: string;
  overlayStyle: React.CSSProperties;
}

const ScrollingBackground = ({ layers }: { layers: BackgroundLayer[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sections = layers.map((l) => document.getElementById(l.id));

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let maxIndex = activeIndex;
        entries.forEach((entry) => {
          const idx = layers.findIndex((l) => l.id === entry.target.id);
          if (idx !== -1 && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            maxIndex = idx;
          }
        });
        if (maxRatio > 0.15) {
          setActiveIndex(maxIndex);
        }
      },
      {
        threshold: [0, 0.15, 0.3, 0.5, 0.7, 1],
      }
    );

    sections.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [layers]);

  return (
    <div className="fixed inset-0 z-0">
      {layers.map((layer, i) => (
        <div
          key={layer.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        >
          <img
            src={layer.image}
            alt=""
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0" style={layer.overlayStyle} />
        </div>
      ))}
    </div>
  );
};

export default ScrollingBackground;
