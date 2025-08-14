"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const password_hash = btoa(password)
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password_hash", password_hash)
        .single()
      
      setLoading(false)
      
      if (userError || !user) {
        setError("用户名或密码错误")
        return
      }
      
      // 登录成功，保存用户信息到 localStorage
      localStorage.setItem("user_id", user.id)
      localStorage.setItem("username", user.username)
      router.push("/dashboard")
    } catch (err) {
      setLoading(false)
      setError("登录失败，请重试")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* 登录图片 */}
          <div className="flex justify-center mb-4">
            <img 
              src="https://i.imgur.com/ePgOfEh.png" 
              alt="登录图片" 
              className="w-32 h-32 object-contain"
            />
          </div>
          <CardTitle>登录账号</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              {loading ? "登录中..." : "登录"}
            </Button>
            <div className="text-sm text-center mt-2">
              没有账号？<a href="/register" className="text-blue-600 hover:underline">去注册</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 