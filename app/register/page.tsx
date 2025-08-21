"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      // 密码简单 hash（生产建议用 bcrypt，演示用）
      const password_hash = btoa(password)
      
      // 1. 创建用户
      const { data: user, error: userError } = await supabase
        .from("users")
        .insert([{ username, password_hash }])
        .select()
        .single()
      
      if (userError) {
        setError("注册失败：用户名已存在或服务器错误")
        setLoading(false)
        return
      }
      
      // 2. 初始化任务（示例：插入一条欢迎任务）
      await supabase.from("reminders").insert([
        {
          user_id: user.id,
          title: "欢迎使用求职管家！",
          date: new Date().toLocaleDateString(),
          type: "任务",
          completed: false,
          priority: "medium"
        }
      ])
      
      setLoading(false)
      router.push("/login")
    } catch (err) {
      setLoading(false)
      setError("注册失败，请重试")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d6e5fd] via-[#d6e5fd] to-[#f7f7f7] flex items-center justify-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E0E9F0]/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -left-16 w-32 h-32 bg-[#B4C2CD]/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#E0E9F0]/40 rounded-full blur-md"></div>
      </div>

      <Card className="w-full max-w-md bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-lg relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Logo size="xl" className="mb-2" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">加入职得</CardTitle>
          <p className="text-gray-600 mt-2">创建您的账号开始求职之旅</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="用户名"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="border-black focus:border-black focus:ring-black bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-500"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="border-black focus:border-black focus:ring-black bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-500"
                autoComplete="off"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800 text-white font-bold shadow-sm" 
              disabled={loading}
            >
              {loading ? "注册中..." : "注册"}
            </Button>
            <div className="text-sm text-center mt-4 text-gray-600">
              已有账号？{" "}
              <a href="/login" className="text-[#4285f4] hover:text-[#2aa8f3] font-medium transition-colors">
                去登录
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 