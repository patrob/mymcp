import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GitHubRepo } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { repoUrl } = await request.json()

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      )
    }

    // Extract owner and repo from GitHub URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL' },
        { status: 400 }
      )
    }

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '')

    try {
      // Get repository info
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`)
      if (!repoResponse.ok) {
        return NextResponse.json(
          { error: 'Repository not found or not accessible' },
          { status: 404 }
        )
      }

      const repoData = await repoResponse.json()

      // Check for MCP server manifest
      const manifestResponse = await fetch(
        `https://api.github.com/repos/${owner}/${cleanRepo}/contents/.well-known/mcp-server.json`
      )
      
      let hasManifest = false
      if (manifestResponse.ok) {
        hasManifest = true
      } else {
        // Check for alternative manifest locations
        const packageJsonResponse = await fetch(
          `https://api.github.com/repos/${owner}/${cleanRepo}/contents/package.json`
        )
        
        if (packageJsonResponse.ok) {
          const packageData = await packageJsonResponse.json()
          const packageContent = JSON.parse(
            Buffer.from(packageData.content, 'base64').toString()
          )
          
          // Check if it's an MCP server based on package.json
          hasManifest = !!(
            packageContent.keywords?.includes('mcp-server') ||
            packageContent.keywords?.includes('mcp') ||
            packageContent.name?.includes('mcp-server')
          )
        }
      }

      const validatedRepo: GitHubRepo = {
        name: repoData.name,
        fullName: repoData.full_name,
        url: repoData.html_url,
        description: repoData.description,
        license: repoData.license?.spdx_id,
        hasManifest,
      }

      return NextResponse.json({
        valid: true,
        repo: validatedRepo,
        warnings: hasManifest ? [] : ['No MCP server manifest found'],
      })
    } catch (error) {
      console.error('Error validating repository:', error)
      return NextResponse.json(
        { error: 'Failed to validate repository' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in validate endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}