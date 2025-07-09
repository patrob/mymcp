import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  
  // Clear all possible Clerk cookies
  const cookiesToClear = [
    '__clerk_db_jwt',
    '__session',
    '__clerk_refresh_token',
    '__clerk_ssr_state',
    '__clerk_js_version',
    '__clerk_db_jwt_template',
    '__clerk_handshake',
    '__clerk_client_uat'
  ]
  
  cookiesToClear.forEach(cookieName => {
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      path: '/',
      domain: 'localhost',
      httpOnly: true,
      secure: false
    })
    // Also clear without domain for broader compatibility
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: false
    })
  })
  
  return response
}