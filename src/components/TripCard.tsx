import Image from 'next/image'
import { Heart, MessageCircle, MapPin, Camera } from 'lucide-react'
import { motion } from 'framer-motion'

interface Trip {
  id: string
  title: string
  description: string
  location: string
  difficulty: 'easy' | 'moderate' | 'hard'
  likes: number
  comments: number
  timestamp: Date
  user: {
    name: string
    avatar: string
  }
  photos: Array<{ url: string }>
}

interface TripCardProps {
  trip: Trip
  index: number
}

export function TripCard({ trip, index }: TripCardProps) {
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
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {trip.photos && trip.photos.length > 0 ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={trip.photos[0].url}
            alt={trip.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              trip.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              trip.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {trip.difficulty}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <Camera className="w-12 h-12 text-gray-400" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-3">
          <Image
            src={trip.user.avatar || `https://via.placeholder.com/40x40/22C55E/FFFFFF?text=${trip.user.name?.charAt(0) || 'U'}`}
            alt={trip.user.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">{trip.user.name}</p>
            <p className="text-gray-500 text-xs">{formatTimeAgo(trip.timestamp)}</p>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{trip.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trip.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{trip.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center hover:text-red-500 cursor-pointer transition-colors">
              <Heart className="w-4 h-4 mr-1" />
              <span>{trip.likes || 0}</span>
            </div>
            <div className="flex items-center hover:text-blue-500 cursor-pointer transition-colors">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span>{trip.comments || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
