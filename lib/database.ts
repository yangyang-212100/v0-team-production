import { supabase } from './supabase'
import { Job, Reminder, Insight, CompanyData, PositionInsight } from './types'

// Jobs API
export const jobsApi = {
  // 获取所有职位
  async getAll(userId?: number): Promise<Job[]> {
    const queryBuilder = supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
    
    const { data, error } = await (userId ? queryBuilder.eq('user_id', userId) : queryBuilder)
    
    if (error) {
      console.error('Error fetching jobs:', error)
      return []
    }
    
    return data || []
  },

  // 添加新职位
  async create(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select()
      .single()
    
    if (error) {
      // 打印更详细的错误信息，便于排查必填列缺失或外键错误
      console.error('Error creating job:', {
        message: (error as any)?.message,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        code: (error as any)?.code,
      })
      return null
    }
    
    return data
  },

  // 更新职位状态
  async updateStatus(id: number, status: string, progress: number): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .update({ status, progress })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating job:', error)
      return null
    }
    
    return data
  },

  // 删除职位
  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting job:', error)
      return false
    }
    
    return true
  }
}

// Reminders API
export const remindersApi = {
  // 获取所有提醒
  async getAll(userId?: number): Promise<Reminder[]> {
    const queryBuilder = supabase
      .from('reminders')
      .select('*')
      .order('created_at', { ascending: false })
    
    const { data, error } = await (userId ? queryBuilder.eq('user_id', userId) : queryBuilder)
    
    if (error) {
      console.error('Error fetching reminders:', error)
      return []
    }
    
    return data || []
  },

  // 添加新提醒
  async create(reminder: Omit<Reminder, 'id' | 'created_at' | 'updated_at'>): Promise<Reminder | null> {
    const { data, error } = await supabase
      .from('reminders')
      .insert([reminder])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating reminder:', {
        message: (error as any)?.message,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        code: (error as any)?.code,
      })
      return null
    }
    
    return data
  },

  // 切换提醒完成状态
  async toggleCompleted(id: number, completed: boolean): Promise<Reminder | null> {
    const { data, error } = await supabase
      .from('reminders')
      .update({ completed })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating reminder:', error)
      return null
    }
    
    return data
  },

  // 删除提醒
  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting reminder:', error)
      return false
    }
    
    return true
  }
}

// Insights API
export const insightsApi = {
  // 获取所有洞察
  async getAll(): Promise<Insight[]> {
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching insights:', error)
      return []
    }
    
    return data || []
  },

  // 添加新洞察
  async create(insight: Omit<Insight, 'id' | 'created_at'>): Promise<Insight | null> {
    const { data, error } = await supabase
      .from('insights')
      .insert([insight])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating insight:', error)
      return null
    }
    
    return data
  }
}

// Company Data API
export const companyDataApi = {
  // 获取公司数据
  async getByCompany(companyName: string): Promise<CompanyData | null> {
    const { data, error } = await supabase
      .from('company_data')
      .select('*')
      .eq('company_name', companyName)
      .single()
    
    if (error) {
      console.error('Error fetching company data:', error)
      return null
    }
    
    return data
  },

  // 创建公司数据
  async create(companyData: Omit<CompanyData, 'id' | 'created_at'>): Promise<CompanyData | null> {
    const { data, error } = await supabase
      .from('company_data')
      .insert([companyData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating company data:', error)
      return null
    }
    
    return data
  }
}

// Position Insights API
export const positionInsightsApi = {
  // 获取岗位洞察
  async getByCompanyAndPosition(companyName: string, position: string): Promise<PositionInsight | null> {
    const { data, error } = await supabase
      .from('position_insights')
      .select('*')
      .eq('company_name', companyName)
      .eq('position', position)
      .single()
    
    if (error) {
      console.error('Error fetching position insight:', error)
      return null
    }
    
    return data
  },

  // 创建岗位洞察
  async create(positionInsight: Omit<PositionInsight, 'id' | 'created_at'>): Promise<PositionInsight | null> {
    const { data, error } = await supabase
      .from('position_insights')
      .insert([positionInsight])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating position insight:', error)
      return null
    }
    
    return data
  },

  // 获取用户所有公司的岗位洞察
  async getByUserJobs(userId: number): Promise<PositionInsight[]> {
    // 先获取用户的所有公司
    const { data: userJobs, error: jobsError } = await supabase
      .from('jobs')
      .select('company')
      .eq('user_id', userId)
    
    if (jobsError || !userJobs || userJobs.length === 0) {
      return []
    }
    
    const companies = userJobs.map(job => job.company)
    
    // 获取这些公司的岗位洞察
    const { data, error } = await supabase
      .from('position_insights')
      .select('*')
      .in('company_name', companies)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user position insights:', error)
      return []
    }
    
    return data || []
  }
} 