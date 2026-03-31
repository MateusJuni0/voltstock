"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuToggle?: () => void;
}

const PillNav: React.FC<PillNavProps> = ({
  logo = "",
  logoAlt = "Logo",
  items,
  activeHref,
  className = '',
  ease = 'hop',
  baseColor = 'transparent',
  pillColor = '#000000',
  hoveredPillTextColor = '#ffffff',
  pillTextColor = '#000000',
  onMobileMenuToggle
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeItem, setActiveItem] = useState<number>(() => {
    const index = items.findIndex(item => item.href === activeHref);
    return index !== -1 ? index : 0;
  });

  useEffect(() => {
    if (activeHref) {
      const index = items.findIndex(item => item.href === activeHref);
      if (index !== -1) setActiveItem(index);
    }
  }, [activeHref, items]);

  useEffect(() => {
    gsap.registerPlugin();
    // Custom "hop" ease simulation or use standard power
    const customEase = ease === 'hop' ? "power4.out" : ease;

    const updatePill = (index: number, animate = true) => {
      const item = itemsRef.current[index];
      if (!item || !pillRef.current) return;

      const { offsetLeft, offsetWidth } = item;
      
      if (animate) {
        gsap.to(pillRef.current, {
          left: offsetLeft,
          width: offsetWidth,
          duration: 0.6,
          ease: customEase
        });
      } else {
        gsap.set(pillRef.current, {
          left: offsetLeft,
          width: offsetWidth
        });
      }
    };

    updatePill(activeItem, false);

    const handleResize = () => updatePill(activeItem, false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeItem, ease]);

  const handleMouseEnter = (index: number) => {
    const item = itemsRef.current[index];
    if (!item || !pillRef.current) return;

    const { offsetLeft, offsetWidth } = item;
    gsap.to(pillRef.current, {
      left: offsetLeft,
      width: offsetWidth,
      duration: 0.6,
      ease: ease === 'hop' ? "power4.out" : ease
    });
  };

  const handleMouseLeave = () => {
    const item = itemsRef.current[activeItem];
    if (!item || !pillRef.current) return;

    const { offsetLeft, offsetWidth } = item;
    gsap.to(pillRef.current, {
      left: offsetLeft,
      width: offsetWidth,
      duration: 0.6,
      ease: ease === 'hop' ? "power4.out" : ease
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center rounded-full px-2 py-2 ${className}`}
      style={{ backgroundColor: baseColor }}
    >
      {logo && (
        <Link href="/" className="mr-4 ml-2">
          <img src={logo} alt={logoAlt} className="h-8 w-auto" />
        </Link>
      )}

      <div className="relative flex items-center">
        <div
          ref={pillRef}
          className="absolute h-full rounded-full z-0 pointer-events-none"
          style={{ backgroundColor: pillColor, top: 0 }}
        />
        
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => { itemsRef.current[index] = el; }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => setActiveItem(index)}
            className="relative z-10 px-6 py-2 text-sm font-medium transition-colors duration-300"
            style={{ 
              color: activeItem === index ? hoveredPillTextColor : pillTextColor,
              fontFamily: 'var(--font-outfit)'
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PillNav;