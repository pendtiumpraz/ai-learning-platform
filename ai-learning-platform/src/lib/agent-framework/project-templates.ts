import { Agent, AgentTemplate, Workflow, TemplateCategory, AgentType, AgentLevel } from '@/types/agents';

export const agentTemplates: AgentTemplate[] = [
  // Customer Service Templates
  {
    id: 'customer-service-chatbot',
    name: 'Customer Service Chatbot',
    description: 'Intelligent customer service agent that handles inquiries, support tickets, and escalation',
    category: TemplateCategory.CUSTOMER_SERVICE,
    level: AgentLevel.INTERMEDIATE,
    type: AgentType.TOOL_USING,
    config: {
      model: {
        provider: 'openai',
        modelName: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
      },
      prompts: [
        {
          id: 'system',
          name: 'Customer Service System Prompt',
          type: 'system',
          content: `You are a helpful customer service agent for {{company_name}}. Your role is to:
1. Greet customers warmly and professionally
2. Understand their needs and concerns
3. Provide accurate information about our products/services
4. Handle complaints with empathy and offer solutions
5. Escalate complex issues to human agents when necessary
6. Follow company policies and maintain brand voice

Company: {{company_name}}
Industry: {{industry}}
Support Hours: {{support_hours}}
Escalation Policy: {{escalation_policy}}`,
          isActive: true,
          variables: [
            { name: 'company_name', type: 'string', description: 'Company name', defaultValue: 'TechCorp', required: true },
            { name: 'industry', type: 'string', description: 'Industry sector', defaultValue: 'Technology', required: true },
            { name: 'support_hours', type: 'string', description: 'Support availability', defaultValue: '24/7', required: true },
            { name: 'escalation_policy', type: 'string', description: 'When to escalate to humans', defaultValue: 'Escalate for technical issues, billing disputes, or legal matters', required: true }
          ]
        }
      ],
      tools: [],
      memory: {
        type: 'short_term',
        maxSize: 10,
        retention: 24,
        strategy: 'fifo'
      },
      execution: {
        maxSteps: 10,
        timeout: 300,
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          retryDelay: 1000
        },
        parallelExecution: false,
        debugMode: false
      },
      constraints: {
        allowedDomains: [],
        maxApiCalls: 50,
        costLimit: 5.0,
        allowedTools: ['customer_database', 'ticketing_system', 'knowledge_base'],
        ethicalGuidelines: [
          'Always be respectful and professional',
          'Protect customer privacy and data',
          'Never make promises you cannot keep',
          'Admit when you do not know something'
        ]
      }
    },
    tools: [],
    prompts: [],
    variables: [],
    preview: {
      description: 'Build a customer service chatbot that can handle common inquiries, create support tickets, and escalate complex issues to human agents.',
      demoData: {
        conversation: [
          { role: 'customer', message: 'Hi, I need help with my order' },
          { role: 'agent', message: 'Hello! I\'d be happy to help you with your order. Could you please provide your order number?' }
        ]
      }
    },
    usage: 1250,
    rating: 4.7,
    createdAt: new Date('2024-01-15'),
    tags: ['customer-service', 'chatbot', 'support', 'automation']
  },

  // Content Creation Templates
  {
    id: 'content-creation-assistant',
    name: 'Content Creation Assistant',
    description: 'AI-powered content creation agent for blog posts, social media, and marketing copy',
    category: TemplateCategory.CONTENT_CREATION,
    level: AgentLevel.INTERMEDIATE,
    type: AgentType.TOOL_USING,
    config: {
      model: {
        provider: 'openai',
        modelName: 'gpt-4',
        temperature: 0.8,
        maxTokens: 2000,
      },
      prompts: [
        {
          id: 'system',
          name: 'Content Creator System Prompt',
          type: 'system',
          content: `You are a professional content creator specializing in {{content_type}}. Your responsibilities include:
1. Create engaging, original content that resonates with the target audience
2. Follow SEO best practices and brand guidelines
3. Adapt tone and style to match {{brand_voice}}
4. Include relevant keywords and calls-to-action
5. Ensure content is accurate, well-structured, and error-free

Target Audience: {{target_audience}}
Brand Voice: {{brand_voice}}
Content Goals: {{content_goals}}
SEO Keywords: {{seo_keywords}}`,
          isActive: true,
          variables: [
            { name: 'content_type', type: 'string', description: 'Type of content to create', defaultValue: 'blog posts', required: true },
            { name: 'target_audience', type: 'string', description: 'Target audience description', defaultValue: 'Tech professionals', required: true },
            { name: 'brand_voice', type: 'string', description: 'Brand personality and tone', defaultValue: 'Professional yet approachable', required: true },
            { name: 'content_goals', type: 'string', description: 'What the content should achieve', defaultValue: 'Educate and inform about AI technology', required: true },
            { name: 'seo_keywords', type: 'string', description: 'Keywords to include', defaultValue: 'artificial intelligence, machine learning, automation', required: false }
          ]
        }
      ],
      tools: [],
      memory: {
        type: 'short_term',
        maxSize: 20,
        retention: 12,
        strategy: 'lru'
      },
      execution: {
        maxSteps: 8,
        timeout: 240,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'linear',
          retryDelay: 2000
        },
        parallelExecution: false,
        debugMode: false
      },
      constraints: {
        maxApiCalls: 30,
        costLimit: 3.0,
        ethicalGuidelines: [
          'Create original, plagiarism-free content',
          'Respect copyright and intellectual property',
          'Avoid misleading or false information',
          'Disclose AI-generated content when appropriate'
        ]
      }
    },
    tools: [],
    prompts: [],
    variables: [],
    preview: {
      description: 'Create high-quality content for blogs, social media, and marketing materials with SEO optimization.',
      demoData: {
        sampleContent: '10 Ways AI is Transforming Customer Service in 2024',
        contentType: 'Blog Post'
      }
    },
    usage: 890,
    rating: 4.5,
    createdAt: new Date('2024-01-20'),
    tags: ['content', 'writing', 'seo', 'marketing']
  },

  // Data Analysis Templates
  {
    id: 'data-analysis-agent',
    name: 'Data Analysis Agent',
    description: 'Automated data analysis agent that processes, analyzes, and visualizes data from various sources',
    category: TemplateCategory.DATA_ANALYSIS,
    level: AgentLevel.ADVANCED,
    type: AgentType.TOOL_USING,
    config: {
      model: {
        provider: 'openai',
        modelName: 'gpt-4',
        temperature: 0.3,
        maxTokens: 1500,
      },
      prompts: [
        {
          id: 'system',
          name: 'Data Analyst System Prompt',
          type: 'system',
          content: `You are an expert data analyst with strong skills in statistical analysis, data visualization, and business intelligence. Your role is to:

1. Analyze datasets and extract meaningful insights
2. Identify trends, patterns, and anomalies
3. Create clear, compelling visualizations
4. Generate executive summaries and detailed reports
5. Provide data-driven recommendations
6. Ensure data quality and integrity throughout the analysis

Analysis Focus: {{analysis_focus}}
Data Sources: {{data_sources}}
Reporting Format: {{reporting_format}}
Key Metrics: {{key_metrics}}`,
          isActive: true,
          variables: [
            { name: 'analysis_focus', type: 'string', description: 'Primary analysis objective', defaultValue: 'Business performance trends', required: true },
            { name: 'data_sources', type: 'string', description: 'Data sources to analyze', defaultValue: 'Sales, customer behavior, website analytics', required: true },
            { name: 'reporting_format', type: 'string', description: 'Preferred output format', defaultValue: 'Executive dashboard with detailed insights', required: true },
            { name: 'key_metrics', type: 'string', description: 'Key performance indicators to track', defaultValue: 'Revenue, conversion rates, customer satisfaction', required: true }
          ]
        }
      ],
      tools: [],
      memory: {
        type: 'long_term',
        maxSize: 100,
        retention: 168,
        strategy: 'importance'
      },
      execution: {
        maxSteps: 15,
        timeout: 600,
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          retryDelay: 5000
        },
        parallelExecution: true,
        debugMode: false
      },
      constraints: {
        allowedDomains: [],
        maxApiCalls: 100,
        costLimit: 10.0,
        allowedTools: ['database_query', 'data_visualization', 'statistical_analysis', 'report_generator'],
        ethicalGuidelines: [
          'Maintain data privacy and security',
          'Ensure statistical accuracy',
          'Be transparent about limitations',
          'Avoid data manipulation or bias'
        ]
      }
    },
    tools: [],
    prompts: [],
    variables: [],
    preview: {
      description: 'Analyze complex datasets, generate insights, and create automated reports with visualizations.',
      demoData: {
        analysisType: 'Sales Performance Analysis',
        insights: ['15% increase in Q3 revenue', 'Customer retention improved by 8%']
      }
    },
    usage: 650,
    rating: 4.8,
    createdAt: new Date('2024-01-25'),
    tags: ['data-analysis', 'statistics', 'visualization', 'business-intelligence']
  },

  // Research Assistant Templates
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'AI research agent that gathers information, synthesizes findings, and creates comprehensive reports',
    category: TemplateCategory.RESEARCH,
    level: AgentLevel.ADVANCED,
    type: AgentType.TOOL_USING,
    config: {
      model: {
        provider: 'openai',
        modelName: 'gpt-4',
        temperature: 0.5,
        maxTokens: 3000,
      },
      prompts: [
        {
          id: 'system',
          name: 'Research Assistant System Prompt',
          type: 'system',
          content: `You are a professional research assistant with expertise in {{research_domain}}. Your responsibilities include:

1. Conduct thorough research using reliable sources
2. Synthesize information from multiple sources
3. Identify key findings and insights
4. Create well-structured, comprehensive reports
5. Cite sources properly and ensure academic integrity
6. Present findings clearly and concisely

Research Domain: {{research_domain}}
Research Methodology: {{research_methodology}}
Output Format: {{output_format}}
Citation Style: {{citation_style}}
Quality Standards: {{quality_standards}}`,
          isActive: true,
          variables: [
            { name: 'research_domain', type: 'string', description: 'Area of research expertise', defaultValue: 'Technology and Innovation', required: true },
            { name: 'research_methodology', type: 'string', description: 'Research approach to use', defaultValue: 'Literature review with data analysis', required: true },
            { name: 'output_format', type: 'string', description: 'Desired output format', defaultValue: 'Academic research paper with executive summary', required: true },
            { name: 'citation_style', type: 'string', description: 'Citation format to use', defaultValue: 'APA 7th edition', required: true },
            { name: 'quality_standards', type: 'string', description: 'Quality requirements', defaultValue: 'Peer-reviewed sources only, minimum 10 sources', required: true }
          ]
        }
      ],
      tools: [],
      memory: {
        type: 'long_term',
        maxSize: 200,
        retention: 168,
        strategy: 'importance'
      },
      execution: {
        maxSteps: 20,
        timeout: 900,
        retryPolicy: {
          maxRetries: 5,
          backoffStrategy: 'exponential',
          retryDelay: 3000
        },
        parallelExecution: true,
        debugMode: false
      },
      constraints: {
        allowedDomains: ['scholar.google.com', 'arxiv.org', 'pubmed.ncbi.nlm.nih.gov'],
        maxApiCalls: 200,
        costLimit: 15.0,
        allowedTools: ['web_search', 'academic_databases', 'citation_manager', 'document_analyzer'],
        ethicalGuidelines: [
          'Always cite sources properly',
          'Avoid plagiarism and maintain academic integrity',
          'Use credible, authoritative sources',
          'Present information objectively without bias'
        ]
      }
    },
    tools: [],
    prompts: [],
    variables: [],
    preview: {
      description: 'Conduct comprehensive research on any topic with source gathering, synthesis, and report generation.',
      demoData: {
        researchTopic: 'The Impact of AI on Healthcare',
        sources: 25,
        methodology: 'Systematic literature review'
      }
    },
    usage: 420,
    rating: 4.6,
    createdAt: new Date('2024-02-01'),
    tags: ['research', 'academic', 'analysis', 'reporting']
  },

  // Productivity Automation Templates
  {
    id: 'productivity-automation',
    name: 'Productivity Automation Agent',
    description: 'Personal productivity agent that automates tasks, manages schedules, and optimizes workflows',
    category: TemplateCategory.PRODUCTIVITY,
    level: AgentLevel.EXPERT,
    type: AgentType.WORKFLOW,
    config: {
      model: {
        provider: 'openai',
        modelName: 'gpt-4',
        temperature: 0.6,
        maxTokens: 1000,
      },
      prompts: [
        {
          id: 'system',
          name: 'Productivity Assistant System Prompt',
          type: 'system',
          content: `You are a personal productivity assistant designed to optimize workflows and automate routine tasks. Your capabilities include:

1. Task management and prioritization
2. Calendar scheduling and optimization
3. Email processing and response drafting
4. Document organization and retrieval
5. Workflow automation and process improvement
6. Personal productivity coaching and insights

Productivity Goals: {{productivity_goals}}
Work Hours: {{work_hours}}
Task Preferences: {{task_preferences}}
Communication Style: {{communication_style}}`,
          isActive: true,
          variables: [
            { name: 'productivity_goals', type: 'string', description: 'Main productivity objectives', defaultValue: 'Reduce admin time by 50%, improve meeting efficiency', required: true },
            { name: 'work_hours', type: 'string', description: 'Preferred working schedule', defaultValue: '9 AM - 6 PM, Monday-Friday', required: true },
            { name: 'task_preferences', type: 'string', description: 'Task management preferences', defaultValue: 'Priority-based, time-blocking, focus on deep work', required: true },
            { name: 'communication_style', type: 'string', description: 'Preferred communication approach', defaultValue: 'Concise, action-oriented, professional yet friendly', required: true }
          ]
        }
      ],
      tools: [],
      memory: {
        type: 'hybrid',
        maxSize: 500,
        retention: 720,
        strategy: 'importance',
        vectorStore: {
          provider: 'local',
          indexName: 'productivity_memory',
          dimensions: 1536,
          distance: 'cosine'
        }
      },
      execution: {
        maxSteps: 25,
        timeout: 1200,
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          retryDelay: 2000
        },
        parallelExecution: true,
        debugMode: false
      },
      constraints: {
        maxApiCalls: 150,
        costLimit: 8.0,
        allowedTools: ['calendar', 'email', 'task_manager', 'document_processor', 'workflow_automator'],
        ethicalGuidelines: [
          'Respect user privacy and data security',
          'Maintain professional boundaries',
          'Provide honest productivity assessments',
          'Avoid over-automation that reduces human judgment'
        ]
      }
    },
    tools: [],
    prompts: [],
    variables: [],
    preview: {
      description: 'Automate routine tasks, manage schedules, and optimize personal productivity workflows.',
      demoData: {
        automations: ['Email triage and response', 'Calendar optimization', 'Task prioritization'],
        timeSaved: '12 hours per week'
      }
    },
    usage: 780,
    rating: 4.4,
    createdAt: new Date('2024-02-05'),
    tags: ['productivity', 'automation', 'task-management', 'workflow']
  },

  // Creative Writing Templates
  {
    id: 'creative-writing-assistant',
    name: 'Creative Writing Assistant',
    description: 'AI-powered creative writing partner for storytelling, scriptwriting, and creative content',
    category: TemplateCategory.CREATIVE,
    level: AgentLevel.INTERMEDIATE,
    type: AgentType.PROMPT_BASED,
    config: {
      model: {
        provider: 'openai',
        modelName: 'gpt-4',
        temperature: 0.9,
        maxTokens: 2500,
      },
      prompts: [
        {
          id: 'system',
          name: 'Creative Writing System Prompt',
          type: 'system',
          content: `You are a creative writing assistant specializing in {{writing_genre}}. Your role is to:

1. Generate original, engaging creative content
2. Develop compelling characters and narratives
3. Create vivid descriptions and immersive worlds
4. Maintain consistent tone and style throughout
5. Offer creative suggestions and improvements
6. Respect the author's creative vision while providing valuable input

Writing Genre: {{writing_genre}}
Target Audience: {{target_audience}}
Writing Style: {{writing_style}}
Story Elements: {{story_elements}}
Creative Guidelines: {{creative_guidelines}}`,
          isActive: true,
          variables: [
            { name: 'writing_genre', type: 'string', description: 'Genre of creative writing', defaultValue: 'Science Fiction', required: true },
            { name: 'target_audience', type: 'string', description: 'Intended readers', defaultValue: 'Young adults and adults', required: true },
            { name: 'writing_style', type: 'string', description: 'Preferred writing style', defaultValue: 'Descriptive, character-driven, with philosophical undertones', required: true },
            { name: 'story_elements', type: 'string', description: 'Key story elements to include', defaultValue: 'Strong character development, world-building, moral dilemmas', required: true },
            { name: 'creative_guidelines', type: 'string', description: 'Creative boundaries and preferences', defaultValue: 'No explicit content, focus on hope and redemption', required: true }
          ]
        }
      ],
      tools: [],
      memory: {
        type: 'long_term',
        maxSize: 150,
        retention: 168,
        strategy: 'importance'
      },
      execution: {
        maxSteps: 12,
        timeout: 480,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'linear',
          retryDelay: 3000
        },
        parallelExecution: false,
        debugMode: false
      },
      constraints: {
        maxApiCalls: 60,
        costLimit: 4.0,
        ethicalGuidelines: [
          'Create original content and avoid plagiarism',
          'Respect intellectual property rights',
          'Be mindful of cultural sensitivities',
          'Provide constructive creative feedback'
        ]
      }
    },
    tools: [],
    prompts: [],
    variables: [],
    preview: {
      description: 'Collaborate on creative writing projects with AI assistance for storytelling, character development, and world-building.',
      demoData: {
        projectType: 'Science Fiction Novel',
        collaboration: 'Chapter outlines, character development, dialogue refinement'
      }
    },
    usage: 320,
    rating: 4.7,
    createdAt: new Date('2024-02-10'),
    tags: ['creative-writing', 'storytelling', 'fiction', 'collaboration']
  },

  // Education Templates
  {
    id: 'educational-tutor',
    name: 'Educational Tutor Agent',
    description: 'Personalized AI tutor that adapts to student learning styles and provides educational support',
    category: TemplateCategory.EDUCATION,
    level: AgentLevel.ADVANCED,
    type: AgentType.TOOL_USING,
    config: {
      model: {
        provider: 'openai',
        modelName: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1500,
      },
      prompts: [
        {
          id: 'system',
          name: 'Educational Tutor System Prompt',
          type: 'system',
          content: `You are an educational tutor specializing in {{subject_area}}. Your teaching approach includes:

1. Personalized learning paths based on student progress
2. Adaptive difficulty and pacing
3. Multiple explanation methods and examples
4. Interactive exercises and assessments
5. Encouragement and motivation
6. Progress tracking and parent/guardian updates

Subject Area: {{subject_area}}
Grade Level: {{grade_level}}
Learning Objectives: {{learning_objectives}}
Teaching Style: {{teaching_style}}
Assessment Method: {{assessment_method}}`,
          isActive: true,
          variables: [
            { name: 'subject_area', type: 'string', description: 'Subject to teach', defaultValue: 'Mathematics', required: true },
            { name: 'grade_level', type: 'string', description: 'Student grade level', defaultValue: 'High School (Grades 9-12)', required: true },
            { name: 'learning_objectives', type: 'string', description: 'Key learning goals', defaultValue: 'Master algebraic concepts, problem-solving skills, and mathematical reasoning', required: true },
            { name: 'teaching_style', type: 'string', description: 'Preferred teaching approach', defaultValue: 'Interactive, with real-world examples and step-by-step guidance', required: true },
            { name: 'assessment_method', type: 'string', description: 'How to evaluate progress', defaultValue: 'Regular quizzes, project-based assessments, and comprehensive reviews', required: true }
          ]
        }
      ],
      tools: [],
      memory: {
        type: 'long_term',
        maxSize: 300,
        retention: 720,
        strategy: 'importance'
      },
      execution: {
        maxSteps: 18,
        timeout: 600,
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          retryDelay: 4000
        },
        parallelExecution: false,
        debugMode: false
      },
      constraints: {
        maxApiCalls: 80,
        costLimit: 6.0,
        allowedTools: ['assessment_generator', 'progress_tracker', 'resource_library', 'exercise_creator'],
        ethicalGuidelines: [
          'Maintain educational accuracy and standards',
          'Protect student privacy and data',
          'Provide appropriate and safe content',
          'Encourage critical thinking and learning'
        ]
      }
    },
    tools: [],
    prompts: [],
    variables: [],
    preview: {
      description: 'Provide personalized tutoring with adaptive learning paths, interactive exercises, and progress tracking.',
      demoData: {
        subject: 'Algebra II',
        features: ['Adaptive difficulty', 'Real-time feedback', 'Progress tracking']
      }
    },
    usage: 550,
    rating: 4.9,
    createdAt: new Date('2024-02-15'),
    tags: ['education', 'tutoring', 'personalized-learning', 'assessment']
  }
];

