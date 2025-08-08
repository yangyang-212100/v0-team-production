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