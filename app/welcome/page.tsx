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
      <div className="min-h-screen bg-gradient-to-br from-[#d6e5fd] via-[#d6e5fd] to-[#f7f7f7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#B4C2CD] mx-auto"></div>
          <p className="mt-4 text-black">正在加载...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d6e5fd] via-[#d6e5fd] to-[#f7f7f7] relative overflow-hidden flex flex-col">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E0E9F0]/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -left-16 w-32 h-32 bg-[#B4C2CD]/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#E0E9F0]/40 rounded-full blur-md"></div>
      </div>

      {/* 顶部导航 */}
      <header className="relative z-10 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo size="md" className="flex-shrink-0" />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="text-black hover:text-[#4285f4] hover:bg-[#2aa8f3]/30"
            >
              登录
            </Button>
            <Button
              onClick={() => router.push("/register")}
              className="bg-black hover:bg-gray-800 text-white shadow-sm"
            >
              注册
            </Button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="relative z-10 px-6 py-12 flex-1 flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* 左侧内容 */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold text-black leading-tight">
                  欢迎来到
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] to-[#2aa8f3]">
                    职得
                  </span>
                </h1>
                <p className="text-2xl text-black leading-relaxed">
                  您的智能求职管理助手，让求职之路更加轻松高效
                </p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#4285f4] rounded-full"></div>
                    <span className="text-black text-lg">智能职位管理</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#4285f4] rounded-full"></div>
                    <span className="text-black text-lg">面试提醒系统</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#4285f4] rounded-full"></div>
                    <span className="text-black text-lg">进度跟踪分析</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-[#4285f4] rounded-full"></div>
                    <span className="text-black text-lg">AI智能洞察</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  className="bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-10 py-5 text-xl font-medium"
                >
                  立即开始
                </Button>
              </div>
            </div>

            {/* 右侧图片区域 */}
            <div className="flex justify-center lg:justify-end">
              <Card className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full transform scale-150">
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
      <footer className="relative z-10 px-6 py-8 border-t border-[#E0E9F0] bg-[#F8FAFC]/95 flex-shrink-0">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-black text-lg">
            © 2025 职得. 让求职更有条理，让成功更近一步.
          </p>
        </div>
      </footer>
    </div>
  )
} 