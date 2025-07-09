import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/stripe/webhook',
  '/api/clerk/webhook',
  '/test-auth', // Temporary auth testing route
  '/api/auth/signout', // Signout endpoint
])

export default clerkMiddleware((auth, req) => {
  // Temporarily disable all protection to isolate Clerk handshake issues
  console.log('🔍 Middleware called for:', req.url)
  
  // Skip protection for ALL routes temporarily
  return
  
  // Original protection logic (commented out temporarily)
  /*
  if (isPublicRoute(req)) {
    return
  }
  
  try {
    auth().protect()
  } catch (error) {
    if (error.message?.includes('CLERK_PROTECT_REDIRECT_TO_SIGN_IN')) {
      console.debug('Redirecting unauthenticated user to sign-in:', req.url)
    } else {
      console.error('Middleware auth error:', error)
    }
    throw error
  }
  */
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}