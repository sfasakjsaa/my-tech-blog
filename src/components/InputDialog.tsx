interface InputDialogProps {
  isOpen: boolean
  title: string
  placeholder?: string
  defaultValue?: string
  onConfirm: (value: string) => void
  onCancel: () => void
}

export default function InputDialog({
  isOpen,
  title,
  placeholder = "请输入内容",
  defaultValue = "",
  onConfirm,
  onCancel,
}: InputDialogProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const value = formData.get("input") as string
    if (value.trim()) {
      onConfirm(value.trim())
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <input
              name="input"
              type="text"
              defaultValue={defaultValue}
              placeholder={placeholder}
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
            >
              确定
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
