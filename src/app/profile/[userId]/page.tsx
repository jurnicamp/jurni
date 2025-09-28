'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Camera, MapPin, Calendar, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { FollowButton } from '@/components/FollowButton'

// Mock user data (replace with real API calls)
const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    bio: 'Mountain enthusiast and photographer. Always seeking the next adventure in the great outdoors.',
    location: 'Denver, Colorado',
    followers: 1250,
    following: 340,
    trips: 45,
    totalDistance: 1240,
    joinDate: 'March 2022',
    isFollowing: false,
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    bio: 'Lake camping expert and outdoor gear reviewer',
    location: 'Seattle, Washington',
    followers: 890,
    following: 210,
    trips: 32,
    totalDistance: 890,
    joinDate: 'June 2022',
    isFollowing: false,
  },
  {
    id: '3',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    bio: 'Desert backpacking specialist and wilderness survival instructor',
    location: 'Phoenix, Arizona',
    followers: 2100,
    following: 180,
    trips: 67,
    totalDistance: 2340,
    joinDate: 'January 2022',
    isFollowing: true,
  },
]

const mockTrips = [
  {
    id: '1',
    title: 'Amazing Mountain Hike',
    location: 'Yosemite National Park, CA',
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    ],
    likes: 24,
    comments: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Lakeside Camping Adventure',
    location: 'Lake Tahoe, CA',
    photos: [
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' },
    ],
    likes: 18,
    comments: 12,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Desert Backpacking',
    location: 'Joshua Tree National Park, CA',
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    ],
    likes: 31,
    comments: 5,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

interface ProfilePageProps {
  params: {
    userId: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [user, setUser] = useState<any>(null)
  const [userTrips, setUserTrips] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'trips' | 'saved'>('trips')

  useEffect(() => {
    // Mock API call - replace with real API
    const foundUser = mockUsers.find(u => u.id === params.userId)
    if (foundUser) {
      setUser(foundUser)
      setIsFollowing(foundUser.isFollowing)
      setUserTrips(mockTrips)
    }
    setLoading(false)
  }, [params.userId])

  const handleFollow = async (userId: string, currentlyFollowing: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setIsFollowing(!currentlyFollowing)
    if (user) {
      setUser({
        ...user,
        followers: currentlyFollowing ? user.followers - 1 : user.followers + 1
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User not found</h1>
          <Link href="/" className="text-emerald-600 hover:text-emerald-700">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to feed
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={user.avatar}
                alt={user.name}
                width={120}
                height={120}
                className="w-20 h-20 sm:w-30 sm:h-30 rounded-full border-4 border-emerald-500"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </motion.div>

            {/* User Info */}
            <div className="flex-1">
              <motion.h1
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {user.name}
              </motion.h1>
              
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-4 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {user.bio}
              </motion.p>

              <motion.div
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <MapPin className="w-4 h-4 mr-1" />
                <span className="mr-4">{user.location}</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span>Joined {user.joinDate}</span>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex items-center gap-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{user.trips}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Adventures</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{user.followers.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{user.following}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{user.totalDistance}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Miles</div>
                </div>
              </motion.div>
            </div>

            {/* Follow Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <FollowButton
                userId={user.id}
                isFollowing={isFollowing}
                onFollow={handleFollow}
                size="md"
                showFollowerCount={false}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('trips')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                activeTab === 'trips'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Adventures ({userTrips.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                activeTab === 'saved'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Saved
            </button>
          </nav>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/trip/${trip.id}`
                }
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={trip.photos[0]?.url || ''}
                  alt={trip.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-1">{trip.title}</h3>
                  <div className="flex items-center text-white/90 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{trip.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{trip.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{trip.comments}</span>
                    </div>
                  </div>
                  <span>{new Date(trip.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {userTrips.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Camera className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No adventures yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Start exploring and sharing your outdoor adventures!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
