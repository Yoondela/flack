type SyncData = {
    byFlackId: Map<string, unknown>
    me: unknown | null
  flackUserId: string | null
}

const state: SyncData = {
    byFlackId: new Map(),
    me: null,
  flackUserId: null,
}

function extractFlackUserId(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const maybe = data as Record<string, unknown>
  const candidate = maybe.flackUserId ?? maybe.id ?? maybe.userId
  return typeof candidate === 'string' ? candidate : null
}

export const appContext = {
    setSyncDataByFlackId(id: string, data: unknown) {
        console.log("This is appContext, state: ", id, data)
        state.byFlackId.set(id, data)
    },
    getSyncDataByFlackId(id: string) {
        return state.byFlackId.get(id) ?? null
    },
  setMe(data: unknown) {
    state.me = data
    console.log("Setting me in appContext: ", data)
    const id = extractFlackUserId(data)
    if (id) state.flackUserId = id
  },
  getMe() {
    return state.me
  },
  setFlackUserId(id: string) {
    state.flackUserId = id
  },
  getFlackUserId() {
    console.log("Getting Flack User ID from appContext: ", state.flackUserId)
    return state.flackUserId
  },
}
