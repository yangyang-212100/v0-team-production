"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

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
      router.push("/")
    } catch (err) {
      setLoading(false)
      setError("登录失败，请重试")
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

      <div className="flex items-center justify-center w-full max-w-8xl mx-auto px-6 relative z-10">
        {/* 左侧 Banner */}
        <div className="hidden lg:flex lg:w-1/2 lg:pr-20 lg:pl-8">
          <Card className="w-full bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] shadow-2xl overflow-hidden transform scale-125">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src="/banner.png"
                  alt="欢迎使用职得"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#E0E9F0]/20 to-transparent"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧登录表单 */}
        <div className="w-full lg:w-1/2 lg:pl-24">
          <Card className="w-full max-w-md mx-auto bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Logo size="xl" className="mb-2" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">欢迎使用职得</CardTitle>
          <p className="text-gray-600 mt-2">请登录您的账号</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              {loading ? "登录中..." : "登录"}
            </Button>
            <div className="text-sm text-center mt-4 text-gray-600">
              没有账号？{" "}
              <a href="/register" className="text-[#4285f4] hover:text-[#2aa8f3] font-medium transition-colors">
                去注册
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
} 