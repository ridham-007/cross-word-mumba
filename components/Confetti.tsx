"use client";

import { useEffect, useState } from "react";

export default function Confetti() {
  const [pieces, setPieces] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    // Create confetti pieces
    const colors = [
      "#00e5e5", "#00bcd4", "#03a9f4", "#2196f3",
      "#3f51b5", "#673ab7", "#9c27b0", "#e91e63",
      "#f44336", "#ff9800", "#ffc107", "#ffeb3b",
    ];
    
    const createPieces = () => {
      const newPieces: JSX.Element[] = [];
      const numPieces = 150;
      
      for (let i = 0; i < numPieces; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 0.8 + 0.4; // Between 0.4 and 1.2rem
        const x = Math.random() * 100; // position X (0-100%)
        const y = -5 - Math.random() * 10; // start above the viewport
        const duration = Math.random() * 3 + 2; // animation duration
        const delay = Math.random() * 0.5; // animation delay
        
        // Random rotation for more natural movement
        const rotation = Math.random() * 360;
        
        newPieces.push(
          <div
            key={i}
            className="absolute z-[9999]"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}rem`,
              height: `${size}rem`,
              backgroundColor: color,
              borderRadius: Math.random() > 0.2 ? "50%" : "0", // Mix circles and squares
              animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
              transform: `rotate(${rotation}deg)`,
              opacity: Math.random() * 0.7 + 0.3, // Random opacity
            }}
          />
        );
      }
      
      return newPieces;
    };
    
    setPieces(createPieces());
    
    // Add CSS animation to the document
    const style = document.createElement("style");
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotate(0);
          opacity: 1;
        }
        100% {
          transform: translateY(${window.innerHeight}px) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces}
    </div>
  );
}