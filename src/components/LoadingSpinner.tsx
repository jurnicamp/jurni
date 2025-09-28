import { motion } from 'framer-motion'
import { TreePine, Mountain, Compass } from 'lucide-react'
import React

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingSpinner({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Main spinning element */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-emerald-200 border-t-emerald-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating outdoor elements */}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <TreePine className="w-4 h-4 text-emerald-400" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-1 -left-2"
          animate={{ 
            y: [0, 6, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Mountain className="w-3 h-3 text-blue-400" />
        </motion.div>
        
        <motion.div
          className="absolute top-1/2 -left-3"
          animate={{ 
            x: [0, 8, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Compass className="w-3 h-3 text-purple-400" />
        </motion.div>
      </div>
      
      {text && (
        <motion.p
          className={`text-gray-600 dark:text-gray-300 font-medium ${textSizeClasses[size]}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
