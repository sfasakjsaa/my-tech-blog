"use client"

import { useState } from "react"

export default function TestPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    console.log("Test page - starting fetch...")
    try {
      console.log("Test page - calling API...")
      const res = await fetch("/api/categories")
      console.log("Test page - response received:", res.status)
      const data = await res.json()
      console.log("Test page - data parsed:", data)
      setCategories(data.data || [])
      setLoading(false)
    } catch (err: any) {
      console.error("Test page - error:", err)
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">测试页面</h1>
      <button onClick={fetchCategories} className="px-4 py-2 bg-blue-500 text-white rounded mb-4">
        手动获取分类
      </button>
      {loading && <p className="mb-4">加载中...</p>}
      {error && <p className="mb-4 text-red-500">错误: {error}</p>}
      <p className="mb-2">分类数量: {categories.length}</p>
      <ul>
        {categories.map((cat: any) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  )
}
