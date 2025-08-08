import { supabase } from './supabase'
import { Job, Reminder, Insight } from './types'

// Jobs API
export const jobsApi = {
  // 获取所有职位
  async getAll(userId?: number): Promise<Job[]> {
    let query = supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
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
      console.error('Error creating job:', error)
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
    let query = supabase
      .from('reminders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
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
      console.error('Error creating reminder:', error)
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