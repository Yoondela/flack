'use client'

import { useMemo, useState } from 'react'
import { useRealtime } from '../realtime/useRealtime'

function statusLabel(status: string) {
  switch (status) {
    case 'open':
      return 'Connected'
    case 'connecting':
      return 'Connecting'
    case 'closed':
      return 'Disconnected'
    case 'error':
      return 'Error'
    default:
      return 'Idle'
  }
}

export default function RealtimeApp() {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000/ws'
  const {
    status,
    error,
    joinedChannels,
    activeChannelId,
    channelMessages,
    joinChannel,
    leaveChannel,
    sendMessage,
    setActiveChannelId,
    reconnect,
  } = useRealtime(wsUrl)

  const [channelInput, setChannelInput] = useState('')
  const [messageInput, setMessageInput] = useState('')

  const canJoin = channelInput.trim().length > 0 && status === 'open'
  const canSend =
    messageInput.trim().length > 0 &&
    Boolean(activeChannelId) &&
    status === 'open'

  const formattedMessages = useMemo(() => {
    return channelMessages.map((message) => ({
      ...message,
      displayTime: new Date(message.createdAt).toLocaleTimeString(),
    }))
  }, [channelMessages])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f4f5,_#f7f1e1_45%,_#e8f0f5_100%)] text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Realtime</p>
                <h1 className="text-3xl font-semibold tracking-tight">
                  WS Control Room
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={reconnect}
              className="rounded-full border border-zinc-300/70 bg-white/70 px-5 py-2 text-sm font-medium shadow-sm transition hover:border-zinc-400 hover:bg-white"
            >
              Reconnect
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  status === 'open'
                    ? 'bg-emerald-500'
                    : status === 'connecting'
                    ? 'bg-amber-400'
                    : status === 'error'
                    ? 'bg-rose-500'
                    : 'bg-zinc-400'
                }`}
              />
              {statusLabel(status)}
            </span>
            <span className="rounded-full bg-white/70 px-4 py-2 shadow-sm">
              {wsUrl}
            </span>
            {error ? (
              <span className="rounded-full bg-rose-100 px-4 py-2 text-rose-700">
                {error}
              </span>
            ) : null}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
            <h2 className="text-lg font-semibold">Channels</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Join a channel to fetch history and start broadcasting messages.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Channel ID
              </label>
              <input
                value={channelInput}
                onChange={(event) => setChannelInput(event.target.value)}
                placeholder="marketing, support, ops"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-zinc-400"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!canJoin) return
                    joinChannel(channelInput)
                    setChannelInput('')
                  }}
                  className="flex-1 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                  disabled={!canJoin}
                >
                  Join
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!activeChannelId) return
                    leaveChannel(activeChannelId)
                  }}
                  className="flex-1 rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
                  disabled={!activeChannelId}
                >
                  Leave
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Active
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {joinedChannels.length === 0 ? (
                  <span className="text-sm text-zinc-500">No channels joined yet.</span>
                ) : (
                  joinedChannels.map((channelId) => (
                    <button
                      key={channelId}
                      type="button"
                      onClick={() => setActiveChannelId(channelId)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                        channelId === activeChannelId
                          ? 'bg-zinc-900 text-white'
                          : 'bg-white text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {channelId}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Messages</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  {activeChannelId
                    ? `Channel: ${activeChannelId}`
                    : 'Select a channel to view messages.'}
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {channelMessages.length} events
              </span>
            </div>

            <div className="mt-6 flex h-[420px] flex-col gap-4 overflow-auto rounded-2xl border border-zinc-100 bg-white/70 p-4">
              {formattedMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-zinc-500">
                  <p>No messages yet.</p>
                  <p>Join a channel and send the first one.</p>
                </div>
              ) : (
                formattedMessages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-2xl border border-zinc-100 bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="font-semibold text-zinc-700">
                        {message.senderId}
                      </span>
                      <span>{message.displayTime}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-800">
                      {message.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Send message
              </label>
              <textarea
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                placeholder="Write a message..."
                rows={3}
                className="resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-zinc-400"
              />
              <button
                type="button"
                onClick={() => {
                  if (!activeChannelId) return
                  sendMessage(activeChannelId, messageInput)
                  setMessageInput('')
                }}
                className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                disabled={!canSend}
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
