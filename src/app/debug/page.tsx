'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [envVar, setEnvVar] = useState('')

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    addLog('开始调试...')

    // 检查环境变量
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    addLog(`API URL from process.env: ${apiUrl}`)
    setEnvVar(apiUrl)

    // 测试 1: 简单的 fetch
    const testFetch = async () => {
      try {
        addLog('开始 fetch 测试...')
        const url = `${apiUrl}/api/categories`
        addLog(`请求 URL: ${url}`)

        const response = await fetch(url)
        addLog(`Response status: ${response.status}`)

        const data = await response.json()
        addLog(`Response data: ${JSON.stringify(data).substring(0, 100)}...`)
      } catch (error) {
        addLog(`Fetch 错误: ${error instanceof Error ? error.message : String(error)}`)
        addLog(`错误类型: ${error instanceof TypeError ? 'TypeError' : 'Unknown Error'}`)

        if (error instanceof TypeError) {
          addLog('TypeError 通常表示网络连接问题')
        }
      }
    }

    testFetch()

    // 测试 2: 使用 XMLHttpRequest（备用）
    const testXHR = () => {
      addLog('开始 XHR 测试...')
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `${apiUrl}/api/categories`)
      xhr.onload = () => {
        addLog(`XHR 状态: ${xhr.status}`)
        addLog(`XHR 响应: ${xhr.responseText.substring(0, 100)}...`)
      }
      xhr.onerror = () => {
        addLog('XHR 请求失败')
      }
      xhr.send()
    }

    setTimeout(testXHR, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">API 连接调试</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-green-400">环境变量</h2>
          <div className="font-mono text-sm">
            <div>NEXT_PUBLIC_API_URL: <span className="text-yellow-400">{envVar}</span></div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-green-400">调试日志</h2>
          <div className="font-mono text-sm space-y-2 max-h-96 overflow-y-auto">
            {logs.length === 0 && <div className="text-gray-500">等待日志...</div>}
            {logs.map((log, index) => (
              <div key={index} className={log.includes('错误') || log.includes('错误') ? 'text-red-400' : 'text-gray-300'}>
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">诊断信息</h2>
          <ul className="text-sm space-y-2 text-gray-300">
            <li>• 浏览器控制台（F12）查看详细错误堆栈</li>
            <li>• Network 标签查看实际的网络请求</li>
            <li>• 检查是否有 CORS 错误</li>
            <li>• 检查是否有网络连接问题</li>
          </ul>
        </div>

        <div className="mt-6 bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">常见错误</h2>
          <ul className="text-sm space-y-2 text-gray-300">
            <li>• <code className="bg-gray-800 px-2 py-1 rounded">Failed to fetch</code>: 通常是网络连接或 CORS 问题</li>
            <li>• <code className="bg-gray-800 px-2 py-1 rounded">TypeError</code>: fetch API 本身失败</li>
            <li>• <code className="bg-gray-800 px-2 py-1 rounded">NetworkError</code>: 无法连接到服务器</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
