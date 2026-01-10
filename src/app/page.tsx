"use client"

import { useState, useEffect, useRef } from "react"
import type { Category } from "@/lib/api"
import HomePage from "@/app/page/HomePage"
import QuestionBankPage from "@/app/page/QuestionBankPage"
import InputDialog from "@/components/InputDialog"
import ConfirmDialog from "@/components/ConfirmDialog"
import AlertModal from "@/components/AlertModal"
import AuthModal from "@/components/AuthModal"
import { categoryApi, questionApi } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const { isAuthenticated, login, loginAsGuest, logout } = useAuth()

  const [currentPage, setCurrentPage] = useState<"home" | "questions">("home")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [categoryQuestionCounts, setCategoryQuestionCounts] = useState<Record<string, number>>({})
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  })

  // Alert Modal state
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title?: string; message: string; type?: "success" | "error" | "info" | "warning" }>({
    isOpen: false,
    message: "",
  })

  const hasCheckedAuth = useRef(false)

  const showAlert = (message: string, type: "success" | "error" | "info" | "warning" = "info", title?: string) => {
    setAlertModal({ isOpen: true, title, message, type })
  }

  const closeAlert = () => {
    setAlertModal({ isOpen: false, message: "" })
  }

  // 重新加载分类并计算题目数量
  const reloadCategoriesWithCounts = async () => {
    try {
      const result = await categoryApi.getAll()
      if (result.success && result.data) {
        setCategories(result.data)

        // 计算每个分类的题目数量
        const counts: Record<string, number> = {}
        for (const category of result.data) {
          try {
            const questionResult = await questionApi.list({ categoryId: category.id })
            if (questionResult.success && questionResult.data) {
              counts[category.id] = questionResult.data.length
            } else {
              counts[category.id] = 0
            }
          } catch (error) {
            console.error(`Error loading questions for category ${category.id}:`, error)
            counts[category.id] = 0
          }
        }
        setCategoryQuestionCounts(counts)
      }
    } catch (error) {
      console.error("Error reloading categories:", error)
    }
  }

  // 检查是否需要显示认证弹窗（只在初始化时检查一次）
  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true
      const authStatus = localStorage.getItem("authStatus")
      // 如果没有登录记录，显示认证弹窗
      if (!authStatus) {
        setShowAuthModal(true)
      }
    }
  }, [])

  // 加载分类
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryApi.getAll()
        if (result.success && result.data) {
          setCategories(result.data)
          if (result.data.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(result.data[0].id)
          }

          // 计算每个分类的题目数量
          const counts: Record<string, number> = {}
          for (const category of result.data) {
            try {
              const questionResult = await questionApi.list({ categoryId: category.id })
              if (questionResult.success && questionResult.data) {
                counts[category.id] = questionResult.data.length
              } else {
                counts[category.id] = 0
              }
            } catch (error) {
              console.error(`Error loading questions for category ${category.id}:`, error)
              counts[category.id] = 0
            }
          }
          setCategoryQuestionCounts(counts)
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  // 登录处理
  const handleLogin = (password: string) => {
    if (login(password)) {
      setLoginError("")
      setShowAuthModal(false)
      showAlert("登录成功！现在可以操作了", "success", "欢迎回来")
    } else {
      setLoginError("密码错误，请重试")
      // 不关闭弹窗，让用户重新输入
    }
  }

  // 游客访问处理
  const handleGuestAccess = () => {
    setLoginError("")
    loginAsGuest()
    setShowAuthModal(false)
    showAlert("游客模式：只能查看，无法进行操作", "info", "游客访问")
  }

  // 退出登录
  const handleLogout = () => {
    logout()
    setShowAuthModal(true)
  }

  // 删除分类
  const handleDeleteCategory = async (id: string) => {
    // 认证检查
    if (!isAuthenticated) {
      showAlert("请先登录", "warning")
      return
    }

    setConfirmDialog({
      isOpen: true,
      title: "删除分类",
      message: "确定要删除这个分类吗？该分类下的所有题目也将被删除。",
      onConfirm: async () => {
        try {
          const result = await categoryApi.delete(id)
          if (result.success) {
            showAlert("分类删除成功", "success")
            // 重新加载分类
            const catResult = await categoryApi.getAll()
            if (catResult.success && catResult.data) {
              setCategories(catResult.data)
              if (!catResult.data.find((c: Category) => c.id === selectedCategoryId)) {
                setSelectedCategoryId(catResult.data.length > 0 ? catResult.data[0].id : "")
              }
            }
          } else {
            showAlert("删除失败，请重试", "error")
          }
        } catch (error) {
          console.error("Error deleting category:", error)
          const errorMessage = error instanceof Error ? error.message : "未知错误"
          // 如果是404错误，说明分类已不存在
          if (errorMessage.includes("404") || errorMessage.includes("not found")) {
            showAlert("分类不存在，列表已刷新", "warning")
          } else {
            showAlert("删除失败，请重试", "error")
          }
          // 无论如何都刷新列表
          try {
            const catResult = await categoryApi.getAll()
            if (catResult.success && catResult.data) {
              setCategories(catResult.data)
              if (!catResult.data.find((c: Category) => c.id === selectedCategoryId)) {
                setSelectedCategoryId(catResult.data.length > 0 ? catResult.data[0].id : "")
              }
            }
          } catch (e) {
            console.error("Failed to refresh categories:", e)
          }
        }
        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => {} })
      }
    })
  }

  // 新建分类
  const handleAddCategory = async (name: string) => {
    // 认证检查
    if (!isAuthenticated) {
      showAlert("请先登录", "warning")
      return
    }

    try {
      const result = await categoryApi.create(name)
      if (result.success) {
        showAlert("分类添加成功", "success")
        // 重新加载分类
        const catResult = await categoryApi.getAll()
        if (catResult.success && catResult.data) {
          setCategories(catResult.data)
          if (!selectedCategoryId && catResult.data.length > 0) {
            setSelectedCategoryId(catResult.data[0].id)
          }
        }
      } else {
        showAlert("添加失败，请重试", "error")
      }
    } catch (error) {
      console.error("Error adding category:", error)
      showAlert("添加失败，请重试", "error")
    }
  }

  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      if (event.detail === "questions") {
        setCurrentPage("questions")
      }
    }

    window.addEventListener("navigate", handleNavigate as EventListener)

    return () => {
      window.removeEventListener("navigate", handleNavigate as EventListener)
    }
  }, [])

  // ========== 移动端渲染 ==========
  const renderMobile = () => (
    <>
      {/* 移动端顶部固定导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                A
              </div>
              <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                阿真博客
              </span>
            </div>
          </div>
          {/* 登录/退出按钮 */}
          {!isAuthenticated ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
              title="退出登录"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="px-4 pb-4 space-y-2">
            <button
              onClick={() => {
                setCurrentPage("home")
                setIsMobileMenuOpen(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                currentPage === "home"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600"
              }`}
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">首页</span>
              </span>
            </button>
            <button
              onClick={() => {
                setCurrentPage("questions")
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between ${
                currentPage === "questions"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <div className="flex items-center gap-2">
                  <span className="font-medium">题库</span>
                  {selectedCategoryId && (
                    <span className="text-sm opacity-80">
                      ({categories.find(c => c.id === selectedCategoryId)?.name || ""})
                    </span>
                  )}
                </div>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 移动端分类下拉列表 */}
            {isCategoryDropdownOpen && !loading && (
              <div className="ml-4 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 p-2">
                <div className="space-y-1 max-h-[70vh] overflow-y-auto">
                  {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`group flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all w-full cursor-pointer md:group-hover:bg-gray-100 ${
                      selectedCategoryId === category.id
                        ? "bg-purple-100 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedCategoryId(category.id)
                      setIsCategoryDropdownOpen(false)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <span className="flex-1 text-left truncate">{category.name}</span>
                    <span className="text-xs text-gray-500 mr-2">({categoryQuestionCounts[category.id] || 0})</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!isAuthenticated) {
                          showAlert("请先登录", "warning")
                          return
                        }
                        handleDeleteCategory(category.id)
                      }}
                      disabled={!isAuthenticated}
                      className={`md:opacity-0 md:group-hover:opacity-100 ml-2 transition-opacity ${
                        !isAuthenticated ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'
                      }`}
                      title="删除分类"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                </div>
                {/* 新建分类按钮 */}
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      showAlert("请先登录", "warning")
                      return
                    }
                    setIsInputDialogOpen(true)
                  }}
                  disabled={!isAuthenticated}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors w-full mt-2 border-t border-gray-100 pt-3 ${
                    !isAuthenticated ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  新建分类
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 移动端内容区 */}
      <div className="h-[calc(100vh-80px)] flex flex-col pt-20">
        {currentPage === "home" ? (
          <div className="px-4 flex-1 overflow-y-auto pb-8">
            <HomePage />
          </div>
        ) : (
          <QuestionBankPage
            selectedCategoryId={selectedCategoryId}
            categoryName={categories.find(c => c.id === selectedCategoryId)?.name || ""}
            categories={categories}
            onOpenInputDialog={() => setIsInputDialogOpen(true)}
            onQuestionChange={() => reloadCategoriesWithCounts()}
          />
        )}
      </div>
    </>
  )

  // ========== 桌面端渲染 ==========
  const renderDesktop = () => (
    <div className="flex min-h-screen">
      {/* 桌面端左侧导航栏 */}
      <nav className="w-72 bg-white/80 backdrop-blur-xl shadow-xl border-r border-white/50 flex flex-col flex-shrink-0">
        <div className="p-8 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              A
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              阿真技术博客
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">前端开发 & 技术分享</p>
        </div>
        <div className="px-5 space-y-2 flex-1 overflow-y-auto">
          <button
            onClick={() => setCurrentPage("home")}
            className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 ${
              currentPage === "home"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                : "text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600"
            }`}
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">首页</span>
            </span>
          </button>

          {/* 题库和分类 */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setCurrentPage("questions")
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
              }}
              className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-between ${
                currentPage === "questions"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-indigo-5050 hover:to-purple-50 hover:text-indigo-600"
              }`}
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <div className="flex items-center gap-2">
                  <span className="font-medium">题库</span>
                  {selectedCategoryId && (
                    <span className="text-sm opacity-80">
                      ({categories.find(c => c.id === selectedCategoryId)?.name || ""})
                    </span>
                  )}
                </div>
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 分类下拉列表 */}
            {isCategoryDropdownOpen && !loading && (
              <div className="ml-4 space-y-1 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 p-2 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`group flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all w-full cursor-pointer ${
                      selectedCategoryId === category.id
                        ? "bg-purple-100 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedCategoryId(category.id)
                      setIsCategoryDropdownOpen(false)
                    }}
                  >
                    <span className="flex-1 text-left truncate">{category.name}</span>
                    <span className="text-xs text-gray-500 mr-2">({categoryQuestionCounts[category.id] || 0})</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!isAuthenticated) {
                          showAlert("请先登录", "warning")
                          return
                        }
                        handleDeleteCategory(category.id)
                      }}
                      disabled={!isAuthenticated}
                      className={`opacity-0 group-hover:opacity-100 ml-2 transition-opacity ${
                        !isAuthenticated ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'
                      }`}
                      title="删除分类"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {/* 新建分类按钮 */}
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      showAlert("请先登录", "warning")
                      return
                    }
                    setIsInputDialogOpen(true)
                  }}
                  disabled={!isAuthenticated}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors w-full ${
                    !isAuthenticated ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  新建分类
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 桌面端右侧内容区 */}
      <div className="flex-1 p-10 min-w-0">
        {currentPage === "home" ? (
          <HomePage />
        ) : (
          <QuestionBankPage
            selectedCategoryId={selectedCategoryId}
            categoryName={categories.find(c => c.id === selectedCategoryId)?.name || ""}
            categories={categories}
            onOpenInputDialog={() => setIsInputDialogOpen(true)}
            onShowAuthModal={() => setShowAuthModal(true)}
            onQuestionChange={() => reloadCategoriesWithCounts()}
          />
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* 移动端 */}
      <div className="md:hidden">
        {renderMobile()}
      </div>

      {/* 桌面端 */}
      <div className="hidden md:block">
        {renderDesktop()}
      </div>

      {/* 新建分类弹窗 */}
      <InputDialog
        isOpen={isInputDialogOpen}
        title="新建分类"
        placeholder="请输入分类名称"
        onConfirm={(name) => {
          handleAddCategory(name)
          setIsInputDialogOpen(false)
        }}
        onCancel={() => setIsInputDialogOpen(false)}
      />

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => {} })}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onClose={closeAlert}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onGuestAccess={handleGuestAccess}
        onLogin={handleLogin}
        loginError={loginError}
      />
    </div>
  )
}
