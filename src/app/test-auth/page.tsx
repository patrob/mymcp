import { auth } from '@clerk/nextjs/server'

export default async function TestAuthPage() {
  try {
    const authResult = await auth()
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Server-side Auth Result:</h2>
          <pre className="mt-2 text-sm">
            {JSON.stringify(authResult, null, 2)}
          </pre>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-semibold">Auth Error:</h2>
          <pre className="mt-2 text-sm">
            {error.message}
          </pre>
        </div>
      </div>
    )
  }
}