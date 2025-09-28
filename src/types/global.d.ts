// Global type declarations to suppress missing module errors during development
declare module 'framer-motion'
declare module 'lucide-react'
declare module 'next/image'
declare module 'next/link'
declare module 'react'
declare module 'react-dom'

// Node.js globals
declare const process: any

// Suppress strict type checking for development
declare global {
  var any: any
}
