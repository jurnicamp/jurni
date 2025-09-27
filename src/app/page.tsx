'use client'

import { motion } from 'framer-motion'
import {
  Camera,
  Users,
  MapPin,
  Heart,
  MessageCircle,
  Plus,
  Star,
  Clock,
  Users2,
  Bookmark,
  Share2,
  Search,
  Filter,
  SortAsc,
  LogOut,
  User,
  Moon,
  Sun,
  TreePine,
  TrendingUp,
  Globe,
  Award,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

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

  // Dynamic statistics for hero section
  const [stats, setStats] = useState({
    adventures: 0,
    explorers: 0,
    countries: 0,
    photos: 0,
  })

  // Animate statistics on mount
  useEffect(() => {
    const targetStats = {
      adventures: 2340000,
      explorers: 847000,
      countries: 127,
      photos: 15600000,
    }

    const duration = 3000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setStats({
        adventures: Math.floor(targetStats.adventures * easeOut),
        explorers: Math.floor(targetStats.explorers * easeOut),
        countries: Math.floor(targetStats.countries * easeOut),
        photos: Math.floor(targetStats.photos * easeOut),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setStats(targetStats)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-b border-white/20 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </span>
            </motion.div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search adventures..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 transition-colors duration-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-300" />
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
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                    />
                    <span className="text-white font-medium">
                      Welcome, {user.name}!
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-300 flex items-center"
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
                    className="text-white hover:text-emerald-400 font-medium transition-colors duration-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup')
                      setShowAuthModal(true)
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
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
      <div className="md:hidden px-4 py-3 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
          <input
            type="text"
            placeholder="Search adventures..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 transition-colors duration-300"
          />
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-300" />
            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="border border-white/20 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white transition-colors duration-300"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-300" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'recent' | 'popular' | 'distance')}
              className="border border-white/20 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white transition-colors duration-300"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="distance">Closest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cinematic Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-indigo-900/90 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
            alt="Mountain landscape"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-20">
          {/* Floating mountains */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 opacity-20"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <TreePine className="w-full h-full text-white" />
          </motion.div>
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 opacity-15"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <MapPin className="w-full h-full text-white" />
          </motion.div>
          <motion.div
            className="absolute bottom-40 left-20 w-20 h-20 opacity-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Camera className="w-full h-full text-white" />
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Award className="w-4 h-4 mr-2 text-yellow-400" />
              #1 Outdoor Adventure Platform
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Discover
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Epic Adventures
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Join millions of explorers sharing their wilderness stories, discovering hidden gems, and building the world's largest outdoor community.
            </motion.p>

            {/* Dynamic Statistics */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {[
                { icon: Camera, label: 'Adventures', value: formatNumber(stats.adventures), suffix: '+' },
                { icon: Users, label: 'Explorers', value: formatNumber(stats.explorers), suffix: '+' },
                { icon: Globe, label: 'Countries', value: stats.countries, suffix: '' },
                { icon: TrendingUp, label: 'Photos', value: formatNumber(stats.photos), suffix: '+' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <stat.icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              {user ? (
                <motion.button
                  className="group bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center shadow-2xl hover:shadow-emerald-500/25"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Share Your Adventure
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={() => {
                      setAuthMode('signup')
                      setShowAuthModal(true)
                    }}
                    className="group bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center shadow-2xl hover:shadow-emerald-500/25"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Start Exploring
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setAuthMode('signin')
                      setShowAuthModal(true)
                    }}
                    className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Sign In
                  </motion.button>
                </>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <div className="text-white text-sm font-medium">Trusted by</div>
              <div className="flex items-center space-x-6">
                {['REI', 'Patagonia', 'National Geographic', 'Outdoor Research'].map((brand) => (
                  <div key={brand} className="text-white/60 text-sm font-medium">
                    {brand}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
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
                <motion.div
                  key={trip.id}
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
                          onClick={() => toggleSave(trip.id)}
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
                          onClick={() => toggleLike(trip.id)}
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
