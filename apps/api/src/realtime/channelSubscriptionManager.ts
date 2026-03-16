import type WebSocket from 'ws'

class ChannelSubscriptionManager {
  private channels = new Map<string, Set<WebSocket>>()

  subscribe(channelId: string, socket: WebSocket) {
    if (!this.channels.has(channelId)) {
      this.channels.set(channelId, new Set())
    }

    this.channels.get(channelId)!.add(socket)
  }

  unsubscribe(channelId: string, socket: WebSocket) {
    const sockets = this.channels.get(channelId)

    if (!sockets) return

    sockets.delete(socket)

    if (sockets.size === 0) {
      this.channels.delete(channelId)
    }
  }

  broadcast(channelId: string, payload: unknown, exclude?: WebSocket) {
    const sockets = this.channels.get(channelId)
  
    if (!sockets) return
  
    const message = JSON.stringify(payload)
  
    for (const socket of sockets) {
    
      if (socket === exclude) continue
    
      socket.send(message)
    }
  }


  removeSocket(socket: WebSocket) {
    for (const sockets of this.channels.values()) {
      sockets.delete(socket)
    }
  }
}

export const channelSubscriptionManager = new ChannelSubscriptionManager()
