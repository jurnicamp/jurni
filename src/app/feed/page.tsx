'use client'

import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  LogOut,
  Moon,
  Sun,
  TreePine,
  Compass,
  Bot,
  Mic,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { ActivityFeed } from '@/components/ActivityFeed'
import { AdventureCard } from '@/components/AdventureCard'
import { AITripAssistant } from '@/components/AITripAssistant'
import { InteractiveMap } from '@/components/InteractiveMap'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { WeatherWidget } from '@/components/WeatherWidget'

// Types
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

// Mock data (same as main page)
const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    bio: 'Mountain enthusiast and photographer',
    followers: 1250,
    following: 340,
    trips: 45,
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    bio: 'Lake camping expert and outdoor gear reviewer',
    followers: 890,
    following: 210,
    trips: 32,
  },
  {
    id: '3',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    bio: 'Desert backpacking specialist and wilderness survival instructor',
    followers: 2100,
    following: 180,
    trips: 67,
  },
]

const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Amazing Mountain Hike',
    description: 'Beautiful sunrise from the peak with incredible views of the valley below. Perfect weather and great company!',
    location: 'Yosemite National Park, CA',
    likes: 24,
    comments: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: mockUsers[0],
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    title: 'Lakeside Camping Adventure',
    description: 'Spent an amazing weekend by the lake with friends. The stars were incredible at night!',
    location: 'Lake Tahoe, CA',
    likes: 18,
    comments: 12,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    user: mockUsers[1],
    photos: [
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
    ],
    isLiked: true,
    isSaved: false,
  },
  {
    id: '3',
    title: 'Desert Backpacking',
    description: 'Challenging but rewarding trek through the desert. The sunrise was worth every step.',
    location: 'Joshua Tree National Park, CA',
    likes: 31,
    comments: 5,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: mockUsers[2],
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
    ],
    isLiked: false,
    isSaved: true,
  },
]

