import { io, type Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket: Socket | null = null

/**
 * Connect to socket server with authenticated bearer token in handshake
 */
export function connectSocket(accessToken: string): Socket {
  if (socket?.connected) {
    // If token has changed, update authorization and reconnect
    socket.auth = { token: accessToken }
    socket.io.opts.extraHeaders = {
      authorization: `Bearer ${accessToken}`,
    }
    return socket
  }

  if (socket) {
    socket.disconnect()
  }

  socket = io(SOCKET_URL, {
    auth: { token: accessToken },
    extraHeaders: {
      authorization: `Bearer ${accessToken}`,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  return socket
}

export function getSocket(): Socket | null {
  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
