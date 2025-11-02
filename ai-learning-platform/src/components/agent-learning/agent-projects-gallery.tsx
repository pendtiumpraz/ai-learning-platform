// Agent Projects Gallery Component - Implementation placeholder
import React from 'react'
import { Project } from '@/lib/agent-framework/projects-service'

interface Props {
  projects: Project[]
}

export function AgentProjectsGallery({ }: Props) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Agent Projects Gallery</h2>
      <p className="text-muted-foreground">
        This is a placeholder component for agent projects gallery.
      </p>
    </div>
  )
}