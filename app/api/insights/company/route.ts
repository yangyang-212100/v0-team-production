import { NextRequest, NextResponse } from 'next/server'
import { companyDataApi } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const company = searchParams.get('company')
    
    if (!company) {
      return NextResponse.json(
        { error: '公司名称是必需的' },
        { status: 400 }
      )
    }

    const companyData = await companyDataApi.getByCompany(company)
    
    if (!companyData) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json(companyData)
  } catch (error) {
    console.error('Error fetching company data:', error)
    return NextResponse.json(
      { error: '获取公司数据时发生错误' },
      { status: 500 }
    )
  }
}
