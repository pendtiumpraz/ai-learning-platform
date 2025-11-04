// Agent Learning Dashboard Component - Implementation placeholder
import React from 'react'
import { LearningPath } from '@/types/agents'

interface Props {
  learningPaths: LearningPath[]
}

export function AgentLearningDashboard({ learningPaths }: Props) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Agent Learning Dashboard</h2>
      {learningPaths.length > 0 ? (
        <div>
          <p className="text-muted-foreground mb-4">
            {learningPaths.length} learning paths available
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground">
          This is a placeholder component for agent learning dashboard.
        </p>
      )}
    </div>
  )
}