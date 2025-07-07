import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My MCP - MCP Server Management',
  description: 'Manage your MCP (Model Context Protocol) servers with ease',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-50 to-blue-50`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
