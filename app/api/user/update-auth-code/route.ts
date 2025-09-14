import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, authCode, qqEmail } = await request.json()

    if (!userId || !authCode || !qqEmail) {
      return NextResponse.json(
        { error: '用户ID、授权码和邮箱地址不能为空' },
        { status: 400 }
      )
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!emailRegex.test(qqEmail)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 更新用户的QQ邮箱信息
    const { data, error } = await supabase
      .from('users')
      .update({ 
        qq_auth_code: authCode,
        qq_email: qqEmail 
      })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('更新授权码失败:', error)
      return NextResponse.json(
        { error: '更新授权码失败' },
        { status: 500 }
      )
    }

    console.log(`用户 ${userId} 的邮箱信息已更新`)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('更新授权码失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
