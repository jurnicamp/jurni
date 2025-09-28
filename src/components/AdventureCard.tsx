import { motion } from 'framer-motion'
import { Heart, MessageCircle, MapPin, Camera, Clock, Users2, Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface AdventureCardProps {
  trip: {
    id: string
    title: string
    description: string
    location: string
    difficulty: 'easy' | 'moderate' | 'hard'
    likes: number
    comments: number
    timestamp: Date
    user: {
      id: string
      name: string
      email: string
      avatar?: string
      bio?: string
      followers?: number
      following?: number
      trips?: number
    }
    photos: Array<{ url: string }>
    duration?: string
    groupSize?: number
    season?: string
    tags?: string[]
    distance?: number
    isLiked?: boolean
    isSaved?: boolean
  }
  index: number
  onLike?: (_tripId: string) => void
  onSave?: (_tripId: string) => void
}

export function AdventureCard({ trip, index, onLike, onSave }: AdventureCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
      case 'moderate': return 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
      case 'hard': return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
    }
  }

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl dark:hover:shadow-gray-900/20 transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        {trip.photos && trip.photos.length > 0 ? (
          <>
            <Image
              src={trip.photos[0]?.url || ''}
              alt={trip.title}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Loading overlay */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <motion.div
                  className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Photo count indicator */}
            {trip.photos.length > 1 && (
              <motion.div
                className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                +{trip.photos.length - 1} more
              </motion.div>
            )}

            {/* Difficulty badge */}
            <motion.div
              className="absolute top-4 right-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm ${getDifficultyColor(trip.difficulty)}`}
              >
                {trip.difficulty}
              </span>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="absolute top-4 right-16 flex space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => onSave?.(trip.id)}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  trip.isSaved
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 rounded-full backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </>
        ) : (
          <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* User info */}
        <motion.div
          className="flex items-center space-x-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
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
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {trip.user.name}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {new Date(trip.timestamp).toLocaleDateString()}
            </p>
          </div>
        </motion.div>

        {/* Title and description */}
        <motion.h3
          className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {trip.title}
        </motion.h3>
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {trip.description}
        </motion.p>

        {/* Location */}
        <motion.div
          className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-emerald-500" />
          <span className="truncate">{trip.location}</span>
          {trip.distance && (
            <span className="ml-2 text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
              {trip.distance}mi away
            </span>
          )}
        </motion.div>

        {/* Trip metadata */}
        <motion.div
          className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
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
        </motion.div>

        {/* Tags */}
        {trip.tags && trip.tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            {trip.tags.slice(0, 3).map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {tag}
              </motion.span>
            ))}
            {trip.tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                +{trip.tags.length - 3}
              </span>
            )}
          </motion.div>
        )}

        {/* Engagement stats */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <motion.button
              onClick={() => onLike?.(trip.id)}
              className={`flex items-center transition-all duration-300 ${
                trip.isLiked
                  ? 'text-red-500 dark:text-red-400'
                  : 'hover:text-red-500 dark:hover:text-red-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-5 h-5 mr-1 ${trip.isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{trip.likes || 0}</span>
            </motion.button>
            <motion.div
              className="flex items-center hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <MessageCircle className="w-5 h-5 mr-1" />
              <span className="font-medium">{trip.comments || 0}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
