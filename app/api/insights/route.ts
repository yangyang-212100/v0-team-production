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
  console.log('🏢 Starting insights generation for:', company, position)
  const results: any = {}
  
  // 1. 检查并生成公司级数据
  console.log('🔍 Checking existing company data for:', company)
  let companyData = await companyDataApi.getByCompany(company)
  
  if (!companyData) {
    console.log(`📝 首次添加${company}，生成公司级数据`)
                   const companyPrompt = `你是专业的求职顾问。请为${company}公司生成公司简介，请严格按照以下格式回答：

## 公司简介

请详细介绍${company}的公司信息，包括但不限于以下方面：

### 公司概况
- 公司背景和发展历程
- 公司规模和行业地位
- 主要业务领域

### 企业文化
- 核心价值观和企业理念
- 工作氛围和团队文化
- 员工福利和待遇体系
- 培训发展和晋升机制

### 产品技术
- 主要产品线和服务
- 技术栈和创新能力
- 业务发展方向
- 市场竞争力

### 对求职者的建议
- 适合的求职者类型
- 面试准备建议
- 职业发展机会

请确保内容具体实用，格式清晰，对求职者有帮助。内容应该全面涵盖企业文化、产品技术等对求职有用的信息。`
    
      console.log('🤖 Calling AI for company insights with prompt:', companyPrompt.substring(0, 200) + '...')
      const companyInsights = await callDeepSeekAPI(companyPrompt)
    
         if (companyInsights) {
       console.log('✅ Company insights generated, saving to database...')
       
        // 合并公司简介内容
        const companyIntroContent = (companyInsights.company_intro || companyInsights.culture || '').trim()
        
        // 结构化拆分到 JSON（尽量按小标题拆成条目列表）
        const toList = (text?: string) =>
          (text || '')
            .split(/\n+/)
            .map(s => s.replace(/^[-*\d\.\s]+/, '').trim())
            .filter(Boolean)

        const companyIntroJson: any = {}
        if (companyIntroContent) {
          // 尝试按小标题拆分内容
          const sections = companyIntroContent.split(/###\s+/)
          if (sections.length > 1) {
                      sections.forEach((section: string) => {
            const lines = section.split('\n')
            const title = lines[0]?.trim()
            const content = lines.slice(1).join('\n').trim()
            if (title && content) {
              companyIntroJson[title] = toList(content)
            }
          })
          }
        }

        companyData = await companyDataApi.create({
          company_name: company,
          culture: companyIntroContent, // 使用公司简介内容
          products: '', // 不再单独存储产品信息
          culture_json: Object.keys(companyIntroJson).length ? companyIntroJson : undefined,
          products_json: undefined // 不再需要产品JSON
        } as any)
       console.log('💾 Company data saved:', companyData)
       results.companyData = companyData
     } else {
       console.log('❌ Failed to generate company insights')
     }
  } else {
    console.log('✅ Found existing company data:', companyData)
    results.companyData = companyData
  }
  
  // 2. 检查并生成岗位级数据
  console.log('🔍 Checking existing position data for:', company, position)
  let positionData = await positionInsightsApi.getByCompanyAndPosition(company, position)
  
  if (!positionData) {
    console.log(`📝 首次添加${company}的${position}职位，生成岗位级数据`)
         const positionPrompt = `你是专业的求职顾问。请为${company}公司的${position}职位生成以下信息，请严格按照以下格式回答：

## 面试经验
请详细介绍${company}公司${position}职位的面试经验，包括：
- 面试流程和轮次
- 常见面试题类型
- 面试技巧和注意事项
- 面试准备建议

## 能力要求
请详细介绍${company}公司${position}职位的能力要求，包括：
- 核心技能要求
- 技术栈要求
- 学习建议和资源
- 准备方向和重点

请确保内容具体实用，格式清晰，每个部分都要有明确的标题。`
    
    console.log('🤖 Calling AI for position insights with prompt:', positionPrompt.substring(0, 100) + '...')
    const positionInsights = await callDeepSeekAPI(positionPrompt)
    
    if (positionInsights) {
      console.log('✅ Position insights generated, preparing content to save...')
      const interviewCombined = [
        positionInsights.interview_experience,
        positionInsights.interview_experience_interview_process,
        positionInsights.interview_experience_interview_questions
      ].filter(Boolean).join('\n\n')
      const skillsCombined = [
        positionInsights.skill_requirements,
        positionInsights.skill_requirements_core_skills,
        positionInsights.skill_requirements_learning_resources
      ].filter(Boolean).join('\n\n')

      console.log('🧩 Combined interview length:', interviewCombined.length, 'skills length:', skillsCombined.length)
      console.log('✅ Position insights generated, saving to database...')
      const toList = (text?: string) =>
        (text || '')
          .split(/\n+/)
          .map(s => s.replace(/^[-*\d\.\s]+/, '').trim())
          .filter(Boolean)

      const interviewJson: any = {}
      if (positionInsights.interview_experience_interview_process) interviewJson.process = toList(positionInsights.interview_experience_interview_process)
      if (positionInsights.interview_experience_interview_questions) interviewJson.question_types = toList(positionInsights.interview_experience_interview_questions)
      if (positionInsights.interview_experience) interviewJson.tips = toList(positionInsights.interview_experience)

      const skillsJson: any = {}
      if (positionInsights.skill_requirements_core_skills) skillsJson.core_skills = toList(positionInsights.skill_requirements_core_skills)
      if (positionInsights.skill_requirements_learning_resources) skillsJson.resources = toList(positionInsights.skill_requirements_learning_resources)
      if (positionInsights.skill_requirements) skillsJson.focus = toList(positionInsights.skill_requirements)

      positionData = await positionInsightsApi.create({
        company_name: company,
        position: position,
        interview_experience: interviewCombined,
        skill_requirements: skillsCombined,
        interview_json: Object.keys(interviewJson).length ? interviewJson : undefined,
        skills_json: Object.keys(skillsJson).length ? skillsJson : undefined
      } as any)
      console.log('💾 Position data saved:', positionData)
      results.positionData = positionData
    } else {
      console.log('❌ Failed to generate position insights')
    }
  } else {
    console.log('✅ Found existing position data:', positionData)
    results.positionData = positionData
  }
  
  console.log('🎉 Insights generation completed:', results)
  return results
}

