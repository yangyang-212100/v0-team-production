"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, MapPin, DollarSign, CheckCircle2, Trophy } from "lucide-react"
import { useJobs } from "@/lib/hooks"

export default function OfferPage() {
  const router = useRouter()
  const { jobs } = useJobs()
  const [completedJobs, setCompletedJobs] = useState<any[]>([])

  // 检查登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        router.replace("/login")
        return
      }
    }
  }, [router])

  // 过滤出已完成的职位（进度100%）
  useEffect(() => {
    const completed = jobs.filter(job => job.progress === 100)
    setCompletedJobs(completed)
  }, [jobs])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">OFFER</h1>
              <p className="text-sm text-gray-600">恭喜您获得的职位机会</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {completedJobs.length === 0 ? (
          /* 空状态 - 暂无OFFER */
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-blue-100 max-w-md mx-auto">
              <Trophy className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">暂无OFFER</h3>
              <p className="text-gray-600 mb-6">
                当您的职位申请进度达到100%时，将在这里显示
              </p>
              <Button 
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                去申请职位
              </Button>
            </div>
          </div>
        ) : (
          /* OFFER卡片列表 */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                恭喜您获得 {completedJobs.length} 个OFFER！
              </h2>
              <p className="text-gray-600">以下是您成功获得的职位机会</p>
            </div>
            
            <div className="grid gap-6">
              {completedJobs.map((job) => (
                <Card key={job.id} className="bg-white/80 backdrop-blur-sm border border-blue-200 hover:shadow-xl transition-all duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-800">{job.company}</CardTitle>
                          <p className="text-gray-600 font-medium">{job.position}</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1">
                        OFFER
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 工作地点 */}
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">工作地点</p>
                          <p className="font-medium text-gray-800">{job.location || '未指定'}</p>
                        </div>
                      </div>
                      
                      {/* 薪资信息 */}
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">薪资范围</p>
                          <p className="font-medium text-gray-800">{job.salary || '面议'}</p>
                        </div>
                      </div>
                      
                      {/* 职位类型 */}
                      <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                        <Building2 className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">职位类型</p>
                          <p className="font-medium text-gray-800">{job.type || '全职'}</p>
                        </div>
                      </div>
                      
                      {/* 申请状态 */}
                      <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
                        <Trophy className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500">申请状态</p>
                          <p className="font-medium text-gray-800">{job.status || '已完成'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 职位描述 */}
                    {job.description && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">职位描述</h4>
                        <p className="text-gray-600 text-sm">{job.description}</p>
                      </div>
                    )}
                    
                    {/* 职位要求 */}
                    {job.requirements && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">职位要求</h4>
                        <p className="text-gray-600 text-sm">{job.requirements}</p>
                      </div>
                    )}
                    
                    {/* 申请日期 */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        申请日期: {job.applied_date ? new Date(job.applied_date).toLocaleDateString('zh-CN') : '未记录'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 