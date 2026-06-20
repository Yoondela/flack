import type { UserRepository } from '@/domain/user/user.repository.js'
import { ProfilerClient } from '@/infrastructure/services/profilerClient.js'
import { appContext } from '@/context/app.context.js'

export function makeSyncUser(
  userRepo: UserRepository,
  profilerClient: ProfilerClient
) {
  return async function syncUser(userId: string) {
    console.log("Syncing user with ID:", userId)
    try {
        let user = await userRepo.findById(userId)
        
        console.log("User found in local repo:", user)
        if (user) return user
        console.log("User not found locally, fetching from ProfilerClient...")
        const externalUser = await profilerClient.getUserByFlackId(userId)
        console.log("User fetched from ProfilerClient:", externalUser)

        console.log("Saving user to local repo and updating app context...")
        appContext.setSyncDataByFlackId(userId, externalUser)
        appContext.setFlackUserId(userId)
        
        await userRepo.create(externalUser)
        console.log("User saved to local repo:", externalUser)
        return externalUser
        
    } catch (error) {
        console.error("Error syncing user:", error)
        throw error
    }

  }
}
