import { SignUp } from '@clerk/nextjs'
import { getCurrentUserId } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SignUpPage() {
  // Check if user is already authenticated
  const userId = await getCurrentUserId()
  
  if (userId) {
    // User is already signed in, redirect to dashboard
    redirect('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp 
        routing="hash"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  )
}