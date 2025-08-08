import { useState, useEffect } from 'react'
import { jobsApi, remindersApi, insightsApi } from './database'
import { Job, Reminder, Insight } from './types'

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      // 获取当前用户ID
      const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null
      const userIdNum = userId ? parseInt(userId) : undefined
      
      let data = await jobsApi.getAll(userIdNum)
      // 如果当前用户没有数据，回退加载全部样例数据，避免页面空白
      if (!data || data.length === 0) {
        data = await jobsApi.getAll(undefined)
      }
      setJobs(data || [])
      setError(null)
    } catch (err) {
      setError('获取职位数据失败')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const addJob = async (job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // 获取当前用户ID
      const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null
      const userIdNum = userId ? parseInt(userId) : undefined
      
      if (!userIdNum) {
        setError('用户未登录')
        return null
      }
      
      const jobWithUserId = { ...job, user_id: userIdNum }
      console.log('Creating job payload:', jobWithUserId)
      const newJob = await jobsApi.create(jobWithUserId)
      if (newJob) {
        setJobs([newJob, ...jobs])
        return newJob
      }
    } catch (err) {
      setError('添加职位失败')
      console.error('Error adding job:', err)
    }
    return null
  }

  const updateJobStatus = async (id: number, status: string, progress: number) => {
    try {
      const updatedJob = await jobsApi.updateStatus(id, status, progress)
      if (updatedJob) {
        setJobs(jobs.map(job => job.id === id ? updatedJob : job))
        return updatedJob
      }
    } catch (err) {
      setError('更新职位状态失败')
      console.error('Error updating job:', err)
    }
    return null
  }

  const deleteJob = async (id: number) => {
    try {
      const success = await jobsApi.delete(id)
      if (success) {
        setJobs(jobs.filter(job => job.id !== id))
        return true
      }
    } catch (err) {
      setError('删除职位失败')
      console.error('Error deleting job:', err)
    }
    return false
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    addJob,
    updateJobStatus,
    deleteJob
  }
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReminders = async () => {
    try {
      setLoading(true)
      // 获取当前用户ID
      const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null
      const userIdNum = userId ? parseInt(userId) : undefined
      
      let data = await remindersApi.getAll(userIdNum)
      if (!data || data.length === 0) {
        data = await remindersApi.getAll(undefined)
      }
      setReminders(data || [])
      setError(null)
    } catch (err) {
      setError('获取提醒数据失败')
      console.error('Error fetching reminders:', err)
    } finally {
      setLoading(false)
    }
  }

  const addReminder = async (reminder: Omit<Reminder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // 获取当前用户ID
      const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null
      const userIdNum = userId ? parseInt(userId) : undefined
      
      if (!userIdNum) {
        setError('用户未登录')
        return null
      }
      
      const reminderWithUserId = { ...reminder, user_id: userIdNum }
      const newReminder = await remindersApi.create(reminderWithUserId)
      if (newReminder) {
        setReminders([newReminder, ...reminders])
        return newReminder
      }
    } catch (err) {
      setError('添加提醒失败')
      console.error('Error adding reminder:', err)
    }
    return null
  }

  const toggleReminder = async (id: number, completed: boolean) => {
    try {
      const updatedReminder = await remindersApi.toggleCompleted(id, completed)
      if (updatedReminder) {
        setReminders(reminders.map(reminder => 
          reminder.id === id ? updatedReminder : reminder
        ))
        return updatedReminder
      }
    } catch (err) {
      setError('更新提醒状态失败')
      console.error('Error updating reminder:', err)
    }
    return null
  }

  const deleteReminder = async (id: number) => {
    try {
      const success = await remindersApi.delete(id)
      if (success) {
        setReminders(reminders.filter(reminder => reminder.id !== id))
        return true
      }
    } catch (err) {
      setError('删除提醒失败')
      console.error('Error deleting reminder:', err)
    }
    return false
  }

  useEffect(() => {
    fetchReminders()
  }, [])

  return {
    reminders,
    loading,
    error,
    fetchReminders,
    addReminder,
    toggleReminder,
    deleteReminder
  }
}

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const data = await insightsApi.getAll()
      setInsights(data)
      setError(null)
    } catch (err) {
      setError('获取洞察数据失败')
      console.error('Error fetching insights:', err)
    } finally {
      setLoading(false)
    }
  }

  const addInsight = async (insight: Omit<Insight, 'id' | 'created_at'>) => {
    try {
      const newInsight = await insightsApi.create(insight)
      if (newInsight) {
        setInsights([newInsight, ...insights])
        return newInsight
      }
    } catch (err) {
      setError('添加洞察失败')
      console.error('Error adding insight:', err)
    }
    return null
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return {
    insights,
    loading,
    error,
    fetchInsights,
    addInsight
  }
} 