import type WebSocket from 'ws'

class ConnectionRegistry {
  private connections = new Map<string, Set<WebSocket>>()

  add(userId: string, socket: WebSocket) {
    if (!this.connections.has(userId)) {
      this.connections.set(userId, new Set())
    }

    this.connections.get(userId)!.add(socket)
  }

  remove(userId: string, socket: WebSocket) {
    const userSockets = this.connections.get(userId)

    if (!userSockets) return

    userSockets.delete(socket)

    if (userSockets.size === 0) {
      this.connections.delete(userId)
    }
  }

  get(userId: string) {
    return this.connections.get(userId)
  }

  sendToUser(userId: string, payload: unknown) {
    const sockets = this.connections.get(userId)

    if (!sockets) return

    const message = JSON.stringify(payload)

    for (const socket of sockets) {
      socket.send(message)
    }
  }
}

export const connectionRegistry = new ConnectionRegistry()
