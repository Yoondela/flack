import { routeWSEvent } from "./ws-router"

let socket: WebSocket | null = null

export function connectSocket(userId: string) {

  if (socket) return socket

  socket = new WebSocket(
    `${process.env.NEXT_PUBLIC_WS_URL}?userId=${userId}`
  )

  socket.onopen = () => {
    console.log("WS connected")
  }

  socket.onmessage = (event) => {

    const data = JSON.parse(event.data)

    console.log("WS event:", data)

    routeWSEvent(data)

  }

  socket.onclose = () => {
    console.log("WS closed")
    socket = null
  }

  return socket
}

export function sendWS(type: string, payload: any) {

  if (!socket) return

  socket.send(
    JSON.stringify({
      type,
      payload
    })
  )
}

export function getSocket() {
  return socket
}
