"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // 检查是否已登录
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("user_id")
      if (userId) {
        // 已登录，跳转到dashboard
        router.replace("/dashboard")
      } else {
        // 未登录，跳转到欢迎页面
        router.replace("/welcome")
      }
    }
  }, [router])

  // 显示加载状态
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">正在加载...</p>
      </div>
    </div>
  )
}
