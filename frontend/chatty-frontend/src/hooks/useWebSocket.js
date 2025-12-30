import { useRef, useCallback, useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'
import { WS_SOCKJS_URL } from '../config'

/**
 * Custom hook for managing WebSocket connections using STOMP protocol
 * @param {Object} options - Hook options
 * @param {string} options.userId - The current user's ID for subscription
 * @param {function} options.onMessage - Callback when a message is received
 * @param {function} options.onConnect - Callback when connection is established
 * @param {function} options.onDisconnect - Callback when disconnected
 * @param {function} options.onError - Callback when an error occurs
 */
export function useWebSocket({ userId, onMessage, onConnect, onDisconnect, onError }) {
  const clientRef = useRef(null)
  const subscriptionRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState(null)

  const connect = useCallback(() => {
    if (clientRef.current?.active) {
      console.log('WebSocket already connected')
      return
    }

    console.log('Connecting to WebSocket at:', WS_SOCKJS_URL)

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_SOCKJS_URL),
      debug: (str) => {
        console.log('STOMP Debug:', str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected successfully')
        setIsConnected(true)
        setConnectionError(null)
        
        // Subscribe to user's message queue
        if (userId) {
          const destination = `/queue/messages/${userId}`
          console.log('Subscribing to:', destination)
          
          subscriptionRef.current = client.subscribe(destination, (message) => {
            console.log('Received message:', message.body)
            try {
              const parsedMessages = JSON.parse(message.body)
              onMessage?.(parsedMessages)
            } catch (e) {
              console.error('Failed to parse message:', e)
            }
          })
        }
        
        onConnect?.()
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        onDisconnect?.()
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message'])
        setConnectionError(frame.headers['message'])
        onError?.(frame.headers['message'])
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event)
        setConnectionError('WebSocket connection failed')
        onError?.('WebSocket connection failed')
      }
    })

    clientRef.current = client
    client.activate()
  }, [userId, onMessage, onConnect, onDisconnect, onError])

  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      console.log('Unsubscribing from message queue')
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }
    
    if (clientRef.current?.active) {
      console.log('Deactivating WebSocket client')
      clientRef.current.deactivate()
    }
    
    setIsConnected(false)
  }, [])

  const sendMessage = useCallback((senderId, receiverId, messageText) => {
    if (!clientRef.current?.active) {
      console.error('WebSocket not connected')
      return false
    }

    const destination = `/app/messages/send/${senderId}/${receiverId}`
    const messageBody = JSON.stringify({
      sender: senderId,
      receiver: receiverId,
      messageText: messageText
    })

    console.log('Sending message to:', destination, messageBody)
    clientRef.current.publish({
      destination,
      body: messageBody
    })

    return true
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    connectionError
  }
}

export default useWebSocket

