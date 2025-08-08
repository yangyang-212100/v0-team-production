import { NextRequest, NextResponse } from 'next/server'
import { companyDataApi, positionInsightsApi } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { company, position } = await request.json()
    
    if (!company || !position) {
      return NextResponse.json(
        { error: '公司名称和职位名称是必需的' },
        { status: 400 }
      )
    }

    const results = await generateCompanyInsights(company, position)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json(
      { error: '生成洞察时发生错误' },
      { status: 500 }
    )
  }
}

async function generateCompanyInsights(company: string, position: string) {
  const results: any = {}
  
  // 1. 检查并生成公司级数据
  let companyData = await companyDataApi.getByCompany(company)
  
  if (!companyData) {
    console.log(`首次添加${company}，生成公司级数据`)
    const companyInsights = await callDeepSeekAPI(
      `你是专业的求职顾问。请为${company}公司生成以下信息：
1. 企业文化：价值观、工作氛围、福利待遇
2. 产品介绍：主要产品、技术栈、业务方向

请用中文回答，格式清晰，内容要具体实用。`
    )
    
    if (companyInsights) {
      companyData = await companyDataApi.create({
        company_name: company,
        culture: companyInsights.culture || '',
        products: companyInsights.products || ''
      })
      results.companyData = companyData
    }
  } else {
    results.companyData = companyData
  }
  
  // 2. 检查并生成岗位级数据
  let positionData = await positionInsightsApi.getByCompanyAndPosition(company, position)
  
  if (!positionData) {
    console.log(`首次添加${company}的${position}职位，生成岗位级数据`)
    const positionInsights = await callDeepSeekAPI(
      `你是专业的求职顾问。请为${company}公司的${position}职位生成以下信息：
1. 面试经验：常见面试题、面试流程、技巧
2. 能力要求：技能匹配、学习建议、准备方向

请用中文回答，格式清晰，内容要具体实用。`
    )
    
    if (positionInsights) {
      positionData = await positionInsightsApi.create({
        company_name: company,
        position: position,
        interview_experience: positionInsights.interview_experience || '',
        skill_requirements: positionInsights.skill_requirements || ''
      })
      results.positionData = positionData
    }
  } else {
    results.positionData = positionData
  }
  
  return results
}

async function callDeepSeekAPI(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  
  if (!apiKey) {
    console.error('DeepSeek API Key not found')
    return null
  }
  
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error('No content in API response')
    }
    
    // 解析AI返回的内容，提取不同部分
    return parseAIResponse(content)
  } catch (error) {
    console.error('DeepSeek API error:', error)
    return null
  }
}

function parseAIResponse(content: string) {
  // 简单的解析逻辑，根据内容结构提取信息
  const lines = content.split('\n')
  const result: any = {}
  
  let currentSection = ''
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine.includes('企业文化') || trimmedLine.includes('文化')) {
      currentSection = 'culture'
      continue
    }
    
    if (trimmedLine.includes('产品介绍') || trimmedLine.includes('产品')) {
      currentSection = 'products'
      continue
    }
    
    if (trimmedLine.includes('面试经验') || trimmedLine.includes('面试')) {
      currentSection = 'interview_experience'
      continue
    }
    
    if (trimmedLine.includes('能力要求') || trimmedLine.includes('技能')) {
      currentSection = 'skill_requirements'
      continue
    }
    
    if (trimmedLine && currentSection) {
      if (!result[currentSection]) {
        result[currentSection] = trimmedLine
      } else {
        result[currentSection] += '\n' + trimmedLine
      }
    }
  }
  
  return result
} 