import { motion } from 'framer-motion'
import { Layers, Satellite, Mountain } from 'lucide-react'
import React, { useState, useRef } from 'react'

interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  type: 'camping' | 'hiking' | 'viewpoint' | 'danger'
  distance?: number
  elevation?: number
}

interface InteractiveMapProps {
  markers: MapMarker[]
  center: { lat: number; lng: number }
  zoom: number
  onMarkerClick?: (_marker: MapMarker) => void
}

export function InteractiveMap({ markers, center, zoom: _zoom, onMarkerClick }: InteractiveMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [mapType, setMapType] = useState<'satellite' | 'terrain' | 'road'>('satellite')
  const mapRef = useRef<HTMLDivElement>(null)

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'camping': 
        return 'bg-emerald-500'
      case 'hiking': 
        return 'bg-blue-500'
      case 'viewpoint': 
        return 'bg-purple-500'
      case 'danger': 
        return 'bg-red-500'
      default: 
        return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'camping': 
        return '🏕️'
      case 'hiking': 
        return '🥾'
      case 'viewpoint': 
        return '👁️'
      case 'danger': 
        return '⚠️'
      default: 
        return '📍'
    }
  }

  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <motion.button
          onClick={() => setMapType('satellite')}
          className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
            mapType === 'satellite'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Satellite className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={() => setMapType('terrain')}
          className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
            mapType === 'terrain'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-white/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mountain className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={() => setMapType('road')}
          className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
            mapType === 'road'
              ? 'bg-gray-500 text-white shadow-lg'
              : 'bg-white/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Layers className="w-4 h-4" />
        </motion.button>
      </div>

      <div ref={mapRef} className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-blue-200 to-purple-200 dark:from-emerald-900 dark:via-blue-900 dark:to-purple-900">
          <div className="absolute inset-0 opacity-20 bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {markers.map((marker, index) => (
          <motion.div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${50 + (marker.lng - center.lng) * 100}%`,
              top: `${50 - (marker.lat - center.lat) * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => {
              setSelectedMarker(marker)
              onMarkerClick?.(marker)
            }}
          >
            <div className={`w-6 h-6 rounded-full ${getMarkerColor(marker.type)} shadow-lg border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold`}>
              {getTypeIcon(marker.type)}
            </div>
            
            <motion.div
              className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded text-xs font-medium shadow-lg whitespace-nowrap"
              initial={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {marker.title}
            </motion.div>
          </motion.div>
        ))}

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-red-500 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {selectedMarker && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedMarker.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMarkerColor(selectedMarker.type)} text-white`}>
                  {selectedMarker.type}
                </span>
                <span className="text-xs">
                  {getTypeIcon(selectedMarker.type)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Coordinates:</span>
              <p className="font-mono text-xs">{selectedMarker.lat.toFixed(4)}, {selectedMarker.lng.toFixed(4)}</p>
            </div>
            {selectedMarker.distance && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Distance:</span>
                <p className="font-semibold">{selectedMarker.distance} km</p>
              </div>
            )}
            {selectedMarker.elevation && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Elevation:</span>
                <p className="font-semibold">{selectedMarker.elevation} m</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
