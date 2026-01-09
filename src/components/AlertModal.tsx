interface AlertModalProps {
  isOpen: boolean
  title?: string
  message: string
  type?: "success" | "error" | "info" | "warning"
  onClose: () => void
}

export default function AlertModal({
  isOpen,
  title,
  message,
  type = "info",
  onClose,
}: AlertModalProps) {
  if (!isOpen) return null

  const typeStyles = {
    success: {
      icon: (
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgClass: "bg-green-50",
      textClass: "text-green-900",
    },
    error: {
      icon: (
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgClass: "bg-red-50",
      textClass: "text-red-900",
    },
    warning: {
      icon: (
        <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      bgClass: "bg-yellow-50",
      textClass: "text-yellow-900",
    },
    info: {
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgClass: "bg-blue-50",
      textClass: "text-blue-900",
    },
  }

  const style = typeStyles[type]
  const displayTitle = title || (type === "error" ? "错误" : type === "success" ? "成功" : type === "warning" ? "警告" : "提示")

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          {style.icon}
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{displayTitle}</h3>
          <p className={`text-gray-600 ${style.textClass}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
        >
          确定
        </button>
      </div>
    </div>
  )
}
