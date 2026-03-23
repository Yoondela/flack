type MessageHandler = (data: any) => void

class ChatSocket {
  private socket: WebSocket | null = null
  private handler: MessageHandler | null = null

  connect(userId: string) {
    this.socket = new WebSocket(`ws://localhost:3001/ws?userId=${userId}`)

    this.socket.onopen = () => {
      console.log('WS CONNECTED')
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handler?.(data)
    }

    this.socket.onclose = () => {
      console.log('WS CLOSED')
    }
  }

  onMessage(handler: MessageHandler) {
    this.handler = handler
  }

  send(event: any) {
    this.socket?.send(JSON.stringify(event))
  }
}

export const chatSocket = new ChatSocket()
