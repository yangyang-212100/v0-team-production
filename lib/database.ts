import { supabase } from './supabase'
import { Job, Reminder, Insight, CompanyData, PositionInsight } from './types'

// Jobs API
export const jobsApi = {
  // 获取所有职位
  async getAll(userId?: number): Promise<Job[]> {
    try {
      const queryBuilder = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
      
      const { data, error } = await (userId ? queryBuilder.eq('user_id', userId) : queryBuilder)
      
      if (error) {
        console.error('Error fetching jobs:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return []
      }
      
      return data || []
    } catch (err) {
      console.error('Unexpected error fetching jobs:', err)
      return []
    }
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
    try {
      const queryBuilder = supabase
        .from('reminders')
        .select('*')
        .order('created_at', { ascending: false })
      
      const { data, error } = await (userId ? queryBuilder.eq('user_id', userId) : queryBuilder)
      
      if (error) {
        console.error('Error fetching reminders:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        return []
      }
      
      return data || []
    } catch (err) {
      console.error('Unexpected error fetching reminders:', err)
      return []
    }
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
    try {
      console.log(`Fetching company data for: ${companyName}`)
      
      const { data, error } = await supabase
        .from('company_data')
        .select('*')
        .eq('company_name', companyName)
        .maybeSingle()
      
      if (error) {
        // 无数据不是错误
        if ((error as any)?.code === 'PGRST116' || (error as any)?.message?.includes?.('No rows')) {
          console.log(`No company data found for: ${companyName}`)
          return null
        }
        // 某些情况下 SDK 可能返回空对象，这里仅做告警，避免刷屏
        const hasDetails = !!((error as any)?.code || (error as any)?.message || (error as any)?.details || (error as any)?.hint)
        if (hasDetails) {
          console.warn('Error fetching company data:', error)
        } else {
          console.warn('Company data fetch returned an unknown error shape for:', companyName)
        }
        return null
      }

      // maybeSingle 无数据时可能返回 { data: null, error: null }
      if (!data) {
        console.log(`No company data found for: ${companyName}`)
        return null
      }
      
      console.log(`Successfully fetched company data for: ${companyName}`)
      return data
    } catch (error) {
      console.error('Exception in getByCompany:', error)
      return null
    }
  },

  // 创建公司数据（兼容 JSONB 字段）
  async create(companyData: Omit<CompanyData, 'id' | 'created_at'>): Promise<CompanyData | null> {
    try {
      console.log(`Creating company data for: ${companyData.company_name}`)
      
      const payload: any = { ...companyData }
      // 若 JSON 字段为空对象则删除，避免入库为空对象
      if (payload.culture_json && Object.keys(payload.culture_json).length === 0) delete payload.culture_json
      if (payload.products_json && Object.keys(payload.products_json).length === 0) delete payload.products_json

      const { data, error } = await supabase
        .from('company_data')
        .insert([payload])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating company data:', error)
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        return null
      }
      
      console.log(`Successfully created company data for: ${companyData.company_name}`)
      return data
    } catch (error) {
      console.error('Exception in create company data:', error)
      return null
    }
  },

  // 删除公司数据
  async delete(id: number): Promise<boolean> {
    try {
      console.log(`Deleting company data with id: ${id}`)
      const { error } = await supabase
        .from('company_data')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting company data:', error)
        return false
      }
      
      console.log(`Successfully deleted company data with id: ${id}`)
      return true
    } catch (error) {
      console.error('Exception in delete company data:', error)
      return false
    }
  }
}

// Position Insights API
export const positionInsightsApi = {
  // 获取岗位洞察
  async getByCompanyAndPosition(companyName: string, position: string): Promise<PositionInsight | null> {
    try {
      const { data, error } = await supabase
        .from('position_insights')
        .select('*')
        .eq('company_name', companyName)
        .eq('position', position)
        .single()
      
      if (error) {
        // 如果没有找到数据，这是正常的，不是错误
        if (error.code === 'PGRST116') {
          console.log(`No position insight found for: ${companyName} - ${position}`)
          return null
        }
        console.error('Error fetching position insight:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error in getByCompanyAndPosition:', error)
      return null
    }
  },

  // 创建岗位洞察
  async create(positionInsight: Omit<PositionInsight, 'id' | 'created_at'>): Promise<PositionInsight | null> {
    try {
      const payload: any = { ...positionInsight }
      if (payload.interview_json && Object.keys(payload.interview_json).length === 0) delete payload.interview_json
      if (payload.skills_json && Object.keys(payload.skills_json).length === 0) delete payload.skills_json

      const { data, error } = await supabase
        .from('position_insights')
        .insert([payload])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating position insight:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error in create position insight:', error)
      return null
    }
  },

  // 获取用户所有公司的岗位洞察
  async getByUserJobs(userId: number): Promise<PositionInsight[]> {
    try {
      if (!userId) {
        console.log('fetchByUserJobs skipped: no userId')
        return []
      }
      console.log(`Fetching position insights for user: ${userId}`)
      
      // First get all companies associated with the user's jobs
      const { data: userJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('company')
        .eq('user_id', userId)
      
      if (jobsError) {
        const code = (jobsError as any)?.code
        const message = (jobsError as any)?.message
        if (code === 'PGRST116' || message?.includes?.('No rows')) {
          console.log('No jobs found for user (no rows)')
          return []
        }
        console.warn('Error fetching user jobs for insights:', {
          code,
          message,
          details: (jobsError as any)?.details,
          hint: (jobsError as any)?.hint,
        })
        return []
      }
      
      if (!userJobs || userJobs.length === 0) {
        console.log('No jobs found for user')
        return []
      }
      
      const companies = Array.from(new Set(userJobs.map(job => job.company).filter(Boolean)))
      if (companies.length === 0) {
        console.log('No companies extracted from user jobs')
        return []
      }
      console.log('User companies:', companies)
      
      // Then get position insights for these companies
      const { data, error } = await supabase
        .from('position_insights')
        .select('*')
        .in('company_name', companies)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('Error fetching user position insights:', {
          code: (error as any)?.code,
          message: (error as any)?.message,
          details: (error as any)?.details,
          hint: (error as any)?.hint
        })
        return []
      }
      
      console.log(`Found ${data?.length || 0} position insights for user`)
      return data || []
    } catch (error) {
      console.error('Exception in getByUserJobs:', error)
      return []
    }
  },

  // 删除岗位洞察
  async delete(id: number): Promise<boolean> {
    try {
      console.log(`Deleting position insight with id: ${id}`)
      const { error } = await supabase
        .from('position_insights')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting position insight:', error)
        return false
      }
      
      console.log(`Successfully deleted position insight with id: ${id}`)
      return true
    } catch (error) {
      console.error('Exception in delete position insight:', error)
      return false
    }
  }
} 