// Mock activity data
const mockActivities = [
  {
    id: '1',
    type: 'trip' as const,
    user: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      isFollowing: true,
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    trip: {
      id: '1',
      title: 'Amazing Mountain Hike',
      location: 'Yosemite National Park, CA',
      photos: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' }],
    },
    likes: 24,
    comments: 8,
    isLiked: false,
  },
  {
    id: '2',
    type: 'achievement' as const,
    user: {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      isFollowing: true,
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    achievement: {
      name: 'Peak Bagger',
      description: 'Completed 10 mountain summits',
      icon: '🏔️',
    },
    likes: 15,
    comments: 3,
    isLiked: true,
  },
  {
    id: '3',
    type: 'follow' as const,
    user: {
      id: '3',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      isFollowing: false,
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    targetUser: {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    },
  },
  {
    id: '4',
    type: 'comment' as const,
    user: {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      isFollowing: true,
    },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    content: 'What an incredible sunrise! The colors are absolutely stunning 🌅',
    trip: {
      id: '2',
      title: 'Lakeside Camping Adventure',
      location: 'Lake Tahoe, CA',
      photos: [{ url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' }],
    },
    likes: 8,
    comments: 2,
    isLiked: false,
  },
]

export default function FeedPage() {
  const [trips, setTrips] = useState(mockTrips)
  const [activities, setActivities] = useState(mockActivities)
  const [loading, _setLoading] = useState(false)
  const [user, setUser] = useState(mockUsers[0]) // Default to logged in user
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [_selectedTrip, _setSelectedTrip] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  // Check if user is logged in, redirect to main page if not
  useEffect(() => {
    // Check localStorage for user data
    const savedUser = localStorage.getItem('jurni_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else if (!user) {
      // No user found, redirect to main page
      window.location.href = '/'
    }
  }, [user])

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('jurni_user')
    window.location.href = '/'
  }

  const toggleLike = useCallback((_tripId: string) => {
    setTrips((prevTrips: Trip[]) =>
      prevTrips.map((trip: Trip) =>
        trip.id === _tripId
          ? {
              ...trip,
              isLiked: !trip.isLiked,
              likes: trip.isLiked ? trip.likes - 1 : trip.likes + 1,
            }
          : trip
      )
    )
  }, [])

  const toggleSave = useCallback((_tripId: string) => {
    setTrips((prevTrips: Trip[]) =>
      prevTrips.map((trip: Trip) => (trip.id === _tripId ? { ...trip, isSaved: !trip.isSaved } : trip))
    )
  }, [])

  const handleTripClick = useCallback((_tripId: string) => {
    window.location.href = `/trip/${_tripId}`
  }, [])

  const handleActivityLike = useCallback((activityId: string) => {
    setActivities((prevActivities: any[]) =>
      prevActivities.map((activity: any) => {
        if (activity.id === activityId && 'likes' in activity && 'isLiked' in activity) {
          // TypeScript now knows this activity has likes/isLiked properties
          return {
            ...activity,
            isLiked: !activity.isLiked,
            likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1,
          } as typeof activity
        }
        return activity
      })
    )
  }, [])

  const handleActivityFollow = useCallback(async (_userId: string, _isFollowing: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setActivities((prevActivities: any[]) =>
      prevActivities.map((activity: any) =>
        activity.user.id === _userId
          ? { ...activity, user: { ...activity.user, isFollowing: !_isFollowing } }
          : activity
      )
    )
  }, [])

  const filteredAndSortedTrips = useMemo(() => {
    return trips
      .filter((trip: Trip) => {
        if (!searchQuery) return true
        return (
          trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
      .sort((a: Trip, b: Trip) => {
        switch (sortBy) {
          case 'popular':
            return b.likes - a.likes
          case 'distance':
            return (b.distance || 0) - (a.distance || 0)
          default:
            return b.timestamp.getTime() - a.timestamp.getTime()
        }
      })
  }, [trips, searchQuery, sortBy])

  const _handleVoiceSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/feed" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Jurni</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search adventures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <motion.button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-emerald-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mic className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-4">
              <Link
                href="/feed"
                className="text-emerald-600 dark:text-emerald-400 font-medium px-3 py-2 rounded-md text-sm"
              >
                Feed
              </Link>
              <Link
                href="/explore"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/trips"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                My Trips
              </Link>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                {user && (
                  <div className="flex items-center space-x-3">
                    <Link href={`/profile/${user.id}`} className="flex items-center space-x-2">
                      <Image
                        src={user.avatar || 'https://via.placeholder.com/40x40/22C55E/FFFFFF?text=U'}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                  <p className="text-emerald-100">Ready for your next adventure? Check out what&apos;s happening in your feed.</p>
                </div>
                <motion.button
                  onClick={() => setShowAIAssistant(true)}
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bot className="w-5 h-5" />
                  <span>AI Assistant</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Activity Feed */}
            <ActivityFeed
              activities={activities}
              onLike={handleActivityLike}
              onFollow={handleActivityFollow}
              onTripClick={handleTripClick}
              currentUserId={user?.id}
            />

            {/* Recent Adventures */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Adventures</h2>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'distance')}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="distance">Longest Distance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedTrips.map((trip, index) => (
                  <AdventureCard
                    key={trip.id}
                    trip={trip}
                    onLike={toggleLike}
                    onSave={toggleSave}
                    onTripClick={handleTripClick}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Share Adventure</span>
                </button>
                <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <Compass className="w-5 h-5" />
                  <span>Find Trails</span>
                </button>
              </div>
            </motion.div>

            {/* Weather Widget */}
            <WeatherWidget location="Yosemite National Park, CA" />

            {/* Interactive Map */}
            <InteractiveMap />
          </div>
        </div>
      </main>

      {/* AI Trip Assistant Modal */}
      <AITripAssistant
        trip={{
          location: _selectedTrip?.location || 'Yosemite National Park, CA',
          difficulty: 'Moderate',
          duration: _selectedTrip?.duration || '1 day',
          season: _selectedTrip?.season || 'Spring',
          distance: _selectedTrip?.distance || 0
        }}
        isVisible={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />
    </div>
  )
}
