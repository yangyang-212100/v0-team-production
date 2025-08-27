export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">页面未找到</h2>
      <p className="text-gray-600 mb-4">抱歉，您访问的页面不存在。</p>
      <a 
        href="/" 
        className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2 rounded-md transition-colors"
      >
        返回首页
      </a>
    </div>
  )
}