export const workflowTemplates: Partial<Workflow>[] = [
  {
    name: 'Customer Support Workflow',
    description: 'Complete customer support automation from ticket creation to resolution',
    status: 'draft' as any,
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger' as any,
        position: { x: 100, y: 100 },
        data: { label: 'New Support Request', triggerType: 'webhook' },
        config: { inputs: [], outputs: [], settings: {} }
      },
      {
        id: 'agent-1',
        type: 'agent' as any,
        position: { x: 300, y: 100 },
        data: { label: 'Analyze Request', agentId: 'customer-service-agent' },
        config: { inputs: [], outputs: [], settings: {} }
      },
      {
        id: 'condition-1',
        type: 'condition' as any,
        position: { x: 500, y: 100 },
        data: { label: 'Needs Escalation?', condition: 'urgency === "high" || complexity === "high"' },
        config: { inputs: [], outputs: [], settings: {} }
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'trigger-1',
        target: 'agent-1'
      },
      {
        id: 'edge-2',
        source: 'agent-1',
        target: 'condition-1'
      }
    ],
    triggers: [],
    variables: [],
    settings: {
      timeout: 300,
      retryPolicy: {
        maxRetries: 3,
        backoffStrategy: 'exponential',
        retryDelay: 2000
      },
      errorHandling: {
        strategy: 'retry',
        maxRetries: 3,
        notifications: []
      },
      logging: {
        level: 'info',
        destinations: [{ type: 'console', config: {} }],
        includeStackTrace: true
      },
      monitoring: {
        enabled: true,
        metrics: ['execution_time', 'success_rate', 'error_count'],
        alerts: []
      }
    }
  },
  {
    name: 'Content Publishing Workflow',
    description: 'Automated content creation, review, and publishing pipeline',
    status: 'draft' as any,
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger' as any,
        position: { x: 100, y: 100 },
        data: { label: 'Content Request', triggerType: 'manual' },
        config: { inputs: [], outputs: [], settings: {} }
      },
      {
        id: 'agent-1',
        type: 'agent' as any,
        position: { x: 300, y: 100 },
        data: { label: 'Create Content', agentId: 'content-creator' },
        config: { inputs: [], outputs: [], settings: {} }
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'trigger-1',
        target: 'agent-1'
      }
    ],
    triggers: [],
    variables: [],
    settings: {
      timeout: 600,
      retryPolicy: {
        maxRetries: 2,
        backoffStrategy: 'linear',
        retryDelay: 5000
      },
      errorHandling: {
        strategy: 'continue',
        maxRetries: 2,
        notifications: []
      },
      logging: {
        level: 'info',
        destinations: [{ type: 'console', config: {} }],
        includeStackTrace: false
      },
      monitoring: {
        enabled: true,
        metrics: ['content_quality', 'engagement'],
        alerts: []
      }
    }
  }
];

export function getAgentTemplatesByCategory(category: TemplateCategory): AgentTemplate[] {
  return agentTemplates.filter(template => template.category === category);
}

export function getAgentTemplatesByLevel(level: AgentLevel): AgentTemplate[] {
  return agentTemplates.filter(template => template.level === level);
}

export function getAgentTemplate(id: string): AgentTemplate | undefined {
  return agentTemplates.find(template => template.id === id);
}

export function getWorkflowTemplate(id: string): Partial<Workflow> | undefined {
  return workflowTemplates.find(template => template.id === id);
}