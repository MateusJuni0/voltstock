"use client";
import React, { useEffect, useRef, useState, useId } from 'react';

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: 'R' | 'G' | 'B' | 'A';
  yChannel?: 'R' | 'G' | 'B' | 'A';
  className?: string;
}

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width = '100%',
  height = '100%',
  borderRadius = 16,
  borderWidth = 0.5,
  brightness = 1.0,
  opacity = 0.2,
  blur = 20,
  backgroundOpacity = 0.05,
  className = '',
}) => {
  const id = useId();
  const filterId = `glass-filter-${id.replace(/:/g, '')}`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius: `${borderRadius}px`,
      }}
    >
      {/* Background with blur */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: `blur(${blur}px) brightness(${brightness})`,
          WebkitBackdropFilter: `blur(${blur}px) brightness(${brightness})`,
          backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
          opacity,
          borderRadius: `${borderRadius}px`,
          border: `${borderWidth}px solid rgba(255, 255, 255, 0.1)`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default GlassSurface;