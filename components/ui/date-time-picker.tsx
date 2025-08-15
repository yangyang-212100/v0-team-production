"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)
  const [selectedTime, setSelectedTime] = useState<string>(value ? new Date(value).toTimeString().slice(0, 5) : "10:00")
  
  const datePickerRef = useRef<HTMLDivElement>(null)
  const timePickerRef = useRef<HTMLDivElement>(null)

  // 关闭选择器当点击外部
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false)
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 生成日历数据
  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    return days
  }

  // 处理日期选择
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsDatePickerOpen(false)
    
    // 组合日期和时间
    const combinedDate = new Date(date)
    const [hours, minutes] = selectedTime.split(':')
    combinedDate.setHours(parseInt(hours), parseInt(minutes))
    onChange(combinedDate.toISOString().slice(0, 16))
  }

  // 处理时间选择
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setIsTimePickerOpen(false)
    
    if (selectedDate) {
      const combinedDate = new Date(selectedDate)
      const [hours, minutes] = time.split(':')
      combinedDate.setHours(parseInt(hours), parseInt(minutes))
      onChange(combinedDate.toISOString().slice(0, 16))
    }
  }

  // 月份导航
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  // 生成时间选项
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push(time)
      }
    }
    return times
  }

  const formatDisplayDate = () => {
    if (selectedDate) {
      return selectedDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
    return "选择日期"
  }

  const formatDisplayTime = () => {
    return selectedTime || "选择时间"
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {/* 日期选择器 */}
      <div className="relative flex-1">
        <Button
          variant="outline"
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          className="w-full justify-between border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white text-gray-700"
        >
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-[#B4C2CD]" />
            {formatDisplayDate()}
          </span>
        </Button>

        {isDatePickerOpen && (
          <div
            ref={datePickerRef}
            className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0E9F0] rounded-lg shadow-lg p-4 min-w-[280px]"
          >
            {/* 月份导航 */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="text-[#B4C2CD] hover:text-gray-700 hover:bg-[#E0E9F0]/30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium text-gray-700">
                {currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="text-[#B4C2CD] hover:text-gray-700 hover:bg-[#E0E9F0]/30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="text-center text-sm text-gray-500 font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* 日期网格 */}
            <div className="grid grid-cols-7 gap-1">
              {getCalendarDays().map((date, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDateSelect(date)}
                  className={cn(
                    "h-8 w-8 p-0 text-sm",
                    !isCurrentMonth(date) && "text-gray-300",
                    isToday(date) && "bg-[#B4C2CD] text-white font-medium",
                    isSelected(date) && "bg-[#E0E9F0] text-gray-700 font-medium",
                    !isToday(date) && !isSelected(date) && "hover:bg-[#E0E9F0]/30 text-gray-700"
                  )}
                >
                  {date.getDate()}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 时间选择器 */}
      <div className="relative flex-1">
        <Button
          variant="outline"
          onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
          className="w-full justify-between border-[#B4C2CD] focus:border-[#E0E9F0] focus:ring-[#E0E9F0] bg-white text-gray-700"
        >
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-[#B4C2CD]" />
            {formatDisplayTime()}
          </span>
        </Button>

        {isTimePickerOpen && (
          <div
            ref={timePickerRef}
            className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E0E9F0] rounded-lg shadow-lg p-2 max-h-48 overflow-y-auto min-w-[120px]"
          >
            {generateTimeOptions().map(time => (
              <Button
                key={time}
                variant="ghost"
                size="sm"
                onClick={() => handleTimeSelect(time)}
                className={cn(
                  "w-full justify-start text-sm",
                  selectedTime === time
                    ? "bg-[#E0E9F0] text-gray-700 font-medium"
                    : "hover:bg-[#E0E9F0]/30 text-gray-700"
                )}
              >
                {time}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 