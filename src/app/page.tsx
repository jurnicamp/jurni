'use client'

import { motion } from 'framer-motion'
import {
  Camera,
  Users,
  MapPin,
  Plus,
  Search,
  Filter,
  SortAsc,
  LogOut,
  User,
  Moon,
  Sun,
  TreePine,
} from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

import { TripCard } from '@/components/TripCard'

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

// Mock users for authentication
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    bio: 'Mountain enthusiast and photographer',
    followers: 1250,
    following: 340,
    trips: 45,
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    bio: 'Lake camping expert',
    followers: 890,
    following: 210,
    trips: 32,
  },
  {
    id: '3',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    bio: 'Desert backpacking specialist',
    followers: 2100,
    following: 180,
    trips: 67,
  },
]

// Mock data - replace with real API calls
const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Amazing Mountain Hike',
    description:
      'Beautiful sunrise from the peak with incredible views of the valley below. Perfect weather and great company!',
    location: 'Yosemite National Park, CA',
    difficulty: 'moderate',
    likes: 24,
    comments: 8,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    duration: '2 days',
    groupSize: 4,
    season: 'Spring',
    tags: ['Hiking', 'Photography', 'Sunrise'],
    distance: 12.5,
    user: mockUsers[0]!,
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    title: 'Lakeside Camping Adventure',
    description:
      'Perfect weekend getaway with friends around the campfire. The stars were incredible!',
    location: 'Lake Tahoe, CA',
    difficulty: 'easy',
    likes: 18,
    comments: 12,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    duration: '3 days',
    groupSize: 6,
    season: 'Summer',
    tags: ['Camping', 'Lake', 'Friends'],
    distance: 8.2,
    user: mockUsers[1]!,
    photos: [
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '3',
    title: 'Desert Backpacking',
    description:
      'Challenging but rewarding 3-day trek through the desert. The solitude was amazing.',
    location: 'Joshua Tree National Park, CA',
    difficulty: 'hard',
    likes: 31,
    comments: 5,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    duration: '3 days',
    groupSize: 2,
    season: 'Fall',
    tags: ['Backpacking', 'Desert', 'Solo'],
    distance: 25.8,
    user: mockUsers[2]!,
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=450&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
  },
]

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips)
  const [loading, _setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'distance'>('recent')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load user and theme from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('jurni_user')
    const savedTheme = localStorage.getItem('jurni_theme')

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('jurni_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('jurni_user')
    }
  }, [user])

  // Save theme to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('jurni_theme', isDarkMode ? 'dark' : 'light')

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()

    if (authMode === 'signin') {
      // Simple sign in - just use first mock user for demo
      const mockUser = mockUsers[0]!
      setUser(mockUser)
      setShowAuthModal(false)
      setAuthForm({ name: '', email: '', password: '' })
    } else {
      // Simple sign up - create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: authForm.name,
        email: authForm.email,
        avatar: `https://via.placeholder.com/40x40/22C55E/FFFFFF?text=${authForm.name.charAt(0).toUpperCase()}`,
        bio: 'New adventurer',
        followers: 0,
        following: 0,
        trips: 0,
      }
      setUser(newUser)
      setShowAuthModal(false)
      setAuthForm({ name: '', email: '', password: '' })
    }
  }

  const handleLogout = () => {
    setUser(null)
  }

  const toggleLike = (tripId: string) => {
    setTrips(prevTrips =>
      prevTrips.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              isLiked: !trip.isLiked,
              likes: trip.isLiked ? trip.likes - 1 : trip.likes + 1,
            }
          : trip
      )
    )
  }

  const toggleSave = (tripId: string) => {
    setTrips(prevTrips =>
      prevTrips.map(trip => (trip.id === tripId ? { ...trip, isSaved: !trip.isSaved } : trip))
    )
  }

  const filteredAndSortedTrips = trips
    .filter(trip => {
      const matchesSearch =
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesDifficulty = filterDifficulty === 'all' || trip.difficulty === filterDifficulty
      return matchesSearch && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes
        case 'distance':
          return (a.distance || 0) - (b.distance || 0)
        case 'recent':
        default:
          return b.timestamp.getTime() - a.timestamp.getTime()
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </span>
            </motion.div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search adventures..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2">
                    <Image
                      src={
                        user.avatar ||
                        `https://via.placeholder.com/32x32/22C55E/FFFFFF?text=${user.name?.charAt(0) || 'U'}`
                      }
                      alt={user.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Welcome, {user.name}!
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('signin')
                      setShowAuthModal(true)
                    }}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup')
                      setShowAuthModal(true)
                    }}
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search adventures..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
          />
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'recent' | 'popular' | 'distance')}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="distance">Closest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Share Your
              <span className="text-primary-600 dark:text-primary-400 block">
                Adventure Stories
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-300">
              Connect with fellow outdoor enthusiasts, discover new camping spots, and inspire
              others with your wilderness adventures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <motion.button
                  className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Your Trip
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={() => {
                      setAuthMode('signup')
                      setShowAuthModal(true)
                    }}
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300 inline-block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Join the Community
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setAuthMode('signin')
                      setShowAuthModal(true)
                    }}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-8 py-3 rounded-lg font-semibold text-lg border-2 border-gray-300 dark:border-gray-600 transition-colors duration-300 inline-block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-gray-900 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Everything you need for your next adventure
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">
              Discover, plan, and share your outdoor experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: 'Share Photos & Stories',
                description:
                  'Upload photos and write about your camping experiences to inspire others.',
                bgClass: 'bg-green-100 dark:bg-green-900/30',
                hoverBgClass: 'group-hover:bg-green-200 dark:group-hover:bg-green-900/50',
                iconClass: 'text-green-600 dark:text-green-400',
              },
              {
                icon: MapPin,
                title: 'Discover New Spots',
                description:
                  'Find hidden gems and popular camping destinations shared by the community.',
                bgClass: 'bg-blue-100 dark:bg-blue-900/30',
                hoverBgClass: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50',
                iconClass: 'text-blue-600 dark:text-blue-400',
              },
              {
                icon: Users,
                title: 'Connect with Others',
                description:
                  'Follow fellow adventurers and build a community of outdoor enthusiasts.',
                bgClass: 'bg-purple-100 dark:bg-purple-900/30',
                hoverBgClass: 'group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50',
                iconClass: 'text-purple-600 dark:text-purple-400',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgClass} rounded-full mb-4 ${feature.hoverBgClass} transition-colors`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.iconClass}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Adventures */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Recent Adventures
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">
              See what the community has been up to
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-6 h-6 border-2 border-primary-600 dark:border-primary-400 border-t-transparent rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Loading adventures...</span>
              </div>
            </div>
          ) : filteredAndSortedTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Camera className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                No adventures found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedTrips.map((trip, index) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  index={index}
                  onLike={toggleLike}
                  onSave={toggleSave}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-primary-600 dark:bg-primary-700 py-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to share your adventures?</h2>
            <p className="text-primary-100 dark:text-primary-200 text-lg mb-8 transition-colors duration-300">
              Join thousands of outdoor enthusiasts already sharing their stories
            </p>
            <motion.button
              onClick={() => {
                setAuthMode('signup')
                setShowAuthModal(true)
              }}
              className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TreePine className="w-6 h-6" />
              <span className="text-xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
            </div>

            <div className="flex items-center space-x-8">
              <span className="text-gray-400 dark:text-gray-500">
                Made with ❤️ for outdoor enthusiasts
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-md transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                {authMode === 'signin'
                  ? 'Welcome Back'
                  : `Join ${process.env.NEXT_PUBLIC_APP_NAME}`}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                {authMode === 'signin'
                  ? 'Sign in to continue your adventure'
                  : 'Create your account to start sharing'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={e => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={e => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={e => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-300"
              >
                {authMode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
