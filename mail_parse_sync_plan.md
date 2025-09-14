# 邮件解析后职位卡片和日历同步更新方案

## 问题分析

当前邮件解析完成后，虽然可以更新职位状态，但存在以下问题：
1. 职位卡片状态没有自动同步更新，用户需要手动刷新页面
2. 新的待办事项（如面试、笔试）没有自动同步到日历
3. 用户体验不够流畅

## 系统现状分析

### 1. 邮件解析流程
- 用户通过 `handleEmailParseClick` 或 `handleParseEmail` 触发邮件解析
- 系统调用 `parseEmailWithAI` 函数，向 `/api/insights/parse-emails` 发送请求
- 解析结果通过 `setParsedEmailResult` 存储

### 2. 职位状态更新流程
- 用户可以通过 `handleRefreshJobStatus` 批量更新职位状态
- 系统查找匹配的职位并调用 `updateJobStatus` 函数
- `updateJobStatus` 函数来自 `useJobs` hook，通过 `jobsApi.updateStatus` 更新数据库
- 更新后显示成功对话框，但没有自动刷新职位卡片列表和日历

### 3. 日历待办事项
- 系统通过 `getTasksForDate` 函数获取某天的任务，包括提醒和面试/笔试
- 该函数从 `jobs` 状态中过滤出有 `interview_datetime` 且状态不是 "OFFER" 的职位

## 解决方案设计

### 方案一：在单个邮件解析后自动更新职位卡片和日历

1. 修改 `handleParseEmail` 函数，在解析完成后：
   - 如果解析结果包含公司、职位和操作类型信息
   - 查找匹配的职位并更新其状态
   - 刷新职位列表和日历

2. 代码实现：
```javascript
const handleParseEmail = async (email: any) => {
  // 现有代码...
  try {
    const result = await parseEmailWithAI(email.body, email.subject)
    setParsedEmailResult(result)
    
    // 标记邮件为已解析
    await fetch('/api/emails/mark-parsed', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ emailId: email.id, parsedDate: new Date().toISOString() }),
    })
    
    // 新添加：如果解析结果有效，自动更新职位状态
    if (result && result.company && result.position && result.action) {
      // 查找匹配的职位
      const matchingJob = jobs.find(job => 
        job.company === result.company && job.position === result.position
      )

      if (matchingJob) {
        // 更新职位状态
        let newStatus = result.action
        let newProgress = 25
        
        switch (result.action) {
          case '已投递': newProgress = 25; break
          case '笔试': newProgress = 50; break
          case '面试': newProgress = 75; break
          case '已OFFER': newProgress = 100; break
          case '已拒绝': newProgress = 0; break
        }

        await updateJobStatus(
          matchingJob.id, 
          newStatus, 
          newProgress,
          result.datetime, // interview_datetime
          undefined, // interview_location_type
          result.url || result.location // interview_location
        )
        
        // 显示更新成功信息
        showUpdateSuccessDialog({
          company: result.company,
          position: result.position,
          oldStatus: matchingJob.status,
          newStatus: newStatus,
          emailAction: result.action,
          datetime: result.datetime
        })
      }
    }
    
    // 刷新邮件列表和职位数据
    await Promise.all([fetchEmails(), refetchJobs()])
    
  } catch (error) {
    // 错误处理...
  } finally {
    setIsEmailParsing(false)
  }
}
```

### 方案二：添加统一的数据刷新函数

1. 创建一个 `refreshAllData` 函数，用于刷新所有需要同步的数据：
```javascript
const refreshAllData = async () => {
  try {
    await Promise.all([
      fetchEmails(),
      // 刷新职位数据
      refetchJobs(),
      // 刷新提醒数据
      fetchReminders()
    ])
  } catch (error) {
    console.error('刷新数据失败:', error)
  }
}
```

2. 在 `handleRefreshJobStatus` 和 `handleParseEmail` 函数的末尾调用这个函数

### 方案三：修改 `useJobs` hook 支持自动刷新

1. 在 `lib/hooks.ts` 中修改 `useJobs` hook，添加自动刷新功能：
```javascript
// 在updateJobStatus函数中添加自动刷新逻辑
const updateJobStatus = useCallback(async (id: number, status: string, progress: number, interviewDatetime?: string, interviewLocationType?: string, interviewLocation?: string, salary?: string) => {
  try {
    const updatedJob = await jobsApi.updateStatus(id, status, progress, interviewDatetime, interviewLocationType, interviewLocation, salary)
    if (updatedJob) {
      setJobs(prevJobs => prevJobs.map(job => job.id === id ? updatedJob : job))
      
      // 如果有面试时间，触发日历更新
      if (interviewDatetime) {
        // 触发日历更新事件或重新获取数据
        await refreshCalendarData()
      }
      
      return updatedJob
    }
  } catch (err) {
    setError('更新职位状态失败')
    console.error('Error updating job:', err)
  }
  return null
}, [])
```

## 推荐实施方案

综合考虑，推荐采用**方案一和方案二结合**的方式：

1. 在单个邮件解析后自动更新相关职位状态
2. 添加统一的数据刷新函数，确保所有相关数据同步更新
3. 修改 `handleRefreshJobStatus` 函数，在批量更新后调用数据刷新函数

这种方式既能保证单个邮件解析的即时反馈，又能确保批量操作后数据的完整性和一致性。

## 实现步骤

1. 创建 `refreshAllData` 函数
2. 修改 `handleParseEmail` 函数，添加自动更新职位状态逻辑
3. 修改 `handleRefreshJobStatus` 函数，调用 `refreshAllData`
4. 确保 `useJobs` hook 能正确更新本地状态