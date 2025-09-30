import { motion, AnimatePresence } from 'framer-motion'
import { Bot, MapPin, Clock, Cloud, AlertTriangle, Lightbulb } from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'

interface TripSuggestion {
  id: string
  type: 'route' | 'weather' | 'gear' | 'timing' | 'safety'
  title: string
  description: string
  icon: React.ReactNode
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
}

interface AITripAssistantProps {
  trip: {
    location: string
    difficulty: string
    duration: string
    season: string
    distance?: number
  }
  isVisible: boolean
  onClose: () => void
}

export function AITripAssistant({ trip, isVisible, onClose }: AITripAssistantProps) {
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const generateSuggestions = useCallback(async () => {
    setIsLoading(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const aiSuggestions: TripSuggestion[] = [
      {
        id: '1',
        type: 'route',
        title: 'Recommended Route',
        description: `Based on your ${trip.difficulty} difficulty preference, I recommend the 8-mile loop trail with stunning valley views. Perfect for ${trip.duration} trips!`,
        icon: MapPin,
        priority: 'high',
        actionable: true
      },
      {
        id: '2',
        type: 'weather',
        title: 'Weather Alert',
        description: '60% chance of afternoon showers. Pack your rain gear and consider starting earlier to avoid the storm.',
        icon: Cloud,
        priority: 'high',
        actionable: true
      },
      {
        id: '3',
        type: 'timing',
        title: 'Best Start Time',
        description: 'Start at 6:30 AM for the best lighting and to avoid crowds. You\'ll catch the sunrise at the summit!',
        icon: Clock,
        priority: 'medium',
        actionable: true
      },
      {
        id: '4',
        type: 'gear',
        title: 'Essential Gear',
        description: 'Don\'t forget: extra water (3L), first aid kit, and emergency shelter. Trail conditions are rocky.',
        icon: Lightbulb,
        priority: 'medium',
        actionable: true
      },
      {
        id: '5',
        type: 'safety',
        title: 'Safety Notice',
        description: 'Cell service is limited past mile 3. Share your route with someone and bring a satellite communicator.',
        icon: AlertTriangle,
        priority: 'high',
        actionable: true
      }
    ]
    
    setSuggestions(aiSuggestions)
    setIsLoading(false)
  }, [trip.difficulty, trip.duration])

  useEffect(() => {
    if (isVisible) {
      generateSuggestions()
    }
  }, [isVisible, generateSuggestions])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20'
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Trip Assistant
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Personalized recommendations for your adventure
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-gray-600 dark:text-gray-300">
                  Analyzing your trip preferences...
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion: TripSuggestion, index: number) => (
                  <motion.div
                    key={suggestion.id}
                    className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                      suggestion.priority === 'high' 
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                        : suggestion.priority === 'medium'
                        ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getPriorityColor(suggestion.priority)}`}>
                        <suggestion.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {suggestion.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(suggestion.priority)}`}>
                            {suggestion.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {suggestion.description}
                        </p>
                        {suggestion.actionable && (
                          <button className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                            Learn more →
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Powered by AI • Updated 2 minutes ago
                </p>
                <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                  Customize preferences
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
