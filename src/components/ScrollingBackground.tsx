import { useEffect, useRef, useState } from "react";

interface BackgroundLayer {
  id: string;
  image: string;
  overlayStyle: React.CSSProperties;
}

const ScrollingBackground = ({ layers }: { layers: BackgroundLayer[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const sections = layers.map((l) => document.getElementById(l.id));

    const observer = new IntersectionObserver(
      (entries) => {
        // Cancel any pending RAF update
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
          let bestIndex = activeIndex;
          let bestRatio = 0;

          entries.forEach((entry) => {
            const idx = layers.findIndex((l) => l.id === entry.target.id);
            if (idx !== -1 && entry.intersectionRatio > bestRatio) {
              bestRatio = entry.intersectionRatio;
              bestIndex = idx;
            }
          });

          if (bestRatio > 0.05) {
            setActiveIndex(bestIndex);
          }
        });
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [layers]);

  return (
    <div className="fixed inset-0 z-0 h-[100dvh]">
      {layers.map((layer, i) => (
        <div
          key={layer.id}
          className="absolute inset-0"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            transition: "opacity 0.4s ease-out",
            willChange: "opacity",
          }}
        >
          <img
            src={layer.image}
            alt=""
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            width={1920}
            height={1080}
            style={{ transform: "translateZ(0)" }}
          />
          <div className="absolute inset-0" style={layer.overlayStyle} />
        </div>
      ))}
    </div>
  );
};

export default ScrollingBackground;
