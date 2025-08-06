"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock } from "lucide-react"

export default function TasksPage() {
  const [reminders, setReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        router.replace("/login")
        return
      }

      // 加载用户任务
      supabase
        .from("reminders")
        .select("*")
        .eq("user_id", userId)
        .then(({ data, error }) => {
          if (error) setError("加载任务失败")
          else setReminders(data || [])
          setLoading(false)
        })
    }
  }, [router])

  const toggleTask = async (id: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("reminders")
        .update({ completed: !completed })
        .eq("id", id)
      
      if (!error) {
        setReminders(reminders.map(r => 
          r.id === id ? { ...r, completed: !completed } : r
        ))
      }
    } catch (err) {
      console.error("更新任务失败:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>加载任务中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            重试
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">我的任务</h1>
              <p className="text-muted-foreground">管理您的求职相关任务</p>
            </div>
            <Button onClick={() => router.push("/dashboard")}>
              返回仪表板
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {reminders.length === 0 ? (
          <div className="text-center py-12">
            <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无任务</h3>
            <p className="text-muted-foreground">您还没有创建任何任务</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reminders.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleTask(task.id, task.completed)}
                        className="flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      <div>
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{task.date}</span>
                          {task.company && <span>• {task.company}</span>}
                          <Badge variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge variant={task.completed ? "default" : "secondary"}>
                      {task.completed ? "已完成" : "未完成"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 