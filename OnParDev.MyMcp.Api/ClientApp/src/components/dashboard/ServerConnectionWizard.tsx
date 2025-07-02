import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateGitHubServer } from '@/hooks/useServers'
import { Plus, Github } from 'lucide-react'
import type { CreateGitHubServerRequest } from '@/api'

interface ServerConnectionWizardProps {
  onServerCreated?: () => void
}

export function ServerConnectionWizard({ onServerCreated }: ServerConnectionWizardProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CreateGitHubServerRequest>({
    name: '',
    description: '',
    repositoryUrl: '',
    accessToken: ''
  })

  const createMutation = useCreateGitHubServer()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData, {
      onSuccess: () => {
        setOpen(false)
        setFormData({ name: '', description: '', repositoryUrl: '', accessToken: '' })
        onServerCreated?.()
      }
    })
  }

  const handleInputChange = (field: keyof CreateGitHubServerRequest) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="border-dashed cursor-pointer hover:bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Server
            </CardTitle>
            <CardDescription>
              Deploy a new MCP server instance from GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Create GitHub MCP Server
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Server Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="My GitHub Server"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Optional description"
            />
          </div>
          
          <div>
            <Label htmlFor="repositoryUrl">Repository URL</Label>
            <Input
              id="repositoryUrl"
              value={formData.repositoryUrl}
              onChange={handleInputChange('repositoryUrl')}
              placeholder="https://github.com/user/repo"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="accessToken">GitHub Access Token</Label>
            <Input
              id="accessToken"
              type="password"
              value={formData.accessToken}
              onChange={handleInputChange('accessToken')}
              placeholder="ghp_..."
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Server'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}