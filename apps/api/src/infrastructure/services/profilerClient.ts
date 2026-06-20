export class ProfilerClient {
  async getUserByFlackId(userId: string) {
    console.log(`ProfilerClient: Fetching user with ID ${userId} from profiler...`)
    try {
      const res = await fetch(
        `http://127.0.0.1:3000/api/flack-users/by-flack/${userId}`,
        {
          headers: {
            Authorization: `Bearer auth0|flack-test`,
          },
        }
      )

      console.log(
        `ProfilerClient: Fetched user data for ${userId} with status ${res.status}`
      )

      if (!res.ok) {
        const text = await res.text()
        console.error("Profiler error response:", text)
        throw new Error('Failed to fetch user from profiler')
      }

      const data = await res.json()

      console.log("ProfilerClient: Received user data:", data)

      return {
        id: userId,
        email: data.email,
        username: data.name,
        avatar: data.avatarUrl,
        createdAt: new Date(),
      }
    } catch (error) {
      console.error("ProfilerClient: Error fetching user:", error)
      throw error
    }
  }
}
