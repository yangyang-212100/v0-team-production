import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { emailId, parsedDate } = await request.json()

    if (!emailId || !parsedDate) {
      return NextResponse.json(
        { error: '邮件ID和解析时间不能为空' },
        { status: 400 }
      )
    }

    // 更新邮件的parsed_date字段
    const { error } = await supabase
      .from('emails')
      .update({ parsed_date: parsedDate })
      .eq('id', emailId)

    if (error) {
      console.error('标记邮件为已解析失败:', error)
      return NextResponse.json(
        { error: '更新邮件状态失败' },
        { status: 500 }
      )
    }

    console.log(`邮件 ${emailId} 已标记为已解析`)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('标记邮件为已解析失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
