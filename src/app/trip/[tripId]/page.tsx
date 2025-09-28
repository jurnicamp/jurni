'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Share, Bookmark, MapPin, Clock, Users2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { CommentSection } from '@/components/CommentSection'

// Mock data
const mockTrip = {
  id: '1',
  title: 'Amazing Mountain Hike',
  description: 'Beautiful sunrise from the peak with incredible views of the valley below. Perfect weather and great company! We started early in the morning around 5 AM to catch the sunrise at the summit. The trail was challenging but well-marked, with several rest points along the way. The view from the top was absolutely breathtaking - you could see for miles in every direction. Definitely recommend this hike to anyone looking for a moderate challenge with spectacular rewards.',
  location: 'Yosemite National Park, CA',
  likes: 24,
  comments: 8,
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  duration: '2 days',
  groupSize: 4,
  season: 'Spring',
  tags: ['Hiking', 'Photography', 'Sunrise'],
  distance: 12.5,
  elevation: 4000,
  user: {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    bio: 'Mountain enthusiast and photographer',
    followers: 1250,
    following: 340,
    trips: 45,
  },
  photos: [
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=600&fit=crop' },
  ],
  isLiked: false,
  isSaved: false,
}

const mockComments = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    content: 'Wow, those views are incredible! How was the weather during your hike?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 3,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        user: {
          id: '1',
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        },
        content: 'The weather was perfect! Clear skies all morning.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        likes: 1,
        isLiked: true,
      }
    ],
  },
  {
    id: '2',
    user: {
      id: '3',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    },
    content: 'I\'ve been wanting to do this hike for ages! Thanks for the inspiration. What gear did you bring?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    likes: 1,
    isLiked: true,
  },
  {
    id: '3',
    user: {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    },
    content: 'Perfect timing for the sunrise shot! 📸 The colors are amazing.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    likes: 2,
    isLiked: false,
  },
]

interface TripDetailPageProps {
  params: {
    tripId: string
  }
}

export default function TripDetailPage({ params }: TripDetailPageProps) {
  const [trip, setTrip] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [currentUserId] = useState('current-user-id') // Replace with real user ID

  useEffect(() => {
    // Mock API call - replace with real API
    if (params.tripId === '1') {
      setTrip(mockTrip)
      setComments(mockComments)
      setIsLiked(mockTrip.isLiked)
      setIsSaved(mockTrip.isSaved)
      setLikesCount(mockTrip.likes)
    }
    setLoading(false)
  }, [params.tripId])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment = {
      id: Date.now().toString(),
      user: {
        id: currentUserId,
        name: 'You',
        avatar: 'https://via.placeholder.com/40x40/22C55E/FFFFFF?text=Y',
      },
      content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    }

    if (parentId) {
      // Add as reply
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newComment]
          }
        }
        return comment
      }))
    } else {
      // Add as top-level comment
      setComments([...comments, newComment])
    }
  }

  const handleCommentLike = (commentId: string) => {
    const updateCommentLike = (commentList: any[]): any[] => {
      return commentList.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentLike(comment.replies)
          }
        }
        return comment
      })
    }

    setComments(updateCommentLike(comments))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Trip not found</h1>
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
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to feed
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-96 bg-gray-100 dark:bg-gray-700">
                <Image
                  src={trip.photos[currentPhotoIndex]?.url || ''}
                  alt={trip.title}
                  fill
                  className="object-cover"
                />
                
                {/* Photo Navigation */}
                {trip.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      disabled={currentPhotoIndex === 0}
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentPhotoIndex(Math.min(trip.photos.length - 1, currentPhotoIndex + 1))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      disabled={currentPhotoIndex === trip.photos.length - 1}
                    >
                      ›
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {trip.photos.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1} / {trip.photos.length}
                </div>
              </div>

              {/* Photo Thumbnails */}
              {trip.photos.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {trip.photos.map((photo: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden ${
                        index === currentPhotoIndex ? 'ring-2 ring-emerald-500' : ''
                      }`}
                    >
                      <Image
                        src={photo.url}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Trip Details */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* User Info */}
              <div className="flex items-center justify-between mb-6">
                <Link 
                  href={`/profile/${trip.user.id}`}
                  className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded-lg transition-colors"
                >
                  <Image
                    src={trip.user.avatar}
                    alt={trip.user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{trip.user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(trip.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isLiked
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likesCount}</span>
                  </motion.button>

                  <motion.button
                    onClick={handleSave}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isSaved
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>
              </div>

              {/* Title and Description */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{trip.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{trip.description}</p>

              {/* Location */}
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
                <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
                <span>{trip.location}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {trip.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Comments ({comments.length})
              </h3>

              <CommentSection
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleCommentLike}
                currentUserId={currentUserId}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Stats */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trip Details</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">{trip.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users2 className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Group Size</p>
                    <p className="font-medium text-gray-900 dark:text-white">{trip.groupSize} people</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Distance</p>
                    <p className="font-medium text-gray-900 dark:text-white">{trip.distance} miles</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Similar Trips */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Similar Adventures</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Similar Trip {i}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Location Name</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
