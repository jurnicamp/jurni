'use client'

import { useState, useEffect } from 'react'
import { Tent, Mountain, Camera, Users, MapPin, Heart, MessageCircle, Plus, Star, BookOpen, Clock, Users2, Bookmark, Share2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Types
interface User {
  name: string
  avatar?: string
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
}

// Mock data - replace with real API calls
const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Amazing Mountain Hike',
    description: 'Beautiful sunrise from the peak with incredible views of the valley below. Perfect weather and great company!',
    location: 'Yosemite National Park, CA',
    difficulty: 'moderate',
    likes: 24,
    comments: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: '2 days',
    groupSize: 4,
    season: 'Spring',
    tags: ['Hiking', 'Photography', 'Sunrise'],
    distance: 12.5,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    },
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop' }
    ]
  },
  {
    id: '2',
    title: 'Lakeside Camping Adventure',
    description: 'Perfect weekend getaway with friends around the campfire. The stars were incredible!',
    location: 'Lake Tahoe, CA',
    difficulty: 'easy',
    likes: 18,
    comments: 12,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    duration: '3 days',
    groupSize: 6,
    season: 'Summer',
    tags: ['Camping', 'Lake', 'Friends'],
    distance: 8.2,
    user: {
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    photos: [
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' }
    ]
  },
  {
    id: '3',
    title: 'Desert Backpacking',
    description: 'Challenging but rewarding 3-day trek through the desert. The solitude was amazing.',
    location: 'Joshua Tree National Park, CA',
    difficulty: 'hard',
    likes: 31,
    comments: 5,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    duration: '3 days',
    groupSize: 2,
    season: 'Fall',
    tags: ['Backpacking', 'Desert', 'Solo'],
    distance: 25.8,
    user: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=450&fit=crop' }
    ]
  }
]

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null) // Mock user state with proper typing
  const [savedTrips, setSavedTrips] = useState<Set<string>>(new Set())

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

  const toggleSaveTrip = (tripId: string) => {
    setSavedTrips(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tripId)) {
        newSet.delete(tripId)
      } else {
        newSet.add(tripId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">Jurni</span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2">
                    <Image
                      src={user.avatar || `https://via.placeholder.com/32x32/22C55E/FFFFFF?text=${user.name?.charAt(0) || 'U'}`}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                    <span className="text-gray-700 font-medium">Welcome, {user.name}!</span>
                  </div>
                  <Link href="/account/logout" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/account/signin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Sign In
                  </Link>
                  <Link href="/account/signup" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Your
              <span className="text-primary-600 block">Adventure Stories</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with fellow outdoor enthusiasts, discover new camping spots, and inspire others with your wilderness adventures.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <motion.button 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Your Trip
                </motion.button>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/account/signup" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block">
                      Join the Community
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/account/signin" className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-3 rounded-lg font-semibold text-lg border-2 border-gray-300 transition-colors inline-block">
                      Sign In
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need for your next adventure</h2>
            <p className="text-gray-600 text-lg">Discover, plan, and share your outdoor experiences</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: 'Share Photos & Stories',
                description: 'Upload photos and write about your camping experiences to inspire others.',
                color: 'green'
              },
              {
                icon: MapPin,
                title: 'Discover New Spots',
                description: 'Find hidden gems and popular camping destinations shared by the community.',
                color: 'blue'
              },
              {
                icon: Users,
                title: 'Connect with Others',
                description: 'Follow fellow adventurers and build a community of outdoor enthusiasts.',
                color: 'purple'
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${feature.color}-100 rounded-full mb-4 group-hover:bg-${feature.color}-200 transition-colors`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Adventures */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Adventures</h2>
            <p className="text-gray-600 text-lg">See what the community has been up to</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full"></div>
                <span className="text-gray-600">Loading adventures...</span>
              </div>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Camera className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No adventures yet</h3>
              <p className="text-gray-600">Be the first to share your camping story!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, index) => (
                <motion.div 
                  key={trip.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Enhanced Photo Section with 16:9 aspect ratio */}
                  {trip.photos && trip.photos.length > 0 ? (
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={trip.photos[0].url}
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
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          trip.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          trip.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {trip.difficulty}
                        </span>
                      </div>
                      {/* Action buttons overlay */}
                      <div className="absolute top-3 right-12 flex space-x-2">
                        <button
                          onClick={() => toggleSaveTrip(trip.id)}
                          className={`p-2 rounded-full transition-colors ${
                            savedTrips.has(trip.id) 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-white/80 text-gray-600 hover:bg-white'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/80 text-gray-600 rounded-full hover:bg-white transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* User info */}
                    <div className="flex items-center space-x-3 mb-4">
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
                    
                    {/* Trip title and description */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{trip.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>
                    
                    {/* Trip metadata */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{trip.location}</span>
                        {trip.distance && (
                          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {trip.distance}mi away
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {trip.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{trip.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Engagement stats */}
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-primary-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to share your adventures?</h2>
            <p className="text-primary-100 text-lg mb-8">Join thousands of outdoor enthusiasts already sharing their stories</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/account/signup" className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block">
                Get Started Today
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-xl font-bold">Jurni</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <span className="text-gray-400">Made with ❤️ for outdoor enthusiasts</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
