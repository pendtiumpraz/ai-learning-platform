// Level One Learning Component - Implementation placeholder
import React from 'react'
import { LearningPath } from '@/types/agents'

interface Props {
  learningPath: LearningPath | null
}

export function LevelOneLearning({ learningPath }: Props) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Level 1: Introduction to AI Agents</h2>
      {learningPath ? (
        <div>
          <h3 className="text-xl font-semibold mb-2">{learningPath.title}</h3>
          <p className="text-muted-foreground">{learningPath.description}</p>
        </div>
      ) : (
        <p className="text-muted-foreground">
          This is a placeholder component for Level 1 learning content.
        </p>
      )}
    </div>
  )
}