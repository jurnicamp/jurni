import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Eye, Droplets } from 'lucide-react'
import React, { useState, useEffect } from 'react'

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  precipitation: number
  hourly: Array<{
    time: string
    temperature: number
    condition: string
    precipitation: number
  }>
  alerts: Array<{
    type: 'warning' | 'watch' | 'advisory'
    title: string
    description: string
  }>
}

interface WeatherWidgetProps {
  location: string
  isVisible: boolean
  onClose: () => void
}

export function WeatherWidget({ location, isVisible, onClose }: WeatherWidgetProps) {
  const [weather, setWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isVisible) {
      fetchWeatherData()
    }
  }, [isVisible, location])

  const fetchWeatherData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockWeather: WeatherData = {
      temperature: 72,
      condition: 'partly-cloudy',
      humidity: 65,
      windSpeed: 8,
      visibility: 10,
      precipitation: 20,
      hourly: [
        { time: '6 AM', temperature: 68, condition: 'clear', precipitation: 0 },
        { time: '9 AM', temperature: 72, condition: 'partly-cloudy', precipitation: 10 },
        { time: '12 PM', temperature: 76, condition: 'partly-cloudy', precipitation: 15 },
        { time: '3 PM', temperature: 78, condition: 'cloudy', precipitation: 30 },
        { time: '6 PM', temperature: 74, condition: 'rain', precipitation: 60 },
        { time: '9 PM', temperature: 70, condition: 'rain', precipitation: 80 },
      ],
      alerts: [
        {
          type: 'warning',
          title: 'Thunderstorm Warning',
          description: 'Severe thunderstorms expected between 3-6 PM. Avoid exposed areas.'
        }
      ]
    }
    
    setWeather(mockWeather)
    setIsLoading(false)
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return Sun
      case 'partly-cloudy': return Cloud
      case 'cloudy': return Cloud
      case 'rain': return CloudRain
      case 'snow': return CloudSnow
      default: return Sun
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'clear': return 'text-yellow-500'
      case 'partly-cloudy': return 'text-blue-500'
      case 'cloudy': return 'text-gray-500'
      case 'rain': return 'text-blue-600'
      case 'snow': return 'text-blue-300'
      default: return 'text-gray-500'
    }
  }

  if (!isVisible) return null

  return (
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
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Weather Forecast
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : weather ? (
          <div className="space-y-6">
            {/* Current Weather */}
            <div className="text-center">
              <motion.div
                className="flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {(() => {
                  const Icon = getWeatherIcon(weather.condition)
                  return <Icon className={`w-16 h-16 ${getConditionColor(weather.condition)}`} />
                })()}
              </motion.div>
              <h4 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {weather.temperature}°F
              </h4>
              <p className="text-lg text-gray-600 dark:text-gray-300 capitalize">
                {weather.condition.replace('-', ' ')}
              </p>
            </div>

            {/* Weather Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
                { icon: Wind, label: 'Wind', value: `${weather.windSpeed} mph` },
                { icon: Eye, label: 'Visibility', value: `${weather.visibility} mi` },
                { icon: CloudRain, label: 'Precip', value: `${weather.precipitation}%` },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <stat.icon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Hourly Forecast */}
            <div>
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Hourly Forecast
              </h5>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {weather.hourly.map((hour: any, index: number) => {
                  const Icon = getWeatherIcon(hour.condition)
                  return (
                    <motion.div
                      key={index}
                      className="flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center min-w-[80px]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{hour.time}</p>
                      <Icon className={`w-6 h-6 ${getConditionColor(hour.condition)} mx-auto mb-2`} />
                      <p className="font-semibold text-gray-900 dark:text-white">{hour.temperature}°</p>
                      <p className="text-xs text-gray-500">{hour.precipitation}%</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Weather Alerts */}
            {weather.alerts.length > 0 && (
              <div>
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Weather Alerts
                </h5>
                {weather.alerts.map((alert: any, index: number) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'warning' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500' 
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {alert.title}
                    </h6>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {alert.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                Adventure Recommendations
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {weather.precipitation > 50 
                  ? "Consider indoor activities or wait for better weather. If you must go out, bring rain gear and avoid exposed areas."
                  : weather.temperature < 50
                  ? "Perfect weather for hiking! Dress in layers and bring extra warm clothing."
                  : "Great weather for outdoor activities! Don't forget sunscreen and plenty of water."
                }
              </p>
            </div>
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  )
}
