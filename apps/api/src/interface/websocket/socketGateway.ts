import type WebSocket from 'ws'
import type { ServerEvent } from '@/shared/schemas/event.schema.js'

export class SocketGateway {
  private clients: Map<string, WebSocket> = new Map()

  addClient(userId: string, socket: WebSocket) {
    console.log("adding client @ add client")
    console.log(userId, " : ", typeof(socket))

    this.clients.set(userId, socket)
  }

  removeClient(userId: string) {
    this.clients.delete(userId)
  }

  sendToUser(userId: string, event: ServerEvent) {
    console.log("sending to user @ sendToUser", event)

    const socket = this.clients.get(userId)

    if (socket && socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(event))
    }
  }

  broadcast(event: ServerEvent) {
    for (const socket of this.clients.values()) {
      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify(event))
      }
    }
  }
}
