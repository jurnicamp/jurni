'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, MapPin, UserPlus, Award, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { FollowButton } from './FollowButton'

interface User {
  id: string
  name: string
  avatar: string
  isFollowing?: boolean
}

interface ActivityItem {
  id: string
  type: 'trip' | 'follow' | 'like' | 'comment' | 'achievement'
  user: User
  timestamp: Date
  content?: string
  trip?: {
    id: string
    title: string
    location: string
    photos: { url: string }[]
  }
  targetUser?: User
  achievement?: {
    name: string
    description: string
    icon: string
  }
  likes?: number
  comments?: number
  isLiked?: boolean
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  onLike?: (_activityId: string) => void
  onFollow?: (_userId: string, _isFollowing: boolean) => void
  onTripClick?: (_tripId: string) => void
  currentUserId?: string
}

export function ActivityFeed({ 
  activities, 
  onLike, 
  onFollow, 
  onTripClick,
  currentUserId 
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | 'following'>('all')

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return <MapPin className="w-5 h-5 text-emerald-500" />
      case 'follow':
        return <UserPlus className="w-5 h-5 text-blue-500" />
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-purple-500" />
      case 'achievement':
        return <Award className="w-5 h-5 text-yellow-500" />
      default:
        return <TrendingUp className="w-5 h-5 text-gray-500" />
    }
  }

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'trip':
        return `shared a new adventure`
      case 'follow':
        return `started following ${activity.targetUser?.name}`
      case 'like':
        return `liked ${activity.trip?.title}`
      case 'comment':
        return `commented on ${activity.trip?.title}`
      case 'achievement':
        return `earned the "${activity.achievement?.name}" achievement`
      default:
        return 'had some activity'
    }
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'following') {
      return activity.user.isFollowing
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilter('following')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'following'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <Link href={`/profile/${activity.user.id}`} className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                </Link>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  {/* Activity Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/profile/${activity.user.id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {activity.user.name}
                      </Link>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {getActivityDescription(activity)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 dark:text-gray-500 text-sm">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                      
                      {/* Follow Button for activities from non-followed users */}
                      {!activity.user.isFollowing && activity.user.id !== currentUserId && onFollow && (
                        <FollowButton
                          userId={activity.user.id}
                          isFollowing={false}
                          onFollow={onFollow}
                          variant="compact"
                          size="sm"
                        />
                      )}
                    </div>
                  </div>

                  {/* Activity Details */}
                  {activity.type === 'trip' && activity.trip && (
                    <motion.div
                      className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => onTripClick?.(activity.trip!.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start space-x-4">
                        {activity.trip.photos && activity.trip.photos.length > 0 && activity.trip.photos[0] && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={activity.trip.photos[0].url}
                              alt={activity.trip.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {activity.trip.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{activity.trip.location}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activity.type === 'achievement' && activity.achievement && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{activity.achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {activity.achievement.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activity.content && (
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      {activity.content}
                    </p>
                  )}

                  {/* Activity Engagement */}
                  {(activity.likes || activity.comments) && (
                    <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {activity.likes !== undefined && (
                        <motion.button
                          onClick={() => onLike?.(activity.id)}
                          className={`flex items-center space-x-2 text-sm transition-colors ${
                            activity.isLiked
                              ? 'text-red-500 dark:text-red-400'
                              : 'text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Heart className={`w-4 h-4 ${activity.isLiked ? 'fill-current' : ''}`} />
                          <span>{activity.likes}</span>
                        </motion.button>
                      )}
                      
                      {activity.comments !== undefined && (
                        <button className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{activity.comments}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No activity yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            {filter === 'following' 
              ? 'Start following adventurers to see their activities here'
              : 'Share your adventures or follow others to see activity'
            }
          </p>
        </motion.div>
      )}
    </div>
  )
}