async function callDeepSeekAPI(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  
  console.log('🔍 Environment check:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length,
    apiKeyPrefix: apiKey?.substring(0, 10) + '...'
  })
  
  if (!apiKey) {
    console.error('❌ DeepSeek API Key not found')
    console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('DEEPSEEK')))
    return null
  }
  
  try {
    console.log('🚀 Making DeepSeek API call with prompt:', prompt.substring(0, 100) + '...')
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
    
    console.log('📡 API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API response error:', errorText)
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('✅ API response received successfully')
    
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error('No content in API response')
    }
    
    console.log('🤖 AI generated content (first 200 chars):', content.substring(0, 200) + '...')
    
    // 解析AI返回的内容，提取不同部分
    const parsedResult = parseAIResponse(content)
    console.log('📝 Parsed result:', parsedResult)
    return parsedResult
  } catch (error) {
    console.error('❌ DeepSeek API error:', error)
    return null
  }
}

function parseAIResponse(content: string) {
  console.log('🔍 Parsing AI response, content length:', content.length)
  const result: any = {}

  const normalize = (text: string | undefined) =>
    (text || '')
      .replace(/^\s*#+\s*[^\n]*\n?/gm, '') // 去掉所有Markdown标题行
      .trim()

  const extractBetween = (src: string, start: RegExp, nextSection: RegExp) => {
    const startMatch = src.match(start)
    if (!startMatch) return ''
    const startIdx = startMatch.index ?? -1
    if (startIdx < 0) return ''
    const afterStart = src.slice(startIdx + startMatch[0].length)
    const nextMatch = afterStart.match(nextSection)
    const endIdx = nextMatch ? (nextMatch.index ?? afterStart.length) : afterStart.length
    return afterStart.slice(0, endIdx)
  }

  // 1) 优先按“## 标题”切块，避免关键词误判
  const nextHeading = /\n#{2,4}\s*[^\n]+/ // 下一个二到四级标题
  const companyIntroBlock = extractBetween(content, /#{2,4}\s*公司简介/, nextHeading)
  const interviewBlock = extractBetween(content, /#{2,4}\s*(面试经验|面试指南|面试攻略)/, nextHeading)
  const skillsBlock = extractBetween(content, /#{2,4}\s*(能力要求|岗位要求|胜任力|技能要求)/, nextHeading)

  // 公司简介块
  if (companyIntroBlock) {
    result.company_intro = normalize(companyIntroBlock)
    result.culture = normalize(companyIntroBlock) // 兼容旧字段名
  }

  const normalizedInterview = normalize(interviewBlock)
  const normalizedSkills = normalize(skillsBlock)
  if (normalizedInterview) result.interview_experience = normalizedInterview
  if (normalizedSkills) result.skill_requirements = normalizedSkills

  // 如果标题切块已得到任何“非空”结果，则返回，避免关键词误判
  if (Object.values(result).some(v => typeof v === 'string' && v.trim().length > 0)) {
    console.log('📊 Parsed by headings:', Object.keys(result))
    return result
  }

  // 2) 回退：关键词法（保留原有逻辑，防止AI未按标题输出时丢失）
  const sections = {
    culture: {
      keywords: ['公司简介', '企业文化', '文化', '价值观', '工作氛围', '福利待遇', '核心价值观', '公司概况', '产品技术', '对求职者的建议']
    },
    interview_experience: {
      keywords: ['面试经验', '面试指南', '面试攻略', '面试流程', '面试题']
    },
    skill_requirements: {
      keywords: ['能力要求', '岗位要求', '胜任力', '技能要求', '学习建议', '准备方向']
    }
  } as const

  const paragraphs = content.split(/\n\s*\n/)
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim()
    if (!trimmed) continue
    let matched: string | null = null
    for (const [name, sec] of Object.entries(sections)) {
      if (sec.keywords.some(k => trimmed.includes(k))) { matched = name; break }
    }

    if (!matched) continue
    const clean = normalize(trimmed)
    if (!clean) continue
    result[matched] = result[matched] ? result[matched] + '\n\n' + clean : clean
  }

  console.log('📊 Parsed sections:', Object.keys(result))
  for (const [key, value] of Object.entries(result)) {
    console.log(`📄 ${key}:`, (value as string).substring(0, 100) + '...')
  }
  return result
}