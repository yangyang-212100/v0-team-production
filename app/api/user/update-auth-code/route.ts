import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, authCode } = await request.json()

    if (!userId || !authCode) {
      return NextResponse.json(
        { error: '用户ID和授权码不能为空' },
        { status: 400 }
      )
    }

    // 更新用户的QQ邮箱授权码
    const { data, error } = await supabase
      .from('users')
      .update({ qq_auth_code: authCode })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('更新授权码失败:', error)
      return NextResponse.json(
        { error: '更新授权码失败' },
        { status: 500 }
      )
    }

    console.log(`用户 ${userId} 的授权码已更新`)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('更新授权码失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
