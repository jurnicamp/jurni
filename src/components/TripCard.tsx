import { motion } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  MapPin,
  Camera,
  Clock,
  Users2,
  Star,
  Bookmark,
  Share2,
} from 'lucide-react'
import Image from 'next/image'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  followers?: number
  following?: number
  trips?: number
}

interface Trip {
  id: string
  title: string
  description: string
  location: string
  difficulty: 'easy' | 'moderate' | 'hard'
  likes: number
  comments: number
  timestamp: Date
  user: User
  photos: { url: string }[]
  duration?: string
  groupSize?: number
  season?: string
  tags?: string[]
  distance?: number
  isLiked?: boolean
  isSaved?: boolean
}

interface TripCardProps {
  trip: Trip
  index: number
  onLike: (_tripId: string) => void
  onSave: (_tripId: string) => void
}

export function TripCard({ trip, index, onLike, onSave }: TripCardProps) {
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks}w ago`
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-200 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Enhanced Photo Section with 16:9 aspect ratio */}
      {trip.photos && trip.photos.length > 0 ? (
        <div className="relative h-64 overflow-hidden">
          <Image
            src={trip.photos[0]?.url || ''}
            alt={trip.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* Photo count indicator */}
          {trip.photos.length > 1 && (
            <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
              +{trip.photos.length - 1} more
            </div>
          )}
          {/* Difficulty badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                trip.difficulty === 'easy'
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                  : trip.difficulty === 'moderate'
                    ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                    : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
              }`}
            >
              {trip.difficulty}
            </span>
          </div>
          {/* Action buttons overlay */}
          <div className="absolute top-3 right-12 flex space-x-2">
            <button
              onClick={() => onSave(trip.id)}
              className={`p-2 rounded-full transition-colors ${
                trip.isSaved
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <Camera className="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
      )}

      <div className="p-6">
        {/* User info */}
        <div className="flex items-center space-x-3 mb-4">
          <Image
            src={
              trip.user.avatar ||
              `https://via.placeholder.com/40x40/22C55E/FFFFFF?text=${trip.user.name?.charAt(0) || 'U'}`
            }
            alt={trip.user.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate transition-colors duration-300">
              {trip.user.name}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300">
              {formatTimeAgo(trip.timestamp)}
            </p>
          </div>
        </div>

        {/* Trip title and description */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 transition-colors duration-300">
          {trip.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 transition-colors duration-300">
          {trip.description}
        </p>

        {/* Trip metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{trip.location}</span>
            {trip.distance && (
              <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full transition-colors duration-300">
                {trip.distance}mi away
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {trip.duration && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{trip.duration}</span>
              </div>
            )}
            {trip.groupSize && (
              <div className="flex items-center">
                <Users2 className="w-4 h-4 mr-1" />
                <span>{trip.groupSize} people</span>
              </div>
            )}
            {trip.season && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                <span>{trip.season}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {trip.tags && trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {trip.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
            {trip.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full transition-colors duration-300">
                +{trip.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Engagement stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <button
              onClick={() => onLike(trip.id)}
              className={`flex items-center transition-colors ${
                trip.isLiked
                  ? 'text-red-500 dark:text-red-400'
                  : 'hover:text-red-500 dark:hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 mr-1 ${trip.isLiked ? 'fill-current' : ''}`} />
              <span>{trip.likes || 0}</span>
            </button>
            <div className="flex items-center hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span>{trip.comments || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
