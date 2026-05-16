'use client'

import { motion } from 'framer-motion'

interface ButterflyProps {
  size?: 'sm' | 'md' | 'lg'
  x?: number
  y?: number
  delay?: number
}

export default function Butterfly({ 
  size = 'md', 
  x = 0, 
  y = 0, 
  delay = 0 
}: ButterflyProps) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
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
        y: [0, -20, 0, -15, 0],
        x: [0, 10, 0, -8, 0],
        rotate: [0, 3, 0, -2, 0],
      }}
      transition={{
        duration: 8 + delay * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="butterflyMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7029ee" />
            <stop offset="50%" stopColor="#bea0ff" />
            <stop offset="100%" stopColor="#f6f0ff" />
          </linearGradient>
          <linearGradient id="butterflyAccent" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5e1fc9" />
            <stop offset="100%" stopColor="#a87eff" />
          </linearGradient>
        </defs>
        
        <ellipse cx="50" cy="50" rx="6" ry="10" fill="#3e1a80" />
        
        <path 
          d="M50 35 Q75 20 82 45 Q65 40 50 35" 
          fill="url(#butterflyMain)" 
          opacity="0.9"
        />
        <path 
          d="M50 35 Q70 35 68 55 Q55 50 50 35" 
          fill="url(#butterflyAccent)" 
          opacity="0.85"
        />
        <path 
          d="M50 35 Q25 20 18 45 Q35 40 50 35" 
          fill="url(#butterflyAccent)" 
          opacity="0.9"
        />
        <path 
          d="M50 35 Q30 35 32 55 Q45 50 50 35" 
          fill="url(#butterflyMain)" 
          opacity="0.85"
        />
        
        <path d="M50 65 Q48 80 50 95" stroke="#3e1a80" strokeWidth="2" fill="none" />
        <circle cx="50" cy="50" r="1.5" fill="#fff" />
      </svg>
    </motion.div>
  )
}
