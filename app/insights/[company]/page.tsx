"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, Users, Briefcase, Eye, Calendar, Target, FileText } from 'lucide-react'
import { useJobs, useCompanyData, usePositionInsights } from "@/lib/hooks"
import { companyDataApi, positionInsightsApi } from "@/lib/database"

export default function CompanyDetailPage({ params }: { params: { company: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const company = decodeURIComponent(params.company)
  const type = searchParams.get('type')
  const position = searchParams.get('position')
  
  const { jobs } = useJobs()
  const { companyData, fetchCompanyData } = useCompanyData()
  const { positionInsights, fetchPositionInsights } = usePositionInsights()
  
  const [currentCompanyData, setCurrentCompanyData] = useState<any>(null)
  const [currentPositionInsight, setCurrentPositionInsight] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 检查登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        router.replace("/login")
      }
    }
  }, [router])

  // 加载公司数据
  useEffect(() => {
    const loadCompanyData = async () => {
      setLoading(true)
      try {
        const data = await companyDataApi.getByCompany(company)
        setCurrentCompanyData(data)
      } catch (error) {
        console.error('Error loading company data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCompanyData()
  }, [company])

  // 加载岗位洞察
  useEffect(() => {
    const loadPositionInsight = async () => {
      if (position) {
        try {
          const data = await positionInsightsApi.getByCompanyAndPosition(company, position)
          setCurrentPositionInsight(data)
        } catch (error) {
          console.error('Error loading position insight:', error)
        }
      }
    }

    loadPositionInsight()
  }, [company, position])

  // 获取公司的岗位列表
  const companyPositions = jobs.filter(job => job.company === company)

  // 渲染内容
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">正在加载...</p>
          </div>
        </div>
      )
    }

    if (type === 'culture' && currentCompanyData) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">企业文化</h2>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {currentCompanyData.culture || '暂无企业文化信息'}
            </div>
          </div>
        </div>
      )
    }

    if (type === 'products' && currentCompanyData) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">产品介绍</h2>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {currentCompanyData.products || '暂无产品信息'}
            </div>
          </div>
        </div>
      )
    }

    if (position && currentPositionInsight) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">{position}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                面试经验
              </h3>
              <Card>
                <CardContent className="pt-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {currentPositionInsight.interview_experience || '暂无面试经验信息'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                能力要求
              </h3>
              <Card>
                <CardContent className="pt-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {currentPositionInsight.skill_requirements || '暂无能力要求信息'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">选择要查看的内容</h3>
        <p className="text-muted-foreground">
          请从左侧导航选择要查看的公司信息或岗位洞察
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/insights")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回洞察
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{company}</h1>
            <p className="text-muted-foreground">AI生成的公司和岗位洞察</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  导航菜单
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* 公司级信息 */}
                {currentCompanyData && (
                  <>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">公司信息</h4>
                      <Button
                        variant={type === 'culture' ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => router.push(`/insights/${encodeURIComponent(company)}?type=culture`)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        企业文化
                      </Button>
                      <Button
                        variant={type === 'products' ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => router.push(`/insights/${encodeURIComponent(company)}?type=products`)}
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        产品介绍
                      </Button>
                    </div>
                    <Separator />
                  </>
                )}

                {/* 岗位级信息 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">申请职位</h4>
                  {companyPositions.map(job => {
                    const isActive = position === job.position
                    return (
                      <Button
                        key={job.id}
                        variant={isActive ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => router.push(`/insights/${encodeURIComponent(company)}?position=${encodeURIComponent(job.position)}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {job.position}
                        <Badge variant="secondary" className="ml-auto">
                          {job.status}
                        </Badge>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="pt-6">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 