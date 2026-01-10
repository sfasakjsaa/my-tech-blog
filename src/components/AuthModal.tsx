'use client'

import { useState, useEffect } from 'react'

interface AuthModalProps {
  onGuestAccess: () => void
  onLogin: (password: string) => void
  isOpen: boolean
  loginError?: string
}

export default function AuthModal({ onGuestAccess, onLogin, isOpen, loginError }: AuthModalProps) {
  const [password, setPassword] = useState('')

  // 弹窗关闭时清空密码
  useEffect(() => {
    if (!isOpen) {
      setPassword('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(password)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">访问权限验证</h2>
          <p className="text-gray-600 text-sm">请选择访问方式</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              管理员密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码获取操作权限"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                loginError
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {loginError && (
              <p className="mt-2 text-sm text-red-600 font-medium">{loginError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            登录
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onGuestAccess}
            className="w-full py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg font-medium transition-all"
          >
            以游客身份访问
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            游客只能查看，无法进行增删改查操作
          </p>
        </div>
      </div>
    </div>
  )
}
