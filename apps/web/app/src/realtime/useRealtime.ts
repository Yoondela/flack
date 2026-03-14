'use client'

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { ClientEvent, ConnectionStatus, Message } from './types'
import { parseServerEvent } from './guards'

const DEFAULT_WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000/ws'

type State = {
  status: ConnectionStatus
  error: string | null
  joinedChannels: string[]
  activeChannelId: string | null
  messagesByChannel: Record<string, Message[]>
}

type Action =
  | { type: 'STATUS'; status: ConnectionStatus; error?: string | null }
  | { type: 'JOINED_CHANNEL'; channelId: string; history: Message[] }
  | { type: 'LEFT_CHANNEL'; channelId: string }
  | { type: 'ACTIVE_CHANNEL'; channelId: string | null }
  | { type: 'MESSAGE_RECEIVED'; message: Message }

const initialState: State = {
  status: 'idle',
  error: null,
  joinedChannels: [],
  activeChannelId: null,
  messagesByChannel: {},
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'STATUS':
      return {
        ...state,
        status: action.status,
        error: action.error ?? (action.status === 'error' ? state.error : null),
      }

    case 'JOINED_CHANNEL': {
      const joinedChannels = state.joinedChannels.includes(action.channelId)
        ? state.joinedChannels
        : [...state.joinedChannels, action.channelId]

      return {
        ...state,
        joinedChannels,
        activeChannelId: action.channelId,
        messagesByChannel: {
          ...state.messagesByChannel,
          [action.channelId]: action.history,
        },
      }
    }

    case 'LEFT_CHANNEL': {
      const joinedChannels = state.joinedChannels.filter(
        (channelId) => channelId !== action.channelId
      )
      const { [action.channelId]: _, ...restMessages } = state.messagesByChannel
      const activeChannelId =
        state.activeChannelId === action.channelId
          ? joinedChannels[0] ?? null
          : state.activeChannelId

      return {
        ...state,
        joinedChannels,
        activeChannelId,
        messagesByChannel: restMessages,
      }
    }

    case 'ACTIVE_CHANNEL':
      return {
        ...state,
        activeChannelId: action.channelId,
      }

    case 'MESSAGE_RECEIVED': {
      const channelId = action.message.channelId
      const existing = state.messagesByChannel[channelId] ?? []
      return {
        ...state,
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: [...existing, action.message],
        },
      }
    }

    default:
      return state
  }
}

function normalizeChannelId(value: string): string {
  return value.trim()
}

export function useRealtime(wsUrl = DEFAULT_WS_URL) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const socketRef = useRef<WebSocket | null>(null)
  const joinQueueRef = useRef<string[]>([])

  const sendRaw = useCallback((event: ClientEvent) => {
    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) return false
    socket.send(JSON.stringify(event))
    return true
  }, [])

  const handleMessage = useCallback((message: Message) => {
    dispatch({ type: 'MESSAGE_RECEIVED', message })
  }, [])

  const handleChannelJoined = useCallback((history: Message[]) => {
    const channelFromHistory = history[0]?.channelId
    const queued = joinQueueRef.current.shift()
    const channelId = channelFromHistory ?? queued
    if (!channelId) return
    dispatch({ type: 'JOINED_CHANNEL', channelId, history })
  }, [])

  const connect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close()
    }

    dispatch({ type: 'STATUS', status: 'connecting', error: null })
    const socket = new WebSocket(wsUrl)
    socketRef.current = socket

    socket.addEventListener('open', () => {
      dispatch({ type: 'STATUS', status: 'open', error: null })
    })

    socket.addEventListener('close', () => {
      dispatch({ type: 'STATUS', status: 'closed' })
    })

    socket.addEventListener('error', () => {
      dispatch({ type: 'STATUS', status: 'error', error: 'WebSocket error' })
    })

    socket.addEventListener('message', (event) => {
      let parsed: unknown
      try {
        parsed = JSON.parse(event.data)
      } catch {
        dispatch({ type: 'STATUS', status: 'error', error: 'Invalid JSON from server' })
        return
      }

      const serverEvent = parseServerEvent(parsed)
      if (!serverEvent) return

      switch (serverEvent.type) {
        case 'MESSAGE_CREATED':
          handleMessage(serverEvent.payload)
          break

        case 'CHANNEL_JOINED':
          handleChannelJoined(serverEvent.payload)
          break

        case 'ERROR':
          dispatch({ type: 'STATUS', status: 'error', error: serverEvent.payload.message })
          break

        default:
          break
      }
    })
  }, [handleChannelJoined, handleMessage, wsUrl])

  const disconnect = useCallback(() => {
    socketRef.current?.close()
    socketRef.current = null
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  const joinChannel = useCallback(
    (channelId: string) => {
      const normalized = normalizeChannelId(channelId)
      if (!normalized) return
      joinQueueRef.current.push(normalized)
      sendRaw({ type: 'JOIN_CHANNEL', payload: { channelId: normalized } })
    },
    [sendRaw]
  )

  const leaveChannel = useCallback(
    (channelId: string) => {
      const normalized = normalizeChannelId(channelId)
      if (!normalized) return
      sendRaw({ type: 'LEAVE_CHANNEL', payload: { channelId: normalized } })
      dispatch({ type: 'LEFT_CHANNEL', channelId: normalized })
    },
    [sendRaw]
  )

  const sendMessage = useCallback(
    (channelId: string, content: string) => {
      const normalizedChannel = normalizeChannelId(channelId)
      const normalizedContent = content.trim()
      if (!normalizedChannel || !normalizedContent) return
      sendRaw({
        type: 'SEND_MESSAGE',
        payload: {
          channelId: normalizedChannel,
          content: normalizedContent,
        },
      })
    },
    [sendRaw]
  )

  const setActiveChannelId = useCallback((channelId: string | null) => {
    dispatch({ type: 'ACTIVE_CHANNEL', channelId })
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    connect()
  }, [connect, disconnect])

  const channelMessages = useMemo(() => {
    if (!state.activeChannelId) return []
    return state.messagesByChannel[state.activeChannelId] ?? []
  }, [state.activeChannelId, state.messagesByChannel])

  return {
    status: state.status,
    error: state.error,
    joinedChannels: state.joinedChannels,
    activeChannelId: state.activeChannelId,
    channelMessages,
    joinChannel,
    leaveChannel,
    sendMessage,
    setActiveChannelId,
    reconnect,
  }
}
