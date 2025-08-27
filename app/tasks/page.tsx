"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Building2, MapPin, DollarSign, CheckCircle2, Trophy, Trash2, Edit3 } from "lucide-react"
import { useJobs } from "@/lib/hooks"

export default function OfferPage() {
  const router = useRouter()
  const { jobs, deleteJob } = useJobs()
  const [completedJobs, setCompletedJobs] = useState<any[]>([])
  const [selectedJobs, setSelectedJobs] = useState<number[]>([])
  const [isBatchMode, setIsBatchMode] = useState(false)

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

  // 批量管理功能
  const handleSelectJob = (jobId: number, checked: boolean) => {
    if (checked) {
      setSelectedJobs(prev => [...prev, jobId])
    } else {
      setSelectedJobs(prev => prev.filter(id => id !== jobId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(completedJobs.map(job => job.id))
    } else {
      setSelectedJobs([])
    }
  }

  const handleBatchDelete = async () => {
    if (selectedJobs.length === 0) return
    
    if (confirm(`确定要删除选中的 ${selectedJobs.length} 个OFFER吗？此操作不可恢复。`)) {
      try {
        for (const jobId of selectedJobs) {
          await deleteJob(jobId)
        }
        setSelectedJobs([])
        setIsBatchMode(false)
      } catch (error) {
        console.error('批量删除失败:', error)
        alert('批量删除失败，请重试')
      }
    }
  }

  const handleSingleDelete = async (jobId: number) => {
    if (confirm('确定要删除这个OFFER吗？此操作不可恢复。')) {
      try {
        await deleteJob(jobId)
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败，请重试')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d6e5fd] via-[#d6e5fd] to-[#f7f7f7] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E0E9F0]/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -left-16 w-32 h-32 bg-[#B4C2CD]/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#E0E9F0]/40 rounded-full blur-md"></div>
      </div>
      {/* Header */}
                             <div className="bg-[#F8FAFC]/95 backdrop-blur-sm border-b border-[#E0E9F0] px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-[#B4C2CD] hover:bg-[#E0E9F0] transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主页
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">OFFER</h1>
              <p className="text-sm text-gray-600">恭喜您获得的职位机会</p>
            </div>
          </div>
          {completedJobs.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant={isBatchMode ? "default" : "outline"}
                onClick={() => {
                  setIsBatchMode(!isBatchMode)
                  setSelectedJobs([])
                }}
                className={`${
                  isBatchMode 
                    ? 'bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] text-gray-700' 
                    : 'border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30'
                }`}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isBatchMode ? '退出批量管理' : '批量管理'}
              </Button>
              {isBatchMode && selectedJobs.length > 0 && (
                <Button
                  onClick={handleBatchDelete}
                  className="bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 border border-[#B4C2CD]"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除选中 ({selectedJobs.length})
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

             <div className="container mx-auto px-4 py-8 pb-24">
        {completedJobs.length === 0 ? (
          /* 空状态 - 暂无OFFER */
          <div className="text-center py-16">
                         <div className="bg-[#F8FAFC]/95 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#E0E9F0] max-w-md mx-auto relative z-10">
              <Trophy className="h-16 w-16 text-[#B4C2CD] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">暂无OFFER</h3>
              <p className="text-gray-600 mb-6">
                当您的职位申请进度达到100%时，将在这里显示
              </p>
                             <Button 
                 onClick={() => router.push("/")}
                 className="bg-black hover:bg-gray-800 text-white rounded-xl"
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
            
            {/* 批量管理工具栏 */}
            {isBatchMode && (
              <div className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedJobs.length === completedJobs.length && completedJobs.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-gray-700">全选</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    已选择 {selectedJobs.length} / {completedJobs.length} 个OFFER
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsBatchMode(false)
                    setSelectedJobs([])
                  }}
                  className="border-[#B4C2CD] text-gray-700 hover:bg-[#E0E9F0]/30"
                >
                  取消
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {completedJobs.map((job) => (
                <Card 
                  key={job.id} 
                  className={`bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl hover:shadow-xl transition-all duration-300 relative z-10 ${
                    isBatchMode && selectedJobs.includes(job.id) ? 'ring-2 ring-[#B4C2CD] bg-[#E0E9F0]/50' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isBatchMode && (
                          <Checkbox
                            checked={selectedJobs.includes(job.id)}
                            onCheckedChange={(checked) => handleSelectJob(job.id, checked as boolean)}
                            className="mr-2"
                          />
                        )}
                        <div className="w-12 h-12 bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-800">{job.company}</CardTitle>
                          <p className="text-gray-600 font-medium">{job.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] text-gray-700 px-3 py-1 border border-[#B4C2CD]">
                          OFFER
                        </Badge>
                        {!isBatchMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSingleDelete(job.id)}
                            className="text-[#B4C2CD] hover:text-gray-700 hover:bg-[#E0E9F0]/30 p-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {/* 工作地点 */}
                       <div className="flex items-center space-x-2 p-3 bg-[#E0E9F0]/30 rounded-lg">
                         <MapPin className="h-5 w-5 text-[#B4C2CD]" />
                        <div>
                          <p className="text-sm text-gray-500">工作地点</p>
                          <p className="font-medium text-gray-800">{job.location || '未指定'}</p>
                        </div>
                      </div>
                      
                                             {/* 薪资信息 */}
                       <div className="flex items-center space-x-2 p-3 bg-[#E0E9F0]/30 rounded-lg">
                         <DollarSign className="h-5 w-5 text-[#B4C2CD]" />
                        <div>
                          <p className="text-sm text-gray-500">薪资范围</p>
                          <p className="font-medium text-gray-800">{job.salary || '面议'}</p>
                        </div>
                      </div>
                      
                                             {/* 职位类型 */}
                       <div className="flex items-center space-x-2 p-3 bg-[#E0E9F0]/30 rounded-lg">
                         <Building2 className="h-5 w-5 text-[#B4C2CD]" />
                        <div>
                          <p className="text-sm text-gray-500">职位类型</p>
                          <p className="font-medium text-gray-800">{job.type || '全职'}</p>
                        </div>
                      </div>
                      
                                             {/* 申请状态 */}
                       <div className="flex items-center space-x-2 p-3 bg-[#E0E9F0]/30 rounded-lg">
                         <Trophy className="h-5 w-5 text-[#B4C2CD]" />
                        <div>
                          <p className="text-sm text-gray-500">申请状态</p>
                          <p className="font-medium text-gray-800">{job.status || '已完成'}</p>
                        </div>
                      </div>
                    </div>
                    
                                         
                    
                                         {/* 申请日期 */}
                     <div className="mt-4 pt-4 border-t border-[#E0E9F0]">
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