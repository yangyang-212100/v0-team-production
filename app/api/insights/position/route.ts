import { NextRequest, NextResponse } from 'next/server'
import { positionInsightsApi } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const company = searchParams.get('company')
    const position = searchParams.get('position')
    
    if (!company || !position) {
      return NextResponse.json(
        { error: '公司名称和职位名称都是必需的' },
        { status: 400 }
      )
    }

    const positionData = await positionInsightsApi.getByCompanyAndPosition(company, position)
    
    if (!positionData) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json(positionData)
  } catch (error) {
    console.error('Error fetching position data:', error)
    return NextResponse.json(
      { error: '获取职位数据时发生错误' },
      { status: 500 }
    )
  }
}
