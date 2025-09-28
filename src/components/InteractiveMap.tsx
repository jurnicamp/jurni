import { motion } from 'framer-motion'
import { MapPin, Navigation, Layers, Satellite, Terrain } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  type: 'camping' | 'hiking' | 'viewpoint' | 'danger'
  difficulty: 'easy' | 'moderate' | 'hard'
  distance?: number
  elevation?: number
}

interface InteractiveMapProps {
  markers: MapMarker[]
  center: { lat: number; lng: number }
  zoom: number
  onMarkerClick?: (marker: MapMarker) => void
}

export function InteractiveMap({ markers, center, _zoom, onMarkerClick }: InteractiveMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [_mapType, setMapType] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite')
  const [is3DMode, setIs3DMode] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'camping': return 'text-green-500'
      case 'hiking': return 'text-blue-500'
      case 'viewpoint': return 'text-purple-500'
      case 'danger': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
      case 'moderate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
    }
  }

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full relative">
        {/* Mock 3D Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* 3D Terrain Effect */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 bg-white/10 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Markers */}
          {markers.map((marker, index) => (
            <motion.div
              key={marker.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${50 + (marker.lng - center.lng) * 100}%`,
                top: `${50 + (marker.lat - center.lat) * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => {
                setSelectedMarker(marker)
                onMarkerClick?.(marker)
              }}
            >
              <div className={`relative ${getMarkerColor(marker.type)}`}>
                <MapPin className="w-6 h-6 drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-current"></div>
              </div>
              
              {/* Marker Label */}
              <motion.div
                className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                initial={{ y: -10 }}
                whileHover={{ y: 0 }}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {marker.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(marker.difficulty)}`}>
                    {marker.difficulty}
                  </span>
                  {marker.distance && (
                    <span className="text-xs text-gray-500">
                      {marker.distance}mi
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <motion.button
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapType('satellite')}
          >
            <Satellite className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </motion.button>
          <motion.button
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMapType('terrain')}
          >
            <Terrain className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </motion.button>
          <motion.button
            className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIs3DMode(!is3DMode)}
          >
            <Layers className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>

        {/* 3D Toggle */}
        <div className="absolute bottom-4 left-4">
          <motion.button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              is3DMode 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIs3DMode(!is3DMode)}
          >
            {is3DMode ? '3D Mode' : '2D Mode'}
          </motion.button>
        </div>
      </div>

      {/* Selected Marker Info */}
      {selectedMarker && (
        <motion.div
          className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {selectedMarker.title}
            </h3>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(selectedMarker.difficulty)}`}>
                {selectedMarker.difficulty}
              </span>
              {selectedMarker.distance && (
                <span className="text-sm text-gray-500">
                  {selectedMarker.distance} miles
                </span>
              )}
            </div>
            {selectedMarker.elevation && (
              <p className="text-sm text-gray-500">
                Elevation: {selectedMarker.elevation}ft
              </p>
            )}
            <button className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all duration-300">
              Plan Trip Here
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
