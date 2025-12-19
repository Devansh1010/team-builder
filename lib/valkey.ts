import { createClient } from 'redis'

/**
 * PRODUCTION-GRADE CONFIGURATION
 * Using 'redis' package to connect to Valkey (fully compatible)
 */
const client = createClient({
  url: process.env.VALKEY_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      // Exponential backoff: wait longer between each retry
      return Math.min(retries * 50, 2000)
    },
  },
})

// 1. Centralized Error Handling
client.on('error', (err) => {
  console.error('Valkey Client Error:', err)
})

client.on('connect', () => {
  console.log('Valkey Client Connected')
})

// 2. Safe Connection Wrapper
// Top-level await is supported in modern Node.js/ESM
const connectValkey = async () => {
  try {
    if (!client.isOpen) {
      await client.connect()
    }
  } catch (error) {
    console.error('Could not establish Valkey connection:', error)
    // In production, you might want to trigger an alert here
  }
}

connectValkey()

export default client
