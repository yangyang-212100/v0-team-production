"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

export default function WelcomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 检查是否已经登录
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      if (userId) {
        // 如果已登录，直接跳转到主页
        router.replace("/")
        return
      }
    }
    
    // 设置加载状态
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [router])

  const handleGetStarted = () => {
    router.push("/login")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F5F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B4C2CD] mx-auto"></div>
          <p className="mt-4 text-gray-600">正在加载...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F8FA] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E0E9F0]/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -left-16 w-32 h-32 bg-[#B4C2CD]/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#E0E9F0]/40 rounded-full blur-md"></div>
      </div>

      {/* 顶部导航 */}
      <header className="relative z-10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo size="md" className="flex-shrink-0" />
            <div className="border-2 border-[#E0E9F0] rounded-xl px-4 py-2 bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] shadow-sm">
              <span className="text-gray-700 font-bold text-lg">职得</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="text-gray-700 hover:text-[#B4C2CD] hover:bg-[#E0E9F0]/30"
            >
              登录
            </Button>
            <Button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 border border-[#B4C2CD] shadow-sm"
            >
              注册
            </Button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  欢迎来到
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD]">
                    职得
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  您的智能求职管理助手，让求职之路更加轻松高效
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#B4C2CD] rounded-full"></div>
                    <span className="text-gray-700">智能职位管理</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#B4C2CD] rounded-full"></div>
                    <span className="text-gray-700">面试提醒系统</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#B4C2CD] rounded-full"></div>
                    <span className="text-gray-700">进度跟踪分析</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#B4C2CD] rounded-full"></div>
                    <span className="text-gray-700">AI智能洞察</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-[#E0E9F0] to-[#B4C2CD] hover:from-[#B4C2CD] hover:to-[#E0E9F0] text-gray-700 border border-[#B4C2CD] shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-medium"
                >
                  立即开始
                </Button>
              </div>
            </div>

            {/* 右侧图片区域 */}
            <div className="flex justify-center lg:justify-end">
              <Card className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-3xl shadow-2xl overflow-hidden max-w-md w-full">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src="/hello.png"
                      alt="欢迎使用职得"
                      className="w-full h-auto object-cover rounded-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E0E9F0]/20 to-transparent rounded-3xl"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="relative z-10 px-6 py-8 border-t border-[#E0E9F0] bg-[#F8FAFC]/95">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">
            © 2025 职得. 让求职更有条理，让成功更近一步.
          </p>
        </div>
      </footer>
    </div>
  )
} 