import { createClient } from 'redis'

const client = createClient({
  url: process.env.VALKEY_URL,
})

client.on('error', (err) => console.log('Valkey Error:', err))

if (!client.isOpen) {
  client.connect()
}

export default client
