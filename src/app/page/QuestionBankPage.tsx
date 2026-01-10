"use client"

import { useState, useEffect } from "react"
import type { Question } from "@/lib/api"
import RichTextEditor from "@/components/RichTextEditor"
import ConfirmDialog from "@/components/ConfirmDialog"
import AlertModal from "@/components/AlertModal"
import { questionApi } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

interface QuestionBankPageProps {
  selectedCategoryId: string
  categoryName: string
  categories: any[]
  onOpenInputDialog: () => void
}

export default function QuestionBankPage({
  selectedCategoryId: propSelectedCategoryId,
  categoryName,
  categories,
  onOpenInputDialog
}: QuestionBankPageProps) {
  const { isAuthenticated, isGuest, login, loginAsGuest } = useAuth()

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(propSelectedCategoryId)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "frequent" | "non-frequent">("all")

  // 当 prop 变化时更新本地状态
  useEffect(() => {
    console.log("[DEBUG] propSelectedCategoryId changed:", propSelectedCategoryId)
    setSelectedCategoryId(propSelectedCategoryId)
  }, [propSelectedCategoryId])

  // 当分类变化时重新加载题目
  useEffect(() => {
    console.log("[DEBUG] selectedCategoryId changed:", selectedCategoryId)
    if (!selectedCategoryId) {
      console.log("[DEBUG] No selectedCategoryId, skipping questions load")
      setQuestions([])
      setLoading(false)
      return
    }

    const loadQuestions = async () => {
      console.log("[DEBUG] Loading questions for category:", selectedCategoryId)
      setLoading(true)
      try {
        const result = await questionApi.list({ categoryId: selectedCategoryId, search: searchQuery })
        if (result.success && result.data) {
          console.log("[DEBUG] Loaded questions count:", result.data.length)
          setQuestions(result.data)
        }
      } catch (error) {
        console.error("Error loading questions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [selectedCategoryId, searchQuery])

  // Alert Modal state
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title?: string; message: string; type?: "success" | "error" | "info" | "warning" }>({
    isOpen: false,
    message: "",
  })

  const showAlert = (message: string, type: "success" | "error" | "info" | "warning" = "info", title?: string) => {
    setAlertModal({ isOpen: true, title, message, type })
  }

  const closeAlert = () => {
    setAlertModal({ isOpen: false, message: "" })
  }

  // Confirm Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  })

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm })
  }

  const closeConfirm = () => {
    setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => {} })
  }

  // 根据筛选条件过滤题目
  const filteredQuestions = questions.filter((question) => {
    if (filterType === "all") return true
    if (filterType === "frequent") return question.isFrequent
    if (filterType === "non-frequent") return !question.isFrequent
    return true
  })

  // Question Modal
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [questionTitle, setQuestionTitle] = useState("")
  const [questionContent, setQuestionContent] = useState("")
  const [isFrequentQuestion, setIsFrequentQuestion] = useState(false)
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false)

  // 加载问题
  useEffect(() => {
    if (!selectedCategoryId) {
      console.log("[DEBUG] No selectedCategoryId, skipping questions load")
      setQuestions([])
      setLoading(false)
      return
    }

    const loadQuestions = async () => {
      setLoading(true)
      try {
        const result = await questionApi.list({ categoryId: selectedCategoryId, search: searchQuery })
        if (result.success && result.data) {
          setQuestions(result.data)
        }
      } catch (error) {
        console.error("Error loading questions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [selectedCategoryId, searchQuery])

  // 新增问题
  const handleAddQuestion = () => {
    setEditingQuestion(null)
    setQuestionTitle("")
    setQuestionContent("")
    setIsFrequentQuestion(false)
    setShowQuestionModal(true)
  }

  // 编辑问题
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setQuestionTitle(question.title)
    setQuestionContent(question.content)
    setIsFrequentQuestion(question.isFrequent ?? false)
    setShowQuestionModal(true)
  }

  // 提交问题
  const handleSubmitQuestion = async () => {
    if (!questionTitle.trim() || !questionContent.trim()) {
      showAlert("请填写标题和内容", "warning")
      return
    }

    setIsSubmittingQuestion(true)
    try {
      let result
      if (editingQuestion) {
        result = await questionApi.update(editingQuestion.id, {
          title: questionTitle,
          content: questionContent,
          categoryId: selectedCategoryId,
          isFrequent: isFrequentQuestion,
        })
      } else {
        result = await questionApi.create({
          title: questionTitle,
          content: questionContent,
          categoryId: selectedCategoryId,
          isFrequent: isFrequentQuestion,
        })
      }

      if (result.success) {
        setShowQuestionModal(false)
        setQuestionTitle("")
        setQuestionContent("")
        setIsFrequentQuestion(false)
        setEditingQuestion(null)
        showAlert(editingQuestion ? "题目更新成功" : "题目添加成功", "success")
        // 重新加载问题
        const qResult = await questionApi.list({ categoryId: selectedCategoryId, search: searchQuery })
        if (qResult.success && qResult.data) {
          setQuestions(qResult.data)
        }
      } else {
        showAlert("保存失败，请重试", "error")
        // 失败时也刷新列表，确保数据同步
        const qResult = await questionApi.list({ categoryId: selectedCategoryId, search: searchQuery })
        if (qResult.success && qResult.data) {
          setQuestions(qResult.data)
        }
      }
    } catch (error) {
      console.error("Error saving question:", error)
      const errorMessage = error instanceof Error ? error.message : "未知错误"
      // 如果是404错误，说明题目已不存在
      if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        showAlert("题目不存在，列表已刷新", "warning")
        setShowQuestionModal(false)
        setEditingQuestion(null)
      } else {
        showAlert("保存失败，请重试", "error")
      }
      // 无论如何都刷新列表，确保数据同步
      try {
        const qResult = await questionApi.list({ categoryId: selectedCategoryId, search: searchQuery })
        if (qResult.success && qResult.data) {
          setQuestions(qResult.data)
        }
      } catch (e) {
        console.error("Failed to refresh questions:", e)
      }
    } finally {
      setIsSubmittingQuestion(false)
    }
  }

  // 删除问题
  const handleDeleteQuestion = async (id: string) => {
    showConfirm(
      "删除题目",
      "确定要删除这个问题吗？",
      async () => {
        try {
          const result = await questionApi.delete(id)
          if (result.success) {
            showAlert("题目删除成功", "success")
            closeConfirm()
            // 重新加载问题
            const qResult = await questionApi.list({ categoryId: selectedCategoryId, search: searchQuery })
            if (qResult.success && qResult.data) {
              setQuestions(qResult.data)
            }
          } else {
            showAlert("删除失败，请重试", "error")
            closeConfirm()
            // 失败时也刷新列表，确保数据同步
            const qResult = await questionApi.list({ categoryId: selectedCategoryId, search: searchQuery })
            if (qResult.success && qResult.data) {
              setQuestions(qResult.data)
            }
          }
        } catch (error) {
          console.error("Error deleting question:", error)
          const errorMessage = error instanceof Error ? error.message : "未知错误"
          // 如果是404错误，说明题目已不存在
          if (errorMessage.includes("404") || errorMessage.includes("not found")) {
            showAlert("题目不存在，列表已刷新", "warning")
          } else {
            showAlert("删除失败，请重试", "error")
          }
          closeConfirm()
          // 无论如何都刷新列表，确保数据同步
          try {
            const qResult = await questionApi.list({ categoryId: selectedCategoryId, search: searchQuery })
            if (qResult.success && qResult.data) {
              setQuestions(qResult.data)
            }
          } catch (e) {
            console.error("Failed to refresh questions:", e)
          }
        }
      }
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* 页面标题 - 桌面端显示 */}
      {categoryName && (
        <div className="hidden md:block px-3 md:px-0 pb-6 flex-shrink-0">
          <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            题库（{categoryName}）
          </h1>
        </div>
      )}

      {/* 移动端搜索框 */}
      <div className="md:hidden px-4 py-2 flex-shrink-0 bg-white border-b border-gray-200">
        <div className="relative">
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜索题目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
      </div>

      {/* 筛选和操作按钮 */}
      <div className="md:hidden px-4 py-2 flex-shrink-0 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            <option value="all">全部题目</option>
            <option value="frequent">常考题</option>
            <option value="non-frequent">不常考</option>
          </select>
          <button
            onClick={isGuest ? () => showAlert("游客无法操作，请登录", "warning") : handleAddQuestion}
            disabled={isGuest}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isGuest
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            新增题目
          </button>
        </div>
      </div>

      {/* 桌面端搜索和筛选 */}
      <div className="hidden md:block px-3 md:px-0 pb-3 flex-shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="搜索题目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
          >
            <option value="all">全部题目</option>
            <option value="frequent">常考题</option>
            <option value="non-frequent">不常考</option>
          </select>
          <button
            onClick={isGuest ? () => showAlert("游客无法操作，请登录", "warning") : handleAddQuestion}
            disabled={isGuest}
            className={`px-6 py-2 rounded-lg font-medium text-base flex-shrink-0 transition-colors ${
              isGuest
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            新增题目
          </button>
        </div>
      </div>

      {/* 题目列表 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 md:px-3 md:py-0 md:pb-0 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="text-center text-gray-500 py-12 px-4">
                {searchQuery || filterType !== "all"
                  ? "没有找到匹配的题目"
                  : "该分类下还没有题目，点击上方「新增题目」开始添加"}
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-300 hover:shadow-xl hover:border-purple-500 transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        {question.isFrequent && (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium flex-shrink-0">
                            常考
                          </span>
                        )}
                        <h3 className="font-bold text-gray-900 text-lg break-words">{question.title}</h3>
                      </div>
                      <div
                        className="text-base text-gray-800 prose prose-sm max-w-none break-words leading-relaxed overflow-wrap-break-word"
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                        dangerouslySetInnerHTML={{ __html: question.content }}
                      />
                    </div>
                    <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                      <button
                        onClick={isGuest ? () => showAlert("游客无法操作，请登录", "warning") : () => handleEditQuestion(question)}
                        disabled={isGuest}
                        className={`flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg transition-colors text-center font-semibold ${
                          isGuest
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        }`}
                      >
                        编辑
                      </button>
                      <button
                        onClick={isGuest ? () => showAlert("游客无法操作，请登录", "warning") : () => handleDeleteQuestion(question.id)}
                        disabled={isGuest}
                        className={`flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg transition-colors text-center font-semibold ${
                          isGuest
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 题目编辑弹窗 */}
      {showQuestionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex-shrink-0">
              {editingQuestion ? "编辑题目" : "新增题目"}
            </h2>
            <div className="flex-1 overflow-auto space-y-4">
              <input
                type="text"
                placeholder="题目标题"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">题目内容</label>
                <RichTextEditor
                  value={questionContent}
                  onChange={setQuestionContent}
                  onError={showAlert}
                  maxHeight="400px"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFrequentQuestion}
                  onChange={(e) => setIsFrequentQuestion(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">标记为常考题</span>
              </label>
            </div>
            <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitQuestion}
                disabled={isSubmittingQuestion}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isSubmittingQuestion ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onClose={closeAlert}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  )
}
