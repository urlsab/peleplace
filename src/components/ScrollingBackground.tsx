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
    const updateActiveLayer = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const isMobile = window.innerWidth < 768;
        const anchorY = window.innerHeight * (isMobile ? 0.38 : 0.5);

        const nextIndex = layers.reduce((currentIndex, layer, index) => {
          const section = document.getElementById(layer.id);
          if (!section) return currentIndex;

          const rect = section.getBoundingClientRect();
          const isAtAnchor = rect.top <= anchorY && rect.bottom >= anchorY;
          return isAtAnchor ? index : currentIndex;
        }, 0);

        setActiveIndex(nextIndex);
      });
    };

    updateActiveLayer();
    window.addEventListener("scroll", updateActiveLayer, { passive: true });
    window.addEventListener("resize", updateActiveLayer);

    return () => {
      window.removeEventListener("scroll", updateActiveLayer);
      window.removeEventListener("resize", updateActiveLayer);
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
