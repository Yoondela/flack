import type { ServerEvent } from '@/shared/schemas/event.schema.js'

type EventHandler<T> = (event: T) => void

export class EventDispatcher {
  private handlers: {
    [K in ServerEvent['type']]?: EventHandler<Extract<ServerEvent, { type: K }>>[]
  } = {}

  on<K extends ServerEvent['type']>(
    type: K,
    handler: EventHandler<Extract<ServerEvent, { type: K }>>
  ) {
    if (!this.handlers[type]) {
      this.handlers[type] = []
    }
    this.handlers[type]!.push(handler)
  }

  emit(event: ServerEvent) {
    const handlers = this.handlers[event.type] || []
    handlers.forEach((h) => h(event as any))
  }
}
