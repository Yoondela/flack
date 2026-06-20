import { z } from 'zod'
import { makeEnsureDMChannel } from './ensureDMChannel.js'

const StartDMInput = z.object({
  userA: z.string(),
  userB: z.string(),
})

export function makeStartDM(
  ensureDMChannel: ReturnType<typeof makeEnsureDMChannel>,
) {
  return async function startDM(
    input: z.infer<typeof StartDMInput>,
  ) {
    const parsed = StartDMInput.parse(input)

    return ensureDMChannel({
      userA: parsed.userA,
      userB: parsed.userB,
    })
  }
}
