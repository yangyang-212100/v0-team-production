"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building2, Users, Briefcase, Eye, Calendar, Target } from 'lucide-react'
import { useJobs, useCompanyData, usePositionInsights } from "@/lib/hooks"

export default function InsightsPage() {
  const router = useRouter()
  const { jobs } = useJobs()
  const { companyData, fetchCompanyData } = useCompanyData()
  const { positionInsights, fetchPositionInsights } = usePositionInsights()
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

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
  const userCompanies = Array.from(new Set(jobs.map(job => job.company)))

  // 加载公司数据和岗位洞察
  useEffect(() => {
    if (userCompanies.length > 0) {
      fetchCompanyData(userCompanies)
      
      const userId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null
      const userIdNum = userId ? parseInt(userId) : undefined
      fetchPositionInsights(userIdNum)
    }
  }, [userCompanies, fetchCompanyData, fetchPositionInsights])

  // 获取公司数据
  const getCompanyData = (companyName: string) => {
    return companyData.find(data => data.company_name === companyName)
  }

  // 获取公司的岗位列表
  const getCompanyPositions = (companyName: string) => {
    return jobs.filter(job => job.company === companyName)
  }

  // 获取岗位洞察
  const getPositionInsight = (companyName: string, position: string) => {
    return positionInsights.find(insight => 
      insight.company_name === companyName && insight.position === position
    )
  }

  if (userCompanies.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <h1 className="text-3xl font-bold">职业洞察</h1>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">暂无申请记录</h3>
                <p className="text-muted-foreground mb-4">
                  您还没有添加任何职位申请，AI无法为您生成相关洞察
                </p>
                <Button onClick={() => router.push("/")}>
                  去添加职位申请
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <div>
              <h1 className="text-3xl font-bold">职业洞察</h1>
              <p className="text-muted-foreground">AI为您分析的公司和岗位信息</p>
            </div>
          </div>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCompanies.map(company => {
            const companyData = getCompanyData(company)
            const positions = getCompanyPositions(company)
            
            return (
              <Card key={company} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{company}</CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {positions.length} 个职位
                    </Badge>
                  </div>
                  <CardDescription>
                    {companyData ? 'AI已生成公司洞察' : 'AI正在生成公司洞察...'}
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
                          className="justify-start"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          企业文化
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/insights/${encodeURIComponent(company)}?type=products`)}
                          className="justify-start"
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
                          产品介绍
                        </Button>
                      </div>
                    )}
                    
                    {/* 岗位级信息 */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">申请职位</h4>
                      {positions.map(position => {
                        const insight = getPositionInsight(company, position.position)
                        return (
                          <div key={position.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{position.position}</p>
                              <p className="text-xs text-muted-foreground">{position.status}</p>
                            </div>
                            {insight && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/insights/${encodeURIComponent(company)}?position=${encodeURIComponent(position.position)}`)}
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
      </div>
    </div>
  )
} 