"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, LogOut, Settings } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem("username")
      if (username) {
        setCurrentUser(username)
        setNewUsername(username)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user_id")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const handleSwitchAccount = () => {
    // 这里可以添加切换账号的逻辑
    // 目前简单实现为退出登录
    handleLogout()
  }

  return (
    <div className="min-h-screen bg-[#F5F8FA] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E0E9F0]/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 -left-16 w-32 h-32 bg-[#B4C2CD]/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#E0E9F0]/40 rounded-full blur-md"></div>
      </div>
             <div className="container mx-auto px-4 py-8 pb-24">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mr-4 text-gray-600 hover:text-[#B4C2CD] hover:bg-[#E0E9F0] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回主页
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">设置</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-[#F8FAFC]/95 backdrop-blur-sm border border-[#E0E9F0] rounded-2xl shadow-lg relative z-10">
            <CardHeader>
                             <CardTitle className="flex items-center">
                 <Settings className="h-5 w-5 mr-2 text-[#B4C2CD]" />
                 账号设置
               </CardTitle>
               <CardDescription>
                 管理您的账号信息
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-user">当前用户</Label>
                <Input
                  id="current-user"
                  value={currentUser}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="new-username">新用户名</Label>
                <Input
                  id="new-username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="输入新的用户名"
                />
              </div>
              
              <div>
                <Label htmlFor="new-password">新密码</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="输入新密码"
                />
              </div>
              
              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
