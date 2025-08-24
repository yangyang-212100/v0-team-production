import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { emailContent, emailSubject } = await request.json()

    if (!emailContent || !emailSubject) {
      return NextResponse.json(
        { error: '邮件内容和主题不能为空' },
        { status: 400 }
      )
    }

    // 调用DeepSeek API进行邮件解析
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [
                     {
             role: 'system',
             content: `你是一个专业的邮件解析助手。请从邮件内容中提取以下信息：
1. 公司名称 (company)
2. 职位名称 (position) 
3. 操作类型 (action) - 必须是以下之一：已投递、笔试、面试、已OFFER、已拒绝
4. URL链接 (url) - 如果是笔试或线上面试，提取链接
5. 地点 (location) - 如果是线下面试，提取地点
6. 时间 (datetime) - 笔试、面试或OFFER的具体时间，格式为ISO 8601标准

请以JSON格式返回，格式如下：
{
  "company": "公司名称",
  "position": "职位名称", 
  "action": "操作类型",
  "url": "链接地址（可选）",
  "location": "地点（可选）",
  "datetime": "2024-01-15T14:30:00Z（可选）"
}

注意：
- 如果邮件中没有明确的操作类型，请根据内容推断
- 如果同时有URL和地点，优先返回URL
- 时间格式请使用ISO 8601标准，如：2024-01-15T14:30:00Z
- 如果没有明确时间，datetime字段可以为null或省略
- 确保JSON格式正确，不要包含其他文本`
           },
          {
            role: 'user',
            content: `邮件主题：${emailSubject}\n\n邮件内容：${emailContent}`
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API request failed: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('AI响应为空')
    }

    // 尝试解析AI返回的JSON
    let parsedResult
    try {
      // 提取JSON部分
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('未找到有效的JSON格式')
      }
    } catch (parseError) {
      console.error('AI响应JSON解析失败:', aiResponse)
      throw new Error('AI响应格式错误')
    }

    // 验证必要字段
    if (!parsedResult.company || !parsedResult.position || !parsedResult.action) {
      throw new Error('AI解析结果缺少必要字段')
    }

    // 验证时间格式（如果存在）
    if (parsedResult.datetime) {
      try {
        new Date(parsedResult.datetime)
      } catch (error) {
        console.warn('时间格式无效，将忽略时间字段:', parsedResult.datetime)
        delete parsedResult.datetime
      }
    }

    // 验证action字段
    const validActions = ['已投递', '笔试', '面试', '已OFFER', '已拒绝']
    if (!validActions.includes(parsedResult.action)) {
      throw new Error(`无效的操作类型: ${parsedResult.action}`)
    }

    console.log('邮件解析成功:', parsedResult)

    return NextResponse.json(parsedResult)

  } catch (error) {
    console.error('邮件解析失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '邮件解析失败' },
      { status: 500 }
    )
  }
}
