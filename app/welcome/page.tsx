"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function WelcomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center space-y-8">
            {/* 欢迎图片 */}
            <div className="w-full">
              <img 
                src="https://i.imgur.com/vylCpqM.png" 
                alt="欢迎图片" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            
            {/* 欢迎文字 */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                欢迎使用职得
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                您的智能求职助手，让求职之路更加高效
              </p>
              <p className="text-gray-500">
                管理职位申请、跟踪面试进度、获得求职洞察
              </p>
            </div>
            
            {/* 功能特点 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-semibold text-gray-800">职位管理</h3>
                <p className="text-sm text-gray-600">轻松管理所有职位申请</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-800">进度跟踪</h3>
                <p className="text-sm text-gray-600">实时跟踪申请进度</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-2">💡</div>
                <h3 className="font-semibold text-gray-800">智能洞察</h3>
                <p className="text-sm text-gray-600">获得求职数据分析</p>
              </div>
            </div>
            
            {/* 立即体验按钮 */}
            <div className="pt-6">
              <Button 
                onClick={handleGetStarted}
                className="w-full max-w-xs h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                立即体验
              </Button>
            </div>
            
            {/* 底部说明 */}
            <div className="text-sm text-gray-500 pt-4">
              <p>已有账号？<span className="text-blue-600 cursor-pointer hover:underline" onClick={handleGetStarted}>直接登录</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
