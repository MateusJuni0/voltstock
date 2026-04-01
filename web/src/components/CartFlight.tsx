"use client";

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createSpring,
  stepSpring,
  isAtRest,
  snapToRest,
  registerRender,
  kickScheduler,
} from "@/hooks/useSpring";

// ── Cart Flight Animation ────────────────────────────────────────
// When "Add to Cart" is clicked, a ghost image flies in an arc
// from the product to the cart icon using spring physics

interface FlightItem {
  id: string;
  imgSrc: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface CartFlightContextType {
  fireCartFlight: (opts: {
    imgSrc: string;
    startX: number;
    startY: number;
  }) => void;
}

const CartFlightContext = createContext<CartFlightContextType>({
  fireCartFlight: () => {},
});

export function useCartFlight() {
  return useContext(CartFlightContext);
}

export function CartFlightProvider({ children }: { children: ReactNode }) {
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const nextId = useRef(0);

  const fireCartFlight = useCallback(
    (opts: { imgSrc: string; startX: number; startY: number }) => {
      // Find cart icon position
      const cartBtn = document.querySelector('[aria-label="Carrinho"]');
      const cartRect = cartBtn?.getBoundingClientRect();
      const endX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 60;
      const endY = cartRect ? cartRect.top + cartRect.height / 2 : 40;

      const id = `flight-${nextId.current++}`;
      setFlights((prev) => [
        ...prev,
        { id, imgSrc: opts.imgSrc, startX: opts.startX, startY: opts.startY, endX, endY },
      ]);

      // Auto-remove after animation
      setTimeout(() => {
        setFlights((prev) => prev.filter((f) => f.id !== id));
      }, 900);
    },
    []
  );

  return (
    <CartFlightContext.Provider value={{ fireCartFlight }}>
      {children}
      {flights.map((flight) => (
        <FlightGhost key={flight.id} {...flight} />
      ))}
    </CartFlightContext.Provider>
  );
}

function FlightGhost({
  imgSrc,
  startX,
  startY,
  endX,
  endY,
}: FlightItem) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const springX = createSpring(startX, "wobbly");
    const springY = createSpring(startY, "wobbly");
    const springScale = createSpring(1, "snappy");
    const springOpacity = createSpring(1, "gentle");

    springX.dest = endX;
    springY.dest = endY;
    springScale.dest = 0.2;
    springOpacity.dest = 0;

    // Arc offset: midpoint goes up
    const midY = Math.min(startY, endY) - 80;
    let progress = 0;

    const unregister = registerRender(() => {
      for (let i = 0; i < 4; i++) {
        stepSpring(springX, 0.004);
        stepSpring(springY, 0.004);
        stepSpring(springScale, 0.004);
        stepSpring(springOpacity, 0.004);
      }

      // Calculate arc: parabolic Y offset
      const totalDist = Math.abs(endX - startX) || 1;
      const currentDist = Math.abs(springX.pos - startX);
      progress = Math.min(currentDist / totalDist, 1);
      const arcOffset = -4 * (midY - startY) * progress * (1 - progress);

      el.style.transform = `translate3d(${springX.pos - 28}px, ${springY.pos + arcOffset - 28}px, 0) scale(${springScale.pos})`;
      el.style.opacity = `${Math.max(0, springOpacity.pos)}`;

      if (isAtRest(springX) && isAtRest(springY)) {
        snapToRest(springX);
        snapToRest(springY);
        snapToRest(springScale);
        snapToRest(springOpacity);
        return false;
      }
      return true;
    });

    kickScheduler();

    return () => {
      unregister();
    };
  }, [startX, startY, endX, endY]);

  return (
    <div
      ref={elRef}
      className="fixed top-0 left-0 z-[9000] pointer-events-none w-14 h-14 rounded-xl overflow-hidden shadow-2xl shadow-orange-500/50 border border-orange-500/30"
      style={{ willChange: "transform, opacity" }}
    >
      <img src={imgSrc} alt="" className="w-full h-full object-cover" />
    </div>
  );
}
