import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      )
    }

    // 获取用户的授权码和邮箱状态
    const { data, error } = await supabase
      .from('users')
      .select('qq_auth_code, qq_email')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('获取授权码状态失败:', error)
      return NextResponse.json(
        { error: '获取授权码状态失败' },
        { status: 500 }
      )
    }

    const hasAuthCode = !!data?.qq_auth_code

    return NextResponse.json({ 
      hasAuthCode,
      authCode: hasAuthCode ? '***' : null, // 不返回实际的授权码
      qqEmail: data?.qq_email || null // 返回邮箱地址
    })

  } catch (error) {
    console.error('获取授权码状态失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
