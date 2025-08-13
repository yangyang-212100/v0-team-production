"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Users, Briefcase, Eye } from 'lucide-react'
import { useJobs, useCompanyData, usePositionInsights } from "@/lib/hooks"

export default function InsightsPage() {
  const router = useRouter()
  const { jobs } = useJobs()
  const { companyData, fetchCompanyData } = useCompanyData()
  const { positionInsights, fetchPositionInsights } = usePositionInsights()
  const [isLoading, setIsLoading] = useState(false)

  // 检查登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        router.replace("/login")
      }
    }
  }, [router])

  // 获取用户申请的公司列表
  const userCompanies = useMemo(() => {
    return Array.from(new Set(jobs.map(job => job.company)))
  }, [jobs])

  // 加载公司数据和岗位洞察
  useEffect(() => {
    if (userCompanies.length > 0) {
      setIsLoading(true)
      const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null
      const userIdNum = userId ? parseInt(userId) : undefined
      
      // 获取公司数据
      fetchCompanyData(userCompanies)
      
      // 获取岗位洞察
      fetchPositionInsights(userIdNum)
      
      // 设置加载完成
      setTimeout(() => setIsLoading(false), 1000)
    }
  }, [userCompanies, fetchCompanyData, fetchPositionInsights])

  // 获取公司数据
  const getCompanyData = useMemo(() => {
    return (companyName: string) => {
      return companyData.find(data => data.company_name === companyName)
    }
  }, [companyData])

  // 获取公司的岗位列表
  const getCompanyPositions = useMemo(() => {
    return (companyName: string) => {
      return jobs.filter(job => job.company === companyName)
    }
  }, [jobs])

  // 获取岗位洞察
  const getPositionInsight = useMemo(() => {
    return (companyName: string, position: string) => {
      return positionInsights.find(insight => 
        insight.company_name === companyName && insight.position === position
      )
    }
  }, [positionInsights])

  if (userCompanies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mr-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">职业洞察</h1>
          </div>
          
          <Card className="bg-white/80 backdrop-blur-sm border border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800">暂无申请记录</h3>
                <p className="text-gray-600 mb-4">
                  您还没有添加任何职位申请，AI无法为您生成相关洞察
                </p>
                <div className="space-y-2">
                  <Button onClick={() => router.push("/")} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    去添加职位申请
                  </Button>
                  <p className="text-xs text-gray-500">
                    添加职位申请后，AI将自动为您生成公司文化和岗位分析
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mr-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">职业洞察</h1>
              <p className="text-gray-600">AI为您分析的公司和岗位信息</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">正在加载洞察数据，请稍后...</p>
            </div>
          </div>
        )}

        {/* Company Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCompanies.map(company => {
              const companyData = getCompanyData(company)
              const positions = getCompanyPositions(company)
              
              return (
                <Card key={company} className="hover:shadow-xl transition-all duration-200 bg-white/80 backdrop-blur-sm border border-blue-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg text-gray-800">{company}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {positions.length} 个职位
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {companyData ? 'AI已生成公司洞察' : '点击添加职位后AI将自动生成洞察'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* 公司级信息按钮 */}
                      {companyData && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/insights/${encodeURIComponent(company)}?type=culture`)}
                            className="justify-start border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            企业文化
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/insights/${encodeURIComponent(company)}?type=products`)}
                            className="justify-start border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <Briefcase className="h-4 w-4 mr-2" />
                            产品介绍
                          </Button>
                        </div>
                      )}
                      
                      {/* 岗位级信息 */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-600">申请职位</h4>
                        {positions.map(position => {
                          const insight = getPositionInsight(company, position.position)
                          return (
                            <div key={position.id} className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded border border-blue-200">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{position.position}</p>
                                <p className="text-xs text-gray-500">{position.status}</p>
                              </div>
                              {insight && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/insights/${encodeURIComponent(company)}?position=${encodeURIComponent(position.position)}`)}
                                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-100 transition-colors"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}