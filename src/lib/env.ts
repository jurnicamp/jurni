import { z } from 'zod'

// Client-side environment variables (NEXT_PUBLIC_*)
const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('Jurni'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
})

// Server-side environment variables
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),

  // OAuth providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Email
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET_NAME: z.string().optional(),
  AWS_S3_REGION: z.string().optional(),

  // Third-party APIs
  SENTRY_DSN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
})

const _clientEnv = clientSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})

const _serverEnv = serverSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_S3_REGION: process.env.AWS_S3_REGION,

  SENTRY_DSN: process.env.SENTRY_DSN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
})

if (!_clientEnv.success) {
  console.error('❌ Invalid client environment variables:', _clientEnv.error.format())
  throw new Error('Invalid client environment variables')
}

if (!_serverEnv.success) {
  console.error('❌ Invalid server environment variables:', _serverEnv.error.format())
  throw new Error('Invalid server environment variables')
}

// Create a proxy to ensure server-side env vars are not accessible on client
const createEnvProxy = <T extends Record<string, unknown>>(env: T) => {
  return new Proxy(env, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined

      // Allow access to client env vars anywhere
      if (prop.startsWith('NEXT_PUBLIC_')) {
        return target[prop as keyof T]
      }

      // Only allow server env vars on server side
      if (typeof window === 'undefined') {
        return target[prop as keyof T]
      }

      throw new Error(
        `❌ Attempted to access server-side environment variable "${prop}" on the client side.`
      )
    },
  })
}

export const env = createEnvProxy({
  ..._clientEnv.data,
  ..._serverEnv.data,
})

// Type-only export for use in other files
export type Env = typeof env
