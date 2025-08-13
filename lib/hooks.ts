import { useState, useEffect, useCallback } from 'react'
import { jobsApi, remindersApi, insightsApi, companyDataApi, positionInsightsApi } from './database'
import { Job, Reminder, Insight, CompanyData, PositionInsight } from './types'

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      // 获取当前用户ID
      const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null
      const userIdNum = userId ? parseInt(userId) : undefined
      
      if (!userIdNum) {
        setJobs([])
        setError('用户未登录')
        return
      }
      
      const data = await jobsApi.getAll(userIdNum)
      setJobs(data || [])
      setError(null)
    } catch (err) {
      setError('获取职位数据失败')
      console.error('Error fetching jobs:', err)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  const addJob = useCallback(async (job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) => {
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
        setJobs(prevJobs => [newJob, ...prevJobs])
        
        // 触发AI生成洞察
        try {
          await generateInsights(job.company, job.position)
        } catch (insightError) {
          console.error('Error generating insights:', insightError)
          // 不影响职位添加，只记录错误
        }
        
        return newJob
      }
    } catch (err) {
      setError('添加职位失败')
      console.error('Error adding job:', err)
    }
    return null
  }, [])

  const updateJobStatus = useCallback(async (id: number, status: string, progress: number) => {
    try {
      const updatedJob = await jobsApi.updateStatus(id, status, progress)
      if (updatedJob) {
        setJobs(prevJobs => prevJobs.map(job => job.id === id ? updatedJob : job))
        return updatedJob
      }
    } catch (err) {
      setError('更新职位状态失败')
      console.error('Error updating job:', err)
    }
    return null
  }, [])

  const deleteJob = useCallback(async (id: number) => {
    try {
      const success = await jobsApi.delete(id)
      if (success) {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== id))
        return true
      }
    } catch (err) {
      setError('删除职位失败')
      console.error('Error deleting job:', err)
    }
    return false
  }, [])

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

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true)
      // 获取当前用户ID
      const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null
      const userIdNum = userId ? parseInt(userId) : undefined
      
      if (!userIdNum) {
        setReminders([])
        setError('用户未登录')
        return
      }
      
      const data = await remindersApi.getAll(userIdNum)
      setReminders(data || [])
      setError(null)
    } catch (err) {
      setError('获取提醒数据失败')
      console.error('Error fetching reminders:', err)
      setReminders([])
    } finally {
      setLoading(false)
    }
  }, [])

  const addReminder = useCallback(async (reminder: Omit<Reminder, 'id' | 'created_at' | 'updated_at'>) => {
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
        setReminders(prevReminders => [newReminder, ...prevReminders])
        return newReminder
      }
    } catch (err) {
      setError('添加提醒失败')
      console.error('Error adding reminder:', err)
    }
    return null
  }, [])

  const toggleReminder = useCallback(async (id: number, completed: boolean) => {
    try {
      const updatedReminder = await remindersApi.toggleCompleted(id, completed)
      if (updatedReminder) {
        setReminders(prevReminders => prevReminders.map(reminder => 
          reminder.id === id ? updatedReminder : reminder
        ))
        return updatedReminder
      }
    } catch (err) {
      setError('更新提醒状态失败')
      console.error('Error updating reminder:', err)
    }
    return null
  }, [])

  const deleteReminder = useCallback(async (id: number) => {
    try {
      const success = await remindersApi.delete(id)
      if (success) {
        setReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== id))
        return true
      }
    } catch (err) {
      setError('删除提醒失败')
      console.error('Error deleting reminder:', err)
    }
    return false
  }, [])

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

  const fetchInsights = useCallback(async () => {
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
  }, [])

  const addInsight = useCallback(async (insight: Omit<Insight, 'id' | 'created_at'>) => {
    try {
      const newInsight = await insightsApi.create(insight)
      if (newInsight) {
        setInsights(prevInsights => [newInsight, ...prevInsights])
        return newInsight
      }
    } catch (err) {
      setError('添加洞察失败')
      console.error('Error adding insight:', err)
    }
    return null
  }, [])

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

export function useCompanyData() {
  const [companyData, setCompanyData] = useState<CompanyData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCompanyData = useCallback(async (companies: string[]) => {
    if (companies.length === 0) {
      console.log('No companies to fetch data for')
      setCompanyData([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log(`Fetching company data for companies: ${companies.join(', ')}`)
      
      const dataPromises = companies.map(async (company) => {
        try {
          const result = await companyDataApi.getByCompany(company)
          console.log(`Result for ${company}:`, result)
          return result
        } catch (err) {
          console.error(`Error fetching data for ${company}:`, err)
          return null
        }
      })
      
      const results = await Promise.all(dataPromises)
      console.log('All company data results:', results)
      
      // 过滤掉null结果
      const validData = results.filter(Boolean) as CompanyData[]
      console.log('Valid company data:', validData)
      setCompanyData(validData)
    } catch (err) {
      const errorMessage = '获取公司数据失败'
      setError(errorMessage)
      console.error(errorMessage, err)
      setCompanyData([])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    companyData,
    loading,
    error,
    fetchCompanyData
  }
}

export function usePositionInsights() {
  const [positionInsights, setPositionInsights] = useState<PositionInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPositionInsights = useCallback(async (userId?: number) => {
    try {
      setLoading(true)
      if (userId) {
        const data = await positionInsightsApi.getByUserJobs(userId)
        setPositionInsights(data)
      } else {
        setPositionInsights([])
      }
      setError(null)
    } catch (err) {
      setError('获取岗位洞察失败')
      console.error('Error fetching position insights:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    positionInsights,
    loading,
    error,
    fetchPositionInsights
  }
}

// AI洞察生成函数
async function generateInsights(company: string, position: string) {
  try {
    const response = await fetch('/api/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company, position })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('Generated insights:', data)
    return data
  } catch (error) {
    console.error('Error generating insights:', error)
    throw error
  }
} 