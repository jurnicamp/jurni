'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
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
  TrendingUp,
  Globe,
  Award,
  Zap,
  Compass,
  ArrowRight,
  Sparkles,
  Bot,
  Cloud,
  Mic,
  Camera,
} from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

import { AdventureCard } from '@/components/AdventureCard'
import { ActivityFeed } from '@/components/ActivityFeed'
import Link from 'next/link'
import { AITripAssistant } from '@/components/AITripAssistant'
import { InteractiveMap } from '@/components/InteractiveMap'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { VoiceSearch } from '@/components/VoiceSearch'
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

// Mock users for authentication
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    bio: 'Mountain enthusiast and photographer',
    followers: 1250,
    following: 340,
    trips: 45,
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    bio: 'Lake camping expert',
    followers: 890,
    following: 210,
    trips: 32,
  },
  {
    id: '3',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    bio: 'Desert backpacking specialist',
    followers: 2100,
    following: 180,
    trips: 67,
  },
  {
    id: '4',
    name: 'Jake Mirco',
    email: 'jake.mirco@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    bio: 'Western Australia adventure guide & photographer',
    followers: 3200,
    following: 450,
    trips: 89,
  },
  {
    id: '5',
    name: 'Chris Moule',
    email: 'chris.moule@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    bio: 'Queensland coastal explorer & marine biologist',
    followers: 1850,
    following: 320,
    trips: 56,
  },
]

