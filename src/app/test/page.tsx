'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [apiUrl, setApiUrl] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    setApiUrl(url)

    const testApi = async () => {
      try {
        console.log('Testing API at:', url)
        const response = await fetch(`${url}/api/categories`)
        const data = await response.json()
        console.log('API response:', data)
        setResult(data)
      } catch (err) {
        console.error('API error:', err)
        setError(err.message)
      }
    }

    testApi()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">API 连接测试</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="font-semibold mb-2">API URL</h2>
          <code className="bg-gray-100 px-2 py-1 rounded">{apiUrl}</code>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="font-semibold mb-2">结果</h2>
          {error ? (
            <div className="text-red-600 font-mono text-sm">{error}</div>
          ) : result ? (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <div className="text-gray-500">加载中...</div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">调试信息</h3>
          <p className="text-sm text-blue-700">
            在浏览器控制台（F12）中查看详细日志
          </p>
        </div>
      </div>
    </div>
  )
}
