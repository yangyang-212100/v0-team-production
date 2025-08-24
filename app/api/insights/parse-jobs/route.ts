import { NextRequest, NextResponse } from 'next/server'

// 复制 callDeepSeekAPI 函数到当前文件
async function callDeepSeekAPI(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  
  if (!apiKey) {
    console.error('❌ DeepSeek API Key not found')
    return null
  }
  
  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [
          {
            role: 'system',
            content: '你是专业的求职顾问，为应届生提供求职建议。请用中文回答，内容要具体实用。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error('No content in API response')
    }
    
    return { success: true, data: content }
  } catch (error) {
    console.error('❌ DeepSeek API error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { jobText } = await request.json()

    if (!jobText) {
      return NextResponse.json(
        { error: '岗位文本不能为空' },
        { status: 400 }
      )
    }

    // 构建AI提示词，要求返回JSON格式的岗位信息
    const prompt = `请解析以下岗位信息，提取出公司名称、职位名称、岗位描述、岗位要求、工作地点、薪资信息、投递网址等信息。如果有多个岗位，请分别解析。

请严格按照以下JSON格式返回，不要包含其他内容：

[
  {
    "company": "公司名称",
    "position": "职位名称", 
    "description": "岗位描述",
    "requirements": "岗位要求",
    "location": "工作地点",
    "salary": "薪资信息",
    "url": "投递网址"
  }
]

岗位信息：
${jobText}`

    // 调用DeepSeek API
    const response = await callDeepSeekAPI(prompt)
    
    if (!response.success) {
      return NextResponse.json(
        { error: 'AI解析失败', details: response.error },
        { status: 500 }
      )
    }

    // 尝试解析AI返回的JSON
    let parsedJobs
    try {
      // 提取AI响应中的JSON部分
      const jsonMatch = response.data.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        parsedJobs = JSON.parse(jsonMatch[0])
      } else {
        // 如果没有找到JSON数组，尝试直接解析整个响应
        parsedJobs = JSON.parse(response.data)
      }
    } catch (parseError) {
      console.error('解析AI响应失败:', parseError)
      return NextResponse.json(
        { error: 'AI响应格式错误，无法解析岗位信息' },
        { status: 500 }
      )
    }

    // 验证解析结果
    if (!Array.isArray(parsedJobs)) {
      return NextResponse.json(
        { error: 'AI返回的岗位信息格式不正确' },
        { status: 500 }
      )
    }

    // 确保每个岗位都有必要的字段
    const validatedJobs = parsedJobs.map(job => ({
      company: job.company || '',
      position: job.position || '',
      description: job.description || '',
      requirements: job.requirements || job.description || '',
      location: job.location || '',
      salary: job.salary || '',
      url: job.url || ''
    }))

    return NextResponse.json({
      success: true,
      jobs: validatedJobs
    })

  } catch (error) {
    console.error('解析岗位信息时发生错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
