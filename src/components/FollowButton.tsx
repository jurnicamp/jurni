'use client'

import { motion } from 'framer-motion'
import { UserPlus, UserMinus, Users } from 'lucide-react'
import { useState } from 'react'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollow: (userId: string, isFollowing: boolean) => void
  variant?: 'default' | 'compact' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  showFollowerCount?: boolean
  followerCount?: number
}

export function FollowButton({ 
  userId, 
  isFollowing, 
  onFollow, 
  variant = 'default',
  size = 'md',
  disabled = false,
  showFollowerCount = false,
  followerCount = 0
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    try {
      await onFollow(userId, isFollowing)
    } finally {
      setIsLoading(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-8 py-3 text-lg'
      default:
        return 'px-6 py-2 text-base'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3'
      case 'lg':
        return 'w-6 h-6'
      default:
        return 'w-4 h-4'
    }
  }

  if (variant === 'icon') {
    return (
      <motion.button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          p-2 rounded-full transition-all duration-300 
          ${isFollowing 
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400'
            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
          }
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.1 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.9 }}
      >
        {isLoading ? (
          <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-emerald-500 ${getIconSize()}`} />
        ) : isFollowing ? (
          <UserMinus className={getIconSize()} />
        ) : (
          <UserPlus className={getIconSize()} />
        )}
      </motion.button>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <motion.button
          onClick={handleClick}
          disabled={disabled || isLoading}
          className={`
            ${getSizeClasses()} rounded-lg font-medium transition-all duration-300 flex items-center space-x-2
            ${isFollowing
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow-md'
            }
            ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
          whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <div className={`animate-spin rounded-full border-2 border-white border-t-transparent ${getIconSize()}`} />
          ) : isFollowing ? (
            <UserMinus className={getIconSize()} />
          ) : (
            <UserPlus className={getIconSize()} />
          )}
          <span className="hidden sm:inline">
            {isFollowing ? 'Unfollow' : 'Follow'}
          </span>
        </motion.button>
        
        {showFollowerCount && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            <span>{followerCount.toLocaleString()}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        ${getSizeClasses()} rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2
        ${isFollowing
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-600'
          : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg hover:shadow-xl border border-emerald-500'
        }
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
    >
      {isLoading ? (
        <>
          <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${getIconSize()}`} />
          <span>Loading...</span>
        </>
      ) : isFollowing ? (
        <>
          <UserMinus className={getIconSize()} />
          <span>Unfollow</span>
        </>
      ) : (
        <>
          <UserPlus className={getIconSize()} />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  )
}