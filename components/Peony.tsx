'use client'

import { motion } from 'framer-motion'

interface PeonyProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  x?: number
  y?: number
  delay?: number
}

export default function Peony({ 
  size = 'md', 
  x = 0, 
  y = 0, 
  delay = 0 
}: PeonyProps) {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-56 h-56',
  }

  return (
    <motion.div
      className={`absolute pointer-events-none ${sizes[size]}`}
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)' 
      }}
      animate={{
        y: [0, -15, 0, -10, 0],
        rotate: [0, 2, 0, -1, 0],
      }}
      transition={{
        duration: 10 + delay * 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <defs>
          <radialGradient id="peonyLight" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="50%" stopColor="#f6f0ff" />
            <stop offset="100%" stopColor="#d8c4ff" />
          </radialGradient>
          <radialGradient id="peonyDark" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#d8c4ff" />
            <stop offset="100%" stopColor="#8b4fff" />
          </radialGradient>
        </defs>
        
        <ellipse cx="60" cy="60" rx="45" ry="48" fill="url(#peonyDark)" opacity="0.8" />
        <ellipse cx="55" cy="55" rx="35" ry="38" fill="url(#peonyLight)" opacity="0.9" />
        <ellipse cx="60" cy="60" rx="22" ry="24" fill="#f6f0ff" opacity="0.95" />
        
        <circle cx="60" cy="60" r="10" fill="#fbbf24" opacity="0.7" />
        <circle cx="55" cy="55" r="3" fill="#d97706" opacity="0.8" />
        <circle cx="65" cy="58" r="2.5" fill="#d97706" opacity="0.7" />
        <circle cx="60" cy="68" r="2.8" fill="#d97706" opacity="0.75" />
        
        <ellipse cx="40" cy="42" rx="15" ry="18" fill="url(#peonyDark)" opacity="0.7" transform="rotate(-25 40 42)" />
        <ellipse cx="80" cy="45" rx="14" ry="17" fill="url(#peonyLight)" opacity="0.65" transform="rotate(20 80 45)" />
        <ellipse cx="38" cy="75" rx="12" ry="15" fill="url(#peonyDark)" opacity="0.7" transform="rotate(25 38 75)" />
      </svg>
    </motion.div>
  )
}
