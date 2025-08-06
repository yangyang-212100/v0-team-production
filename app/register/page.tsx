"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>注册新账号</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "注册中..." : "注册"}
            </Button>
            <div className="text-sm text-center mt-2">
              已有账号？<a href="/login" className="text-blue-600 hover:underline">去登录</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 