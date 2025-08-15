export interface Job {
  id: number
  user_id: number
  company: string
  position: string
  status: string
  applied_date: string
  progress: number
  next_action: string
  next_action_date: string
  description: string
  requirements: string
  salary: string
  location: string
  type: string
  url?: string
  interview_datetime?: string
  interview_location_type?: string
  interview_location?: string
  created_at?: string
  updated_at?: string
}

export interface Reminder {
  id: number
  user_id: number
  title: string
  time: string
  date: string
  company: string
  type: string
  completed: boolean
  priority: string
  created_at?: string
  updated_at?: string
}

export interface Insight {
  id: number
  title: string
  description: string
  type: string
  company: string
  content: string
  tags: string[]
  read_time: string
  created_at?: string
}

export interface CompanyData {
  id: number
  company_name: string
  culture: string
  // 结构化存储（JSONB，可选）
  culture_json?: {
    core_values?: string[]
    work_environment?: string[]
    benefits?: string[]
  }
  culture_core_values?: string
  culture_work_environment?: string
  culture_benefits?: string
  products: string
  products_json?: {
    main_products?: string[]
    tech_stack?: string[]
    business_directions?: string[]
    roadmap?: string[]
  }
  created_at?: string
}

export interface PositionInsight {
  id: number
  company_name: string
  position: string
  interview_experience: string
  interview_json?: {
    process?: string[]
    question_types?: string[]
    tips?: string[]
    preparation?: string[]
  }
  skill_requirements: string
  skills_json?: {
    core_skills?: string[]
    tech_stack?: string[]
    resources?: string[]
    focus?: string[]
  }
  created_at?: string
} 