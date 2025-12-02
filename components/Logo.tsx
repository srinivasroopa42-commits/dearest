
import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-auto", color = "currentColor" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 120"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bra Icon */}
      <g transform="translate(50, 10) scale(1)">
        {/* Left Strap */}
        <path d="M 25 5 L 25 25" strokeWidth="3" />
        {/* Right Strap */}
        <path d="M 75 5 L 75 25" strokeWidth="3" />
        
        {/* Cups Outline */}
        <path 
          d="M 25 25 
             C 25 55, 48 55, 50 45 
             C 52 55, 75 55, 75 25" 
          strokeWidth="3"
        />
        
        {/* Inner Cup Detail (Optional for style) */}
        <path 
          d="M 25 25 C 25 45, 45 45, 48 35" 
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path 
          d="M 75 25 C 75 45, 55 45, 52 35" 
          strokeWidth="1.5"
          opacity="0.6"
        />
        
        {/* Center Connection */}
        <path d="M 48 35 Q 50 40 52 35" strokeWidth="2" />
      </g>

      {/* Brand Text */}
      <text
        x="100"
        y="95"
        textAnchor="middle"
        fontFamily='"Playfair Display", serif'
        fontSize="38"
        fontWeight="bold"
        fill={color}
        stroke="none"
        letterSpacing="0.1em"
      >
        DEAREST
      </text>
    </svg>
  );
};