// Mock data - replace with real API calls
const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Amazing Mountain Hike',
    description: 'Beautiful sunrise from the peak with incredible views of the valley below. Perfect weather and great company!',
    location: 'Yosemite National Park, CA',
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
    description: 'Perfect weekend getaway with friends around the campfire. The stars were incredible!',
    location: 'Lake Tahoe, CA',
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
    description: 'Challenging but rewarding 3-day trek through the desert. The solitude was amazing.',
    location: 'Joshua Tree National Park, CA',
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
  // Jake Mirco's trips from Western Australia
  {
    id: '4',
    title: 'Karijini National Park Adventure',
    description: 'Epic 5-day trek through the ancient gorges of Karijini. The red rock formations and natural pools were absolutely breathtaking. Perfect weather and incredible wildlife sightings!',
    location: 'Karijini National Park, Western Australia',
    likes: 47,
    comments: 12,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: '5 days',
    groupSize: 3,
    season: 'Winter',
    tags: ['Hiking', 'Gorges', 'Wildlife', 'Photography'],
    distance: 45.2,
    user: mockUsers[3]!,
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=450&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '5',
    title: 'Cape to Cape Track - Margaret River',
    description: 'Stunning coastal walk along the Margaret River coastline. Perfect for whale watching season! The wildflowers were in full bloom and the ocean views were incredible.',
    location: 'Cape to Cape Track, Western Australia',
    likes: 38,
    comments: 8,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: '4 days',
    groupSize: 2,
    season: 'Spring',
    tags: ['Coastal', 'Whale Watching', 'Wildflowers', 'Beach'],
    distance: 32.1,
    user: mockUsers[3]!,
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '6',
    title: 'Rottnest Island Cycling Adventure',
    description: 'Perfect day trip cycling around Rottnest Island! Spotted quokkas, snorkeled in crystal clear waters, and enjoyed the best fish and chips in WA. Highly recommend!',
    location: 'Rottnest Island, Western Australia',
    likes: 29,
    comments: 15,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: '1 day',
    groupSize: 4,
    season: 'Summer',
    tags: ['Cycling', 'Island', 'Quokkas', 'Snorkeling'],
    distance: 18.5,
    user: mockUsers[3]!,
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
  },
  // Chris Moule's trips from Queensland
  {
    id: '7',
    title: 'Great Barrier Reef Snorkeling',
    description: 'Incredible day exploring the Great Barrier Reef! Saw turtles, reef sharks, and thousands of colorful fish. The coral formations were absolutely stunning. A must-do experience!',
    location: 'Great Barrier Reef, Queensland',
    likes: 52,
    comments: 18,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: '1 day',
    groupSize: 6,
    season: 'Summer',
    tags: ['Snorkeling', 'Reef', 'Marine Life', 'Photography'],
    distance: 0,
    user: mockUsers[4]!,
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=450&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '8',
    title: 'Fraser Island 4WD Adventure',
    description: 'Epic 3-day 4WD adventure on Fraser Island! Drove along 75 Mile Beach, swam in Lake McKenzie, and camped under the stars. The dingoes were amazing to see in their natural habitat.',
    location: 'Fraser Island, Queensland',
    likes: 41,
    comments: 9,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: '3 days',
    groupSize: 4,
    season: 'Autumn',
    tags: ['4WD', 'Island', 'Camping', 'Wildlife'],
    distance: 0,
    user: mockUsers[4]!,
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
  },
  {
    id: '9',
    title: 'Lamington National Park Rainforest Walk',
    description: 'Beautiful rainforest walk in Lamington National Park. The ancient trees and birdlife were incredible. Perfect for a peaceful day in nature away from the city.',
    location: 'Lamington National Park, Queensland',
    likes: 33,
    comments: 7,
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    duration: '1 day',
    groupSize: 2,
    season: 'Spring',
    tags: ['Rainforest', 'Birdwatching', 'Nature', 'Hiking'],
    distance: 8.7,
    user: mockUsers[4]!,
    photos: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop' },
    ],
    isLiked: false,
    isSaved: false,
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

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips)
  const [activities, setActivities] = useState(mockActivities)
  const [loading, _setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'distance'>('recent')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [viewMode, setViewMode] = useState<'feed' | 'explore'>('feed')

  // Dynamic statistics for hero section
  const [stats, setStats] = useState({
    adventures: 0,
    explorers: 0,
    countries: 0,
    photos: 0,
  })

  // Scroll animations
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const adventuresRef = useRef<HTMLDivElement>(null)

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const isFeaturesInView = useInView(featuresRef, { once: true, margin: '-100px' })
  const isAdventuresInView = useInView(adventuresRef, { once: true, margin: '-100px' })

  // New state for advanced features
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [selectedTrip, _setSelectedTrip] = useState<Trip | null>(null)

  // Map markers for interactive map
  const mapMarkers: Array<{
    id: string
    lat: number
    lng: number
    title: string
    type: 'camping' | 'hiking' | 'viewpoint' | 'danger'
    distance?: number
    elevation?: number
  }> = [
    {
      id: '1',
      lat: 37.8651,
      lng: -119.5383,
      title: 'Yosemite Valley',
      type: 'hiking',
      distance: 12.5,
      elevation: 4000
    },
    {
      id: '2',
      lat: 39.0968,
      lng: -120.0324,
      title: 'Lake Tahoe',
      type: 'camping',
      distance: 8.2,
      elevation: 6225
    },
    {
      id: '3',
      lat: 33.8734,
      lng: -115.9010,
      title: 'Joshua Tree',
      type: 'hiking',
      distance: 25.8,
      elevation: 3000
    }
  ]

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

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showAuthModal) setShowAuthModal(false)
        if (showAIAssistant) setShowAIAssistant(false)
        if (showVoiceSearch) setShowVoiceSearch(false)
        if (showWeather) setShowWeather(false)
        if (showMap) setShowMap(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [showAuthModal, showAIAssistant, showVoiceSearch, showWeather, showMap])

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (authMode === 'signin') {
      const mockUser = mockUsers[0]!
      setUser(mockUser)
      setShowAuthModal(false)
      setAuthForm({ name: '', email: '', password: '' })
    } else {
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
    setActivities(prevActivities =>
      prevActivities.map(activity =>
        activity.id === activityId
          ? {
              ...activity,
              isLiked: !activity.isLiked,
              likes: activity.isLiked ? (activity.likes || 0) - 1 : (activity.likes || 0) + 1,
            }
          : activity
      )
    )
  }, [])

  const handleActivityFollow = useCallback(async (_userId: string, _isFollowing: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setActivities(prevActivities =>
      prevActivities.map(activity =>
        activity.user.id === _userId
          ? { ...activity, user: { ...activity.user, isFollowing: !_isFollowing } }
          : activity
      )
    )
  }, [])

  const filteredAndSortedTrips = useMemo(() => {
    return trips
      .filter((trip: Trip) => {
        const matchesSearch =
          trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesSearch
      })
      .sort((a: Trip, b: Trip) => {
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
  }, [trips, searchQuery, filterDifficulty, sortBy])

  const handleVoiceSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleMarkerClick = (_marker: any) => {
    // Handle map marker click
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <motion.nav
        className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border-b border-white/20 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <TreePine className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-2xl font-bold text-white">
                {process.env.NEXT_PUBLIC_APP_NAME || 'Jurni'}
              </span>
            </motion.div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search adventures or ask AI..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 transition-all duration-300 hover:bg-white/20"
                />
                <motion.button
                  onClick={() => setShowVoiceSearch(true)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-emerald-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mic className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
                aria-label="Toggle dark mode"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-300" />
                )}
              </motion.button>

              {user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2">
                    <Link href={`/profile/${user.id}`} className="flex items-center space-x-2">
                      <Image
                        src={
                          user.avatar ||
                          `https://via.placeholder.com/32x32/22C55E/FFFFFF?text=${user.name?.charAt(0) || 'U'}`
                        }
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-emerald-400 transition-colors"
                      />
                      <span className="text-white font-medium hover:text-emerald-400 transition-colors">
                        Welcome, {user.name}!
                      </span>
                    </Link>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={() => {
                      setAuthMode('signin')
                      setShowAuthModal(true)
                    }}
                    className="text-white hover:text-emerald-400 font-medium transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setAuthMode('signup')
                      setShowAuthModal(true)
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Join</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Search */}
      <motion.div
        className="md:hidden px-4 py-3 bg-white/10 backdrop-blur-sm border-b border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-4 h-4" />
          <input
            type="text"
            placeholder="Search adventures..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 transition-all duration-300 hover:bg-white/20"
          />
          <motion.button
            onClick={() => setShowVoiceSearch(true)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-emerald-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Mic className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Sort */}
      <motion.div
        className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'feed'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setViewMode('explore')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'explore'
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Explore
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-300" />
            <span className="text-white text-sm font-medium">Filters</span>
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-gray-300" />
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'recent' | 'popular' | 'distance')}
              className="border border-white/20 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white/10 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/20"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="distance">Closest</option>
            </select>
          </div>

          {/* New AI and Weather buttons */}
          <motion.button
            onClick={() => setShowAIAssistant(true)}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="w-4 h-4" />
            <span className="text-xs sm:text-sm hidden xs:inline">AI Assistant</span>
          </motion.button>

          <motion.button
            onClick={() => setShowWeather(true)}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Cloud className="w-4 h-4" />
            <span className="text-xs sm:text-sm hidden xs:inline">Weather</span>
          </motion.button>

          <motion.button
            onClick={() => setShowMap(true)}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-xs sm:text-sm hidden xs:inline">Map</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cinematic Hero Section */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-indigo-900/90 z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
            alt="Mountain landscape"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-20">
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
          <motion.div
            className="absolute top-60 left-1/4 w-16 h-16 opacity-10"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Compass className="w-full h-full text-white" />
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
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-5 h-5 mr-2 text-yellow-400" />
              #1 Outdoor Adventure Platform
              <Sparkles className="w-4 h-4 ml-2 text-yellow-400" />
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
              Join millions of explorers sharing their wilderness stories, discovering hidden gems, and building the world&apos;s largest outdoor community.
            </motion.p>

            {/* Dynamic Statistics */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {[
                { icon: Camera, label: 'Adventures', value: formatNumber(stats.adventures), suffix: '+', color: 'text-emerald-400' },
                { icon: Users, label: 'Explorers', value: formatNumber(stats.explorers), suffix: '+', color: 'text-blue-400' },
                { icon: Globe, label: 'Countries', value: stats.countries, suffix: '', color: 'text-purple-400' },
                { icon: TrendingUp, label: 'Photos', value: formatNumber(stats.photos), suffix: '+', color: 'text-amber-400' },
              ].map((stat, _index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 + _index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className={`w-10 h-10 ${stat.color}`} />
                  </motion.div>
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
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
                  <motion.div
                    key={brand}
                    className="text-white/60 text-sm font-medium"
                    whileHover={{ scale: 1.1, color: '#ffffff' }}
                    transition={{ duration: 0.2 }}
                  >
                    {brand}
                  </motion.div>
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
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        ref={featuresRef}
        className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFeaturesInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isFeaturesInView ? 1 : 0, y: isFeaturesInView ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              Everything you need for your next adventure
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto transition-colors duration-300">
              Discover, plan, and share your outdoor experiences with our comprehensive platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: 'Share Photos & Stories',
                description: 'Upload photos and write about your camping experiences to inspire others.',
                bgClass: 'bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30',
                hoverBgClass: 'group-hover:from-emerald-200 group-hover:to-green-200 dark:group-hover:from-emerald-900/50 dark:group-hover:to-green-900/50',
                iconClass: 'text-emerald-600 dark:text-emerald-400',
                delay: 0.1,
              },
              {
                icon: MapPin,
                title: 'Discover New Spots',
                description: 'Find hidden gems and popular camping destinations shared by the community.',
                bgClass: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
                hoverBgClass: 'group-hover:from-blue-200 group-hover:to-cyan-200 dark:group-hover:from-blue-900/50 dark:group-hover:to-cyan-900/50',
                iconClass: 'text-blue-600 dark:text-blue-400',
                delay: 0.2,
              },
              {
                icon: Users,
                title: 'Connect with Others',
                description: 'Follow fellow adventurers and build a community of outdoor enthusiasts.',
                bgClass: 'bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30',
                hoverBgClass: 'group-hover:from-purple-200 group-hover:to-violet-200 dark:group-hover:from-purple-900/50 dark:group-hover:to-purple-900/50',
                iconClass: 'text-purple-600 dark:text-purple-400',
                delay: 0.3,
              },
            ].map((feature, _index) => (
              <motion.div
                key={feature.title}
                className="group text-center p-8 rounded-2xl hover:shadow-2xl dark:hover:shadow-gray-900/20 transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: isFeaturesInView ? 1 : 0, 
                  y: isFeaturesInView ? 0 : 30 
                }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-20 h-20 ${feature.bgClass} rounded-2xl mb-6 ${feature.hoverBgClass} transition-all duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className={`w-10 h-10 ${feature.iconClass}`} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        ref={adventuresRef}
        className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAdventuresInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: isAdventuresInView ? 1 : 0, 
              y: isAdventuresInView ? 0 : 30 
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              {viewMode === 'feed' ? 'Activity Feed' : 'Recent Adventures'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto transition-colors duration-300">
              {viewMode === 'feed' 
                ? 'Stay updated with the latest adventures from your community'
                : 'Discover amazing adventures from explorers around the world'
              }
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading..." />
            </div>
          ) : viewMode === 'feed' && user ? (
            /* Activity Feed */
            <ActivityFeed
              activities={activities}
              onLike={handleActivityLike}
              onFollow={handleActivityFollow}
              onTripClick={handleTripClick}
              currentUserId={user.id}
            />
          ) : viewMode === 'explore' || !user ? (
            /* Adventure Cards */
            filteredAndSortedTrips.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <Camera className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  No adventures found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedTrips.map((trip: Trip, index: number) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ 
                      opacity: isAdventuresInView ? 1 : 0, 
                      y: isAdventuresInView ? 0 : 30 
                    }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <AdventureCard
                      trip={trip}
                      index={index}
                      onLike={toggleLike}
                      onSave={toggleSave}
                      onTripClick={handleTripClick}
                    />
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            /* Empty Feed State for Logged in Users */
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Users className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                No activity in your feed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300 mb-4">
                Follow some adventurers to see their activities here
              </p>
              <button
                onClick={() => setViewMode('explore')}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Explore Adventures
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* CTA Section */}
      {!user && (
        <motion.div
          className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-700 dark:to-blue-700 py-20 transition-colors duration-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to share your adventures?
            </motion.h2>
            <motion.p
              className="text-emerald-100 dark:text-emerald-200 text-xl mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of outdoor enthusiasts already sharing their stories
            </motion.p>
            <motion.button
              onClick={() => {
                setAuthMode('signup')
                setShowAuthModal(true)
              }}
              className="group bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 inline-flex items-center shadow-2xl hover:shadow-white/25"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors duration-300"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <TreePine className="w-6 h-6" />
              <span className="text-xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME || 'Jurni'}</span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-gray-400 dark:text-gray-500">
                Made with ❤️ for outdoor enthusiasts
              </span>
            </motion.div>
          </div>
        </div>
      </motion.footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                {authMode === 'signin'
                  ? 'Welcome Back'
                  : `Join ${process.env.NEXT_PUBLIC_APP_NAME || 'Jurni'}`}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthForm((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthForm((prev: any) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthForm((prev: any) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="••••••••"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300"
              >
                {authMode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>

            <motion.button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* AI Trip Assistant Modal */}
      <AITripAssistant
        trip={{
          location: selectedTrip?.location || 'Yosemite National Park, CA',
          duration: selectedTrip?.duration || '1 day',
          season: selectedTrip?.season || 'Spring',
          distance: selectedTrip?.distance || 0
        }}
        isVisible={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
      />

      {/* Voice Search Modal */}
      <VoiceSearch
        onSearch={handleVoiceSearch}
        isOpen={showVoiceSearch}
        onClose={() => setShowVoiceSearch(false)}
      />

      {/* Weather Widget Modal */}
      <WeatherWidget
        location="Yosemite National Park, CA"
        isVisible={showWeather}
        onClose={() => setShowWeather(false)}
      />

      {/* Interactive Map Modal */}
      {showMap && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Interactive Map
              </h3>
              <motion.button
                onClick={() => setShowMap(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>
            <InteractiveMap
              markers={mapMarkers}
              center={{ lat: 37.8651, lng: -119.5383 }}
              zoom={10}
              onMarkerClick={handleMarkerClick}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
