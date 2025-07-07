'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Github, Loader2 } from 'lucide-react'
import { GitHubRepo } from '@/types'

export default function AddServerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    sourceType: 'github_repo' as 'template' | 'github_repo',
    sourceUrl: '',
  })
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    repo?: GitHubRepo
    warnings?: string[]
  } | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleValidateRepo = async () => {
    if (!formData.sourceUrl) return

    setIsValidating(true)
    setError('')
    setValidationResult(null)

    try {
      const response = await fetch('/api/servers/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl: formData.sourceUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Validation failed')
      }

      setValidationResult(result)
      
      // Auto-populate name if empty
      if (!formData.name && result.repo) {
        setFormData(prev => ({
          ...prev,
          name: result.repo.name,
        }))
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Validation failed')
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      setError('Server name is required')
      return
    }

    if (formData.sourceType === 'github_repo' && !validationResult?.valid) {
      setError('Please validate the GitHub repository first')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          sourceType: formData.sourceType,
          sourceUrl: formData.sourceType === 'github_repo' ? formData.sourceUrl : undefined,
          config: validationResult?.repo ? {
            repository: validationResult.repo,
          } : {},
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create server')
      }

      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create server')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Custom MCP Server</h1>
        <p className="text-gray-600 mt-2">
          Add a custom MCP server from a GitHub repository or template.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Server Configuration</CardTitle>
          <CardDescription>
            Configure your custom MCP server settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Server Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Server Name</Label>
              <Input
                id="name"
                placeholder="My MCP Server"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Source Type */}
            <div className="space-y-2">
              <Label htmlFor="sourceType">Source Type</Label>
              <Select
                value={formData.sourceType}
                onValueChange={(value: 'template' | 'github_repo') => 
                  setFormData(prev => ({ ...prev, sourceType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="github_repo">GitHub Repository</SelectItem>
                  <SelectItem value="template">Template (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* GitHub Repository URL */}
            {formData.sourceType === 'github_repo' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceUrl">GitHub Repository URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sourceUrl"
                      placeholder="https://github.com/username/repo"
                      value={formData.sourceUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleValidateRepo}
                      disabled={!formData.sourceUrl || isValidating}
                    >
                      {isValidating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Validate'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Validation Results */}
                {validationResult && (
                  <Card className={validationResult.valid ? 'border-green-200' : 'border-yellow-200'}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {validationResult.valid ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        )}
                        <div className="flex-1 space-y-2">
                          {validationResult.repo && (
                            <div>
                              <h4 className="font-medium flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                {validationResult.repo.fullName}
                              </h4>
                              {validationResult.repo.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {validationResult.repo.description}
                                </p>
                              )}
                              <div className="flex gap-2 mt-2">
                                <Badge variant={validationResult.repo.hasManifest ? 'default' : 'secondary'}>
                                  {validationResult.repo.hasManifest ? 'MCP Compatible' : 'No Manifest'}
                                </Badge>
                                {validationResult.repo.license && (
                                  <Badge variant="outline">
                                    {validationResult.repo.license}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          {validationResult.warnings && validationResult.warnings.length > 0 && (
                            <div className="space-y-1">
                              {validationResult.warnings.map((warning, index) => (
                                <p key={index} className="text-sm text-yellow-600">
                                  ⚠️ {warning}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Template Selection (placeholder) */}
            {formData.sourceType === 'template' && (
              <Card className="border-gray-200">
                <CardContent className="pt-4">
                  <div className="text-center py-8">
                    <p className="text-gray-500">Template selection coming soon!</p>
                    <p className="text-sm text-gray-400 mt-2">
                      For now, please use the GitHub repository option.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || (formData.sourceType === 'github_repo' && !validationResult?.valid)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Server'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}