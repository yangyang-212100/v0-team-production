import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request: NextRequest) {
  try {
    const { company, position } = await request.json()
    
    if (!company || !position) {
      return NextResponse.json({ error: '公司名称和职位名称都是必需的' }, { status: 400 })
    }

    // 删除特定职位的洞察数据
    const { error } = await supabase
      .from('position_insights')
      .delete()
      .eq('company_name', company)
      .eq('position', position)

    if (error) {
      console.error('Error deleting position insight:', error)
      return NextResponse.json({ error: '删除职位洞察数据失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete position insights:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
} 