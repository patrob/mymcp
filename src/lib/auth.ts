import { auth } from '@clerk/nextjs/server'

// Re-export auth function for consistent usage across the app
export { auth }

// Helper function to safely get user ID with error handling
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { userId } = await auth()
    return userId
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}

// Helper function to safely get user with error handling
export async function getCurrentUser() {
  try {
    const authResult = await auth()
    return authResult
  } catch (error) {
    console.error('Error getting current user:', error)
    return { userId: null, user: null }
  }
}