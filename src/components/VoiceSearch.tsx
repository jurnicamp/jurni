import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

interface VoiceSearchProps {
  onSearch: (_query: string) => void
  isOpen: boolean
  onClose: () => void
}

export function VoiceSearch({ onSearch, isOpen, onClose }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(true)
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        if (transcript) {
          setIsProcessing(true)
          setTimeout(() => {
            onSearch(transcript)
            setIsProcessing(false)
            onClose()
          }, 1000)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setTranscript('')
      }

      recognitionRef.current.onnomatch = () => {
        // No speech was recognized
        setIsListening(false)
      }
    } else {
      setIsSupported(false)
    }
  }, [transcript, onSearch, onClose])

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('')
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Voice Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Speak naturally to find adventures
              </p>
            </div>

            {/* Voice Visualizer */}
            <div className="mb-8">
              <motion.div
                className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  isListening 
                    ? 'bg-gradient-to-br from-emerald-400 to-blue-500' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
                animate={isListening ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.4)',
                    '0 0 0 20px rgba(59, 130, 246, 0)',
                    '0 0 0 0 rgba(59, 130, 246, 0)'
                  ]
                } : {}}
                transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
              >
                {isListening ? (
                  <Mic className="w-12 h-12 text-white" />
                ) : (
                  <MicOff className="w-12 h-12 text-gray-400" />
                )}
              </motion.div>

              {/* Transcript */}
              <AnimatePresence>
                {transcript && (
                  <motion.div
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-gray-900 dark:text-white font-medium">
                      &ldquo;{transcript}&rdquo;
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isListening 
                  ? 'Listening...' 
                  : isProcessing 
                  ? 'Processing your request...' 
                  : 'Tap the microphone to start'
                }
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              {!isSupported ? (
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Voice search is not supported in your browser. Please use Chrome, Safari, or Edge.
                  </p>
                  <motion.button
                    className="p-4 rounded-full bg-gray-400 text-white cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                  >
                    <MicOff className="w-6 h-6" />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  className={`p-4 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                  onClick={isListening ? stopListening : startListening}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isProcessing}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>
              )}

              {isSupported && (
                <motion.button
                  className={`p-4 rounded-full transition-all duration-300 ${
                    isMuted 
                      ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={toggleMute}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </motion.button>
              )}
            </div>

            {/* Examples */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Try saying:
              </p>
              <div className="space-y-2">
                {[
                  "Show me easy hiking trails near me",
                  "Find camping spots in Yosemite",
                  "What's the weather like for mountain hiking?",
                  "Plan a 3-day backpacking trip"
                ].map((example, index) => (
                  <motion.button
                    key={index}
                    className="block w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    onClick={() => {
                      setTranscript(example)
                      onSearch(example)
                      onClose()
                    }}
                    whileHover={{ x: 5 }}
                  >
                    &ldquo;{example}&rdquo;
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
