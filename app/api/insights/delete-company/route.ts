import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request: NextRequest) {
  try {
    const { company } = await request.json()
    
    if (!company) {
      return NextResponse.json({ error: '公司名称是必需的' }, { status: 400 })
    }

    // 删除公司数据
    const { error: companyError } = await supabase
      .from('company_data')
      .delete()
      .eq('company_name', company)

    if (companyError) {
      console.error('Error deleting company data:', companyError)
      return NextResponse.json({ error: '删除公司数据失败' }, { status: 500 })
    }

    // 删除该公司的所有职位洞察数据
    const { error: positionError } = await supabase
      .from('position_insights')
      .delete()
      .eq('company_name', company)

    if (positionError) {
      console.error('Error deleting position insights:', positionError)
      return NextResponse.json({ error: '删除职位洞察数据失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete company insights:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
} 