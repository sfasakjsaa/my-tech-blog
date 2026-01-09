interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
