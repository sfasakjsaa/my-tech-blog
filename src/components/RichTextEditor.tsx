"use client"

import { useEffect, useRef, useState } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showToolbar?: boolean
  onError?: (message: string, type?: "error" | "info" | "warning" | "success") => void
  maxHeight?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "请输入内容...",
  showToolbar = true,
  onError,
  maxHeight,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    // 先保存当前的选区
    const selection = window.getSelection()
    const range = selection?.getRangeAt(0)

    // 确保编辑器有焦点
    editorRef.current?.focus()

    // 恢复选区
    if (range && selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }

    // 然后执行命令
    document.execCommand(command, false, value)
  }

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        // 在编辑器中插入可删除的图片
        const imageUrl = result.data.url
        const imageId = `img-${Date.now()}`
        const imageWrapper = `
          <div class="image-wrapper relative inline-block" data-id="${imageId}">
            <img src="${imageUrl}" alt="上传的图片" style="max-width: 100%; height: auto;" />
            <button
              type="button"
              onclick="this.parentElement.remove()"
              class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
              contenteditable="false"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        `

        editorRef.current?.focus()
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const div = document.createElement('div')
          div.innerHTML = imageWrapper
          range.deleteContents()
          range.insertNode(div)
          // 移动光标到图片后面
          if (div.firstChild) {
            range.setStartAfter(div.firstChild)
            range.setEndAfter(div.firstChild)
          } else {
            range.setStartAfter(div)
            range.setEndAfter(div)
          }
          selection.removeAllRanges()
          selection.addRange(range)
        } else if (editorRef.current) {
          editorRef.current.innerHTML += imageWrapper
        }

        // 触发内容更新
        handleInput()
      } else {
        onError?.(result.error || "图片上传失败", "error")
      }
    } catch (error) {
      console.error("上传失败:", error)
      onError?.("图片上传失败，请重试", "error")
    } finally {
      setIsUploading(false)
    }
  }

  // 触发文件选择
  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    // 重置 input，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const ToolbarButton = ({
    onClick,
    label,
    isActive,
  }: {
    onClick: () => void
    label: React.ReactNode
    isActive?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-md transition-all text-sm ${
        isActive ? "bg-purple-500 text-white" : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* 隐藏的文件输入框 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Toolbar - 只有在 showToolbar 为 true 时显示 */}
      {showToolbar && (
        <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
          <ToolbarButton
            onClick={() => execCommand("bold")}
            label={<strong>B</strong>}
          />
          <ToolbarButton
            onClick={() => execCommand("italic")}
            label={<em>I</em>}
          />
          <ToolbarButton
            onClick={() => execCommand("underline")}
            label={<u>U</u>}
          />
          <ToolbarButton
            onClick={() => execCommand("strikeThrough")}
            label={<s>S</s>}
          />
          <div className="w-px h-8 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={() => execCommand("formatBlock", "<h1>")}
            label="H1"
          />
          <ToolbarButton
            onClick={() => execCommand("formatBlock", "<h2>")}
            label="H2"
          />
          <ToolbarButton
            onClick={() => execCommand("formatBlock", "<h3>")}
            label="H3"
          />
          <div className="w-px h-8 bg-gray-300 mx-1" />
          <select
            onChange={(e) => {
              const size = e.target.value
              execCommand("fontSize", size)
              e.target.value = "" // 重置选择
            }}
            className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            defaultValue=""
          >
            <option value="" disabled>字号</option>
            <option value="1">10px</option>
            <option value="2">13px</option>
            <option value="3">16px</option>
            <option value="4">18px</option>
            <option value="5">24px</option>
            <option value="6">32px</option>
            <option value="7">48px</option>
          </select>
          <div className="w-px h-8 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={() => execCommand("formatBlock", "<pre>")}
            label={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
          />
          <div className="w-px h-8 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={triggerFileSelect}
            label={
              isUploading ? (
                <span className="animate-pulse">上传中...</span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )
            }
          />
          <div className="w-px h-8 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={() => execCommand("insertUnorderedList")}
            label={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H6z" clipRule="evenodd" />
                <path d="M8 6a1 1 0 100 2h4a1 1 0 100-2H8zM8 10a1 1 0 100 2h4a1 1 0 100-2H8zM8 14a1 1 0 100 2h4a1 1 0 100-2H8z" />
              </svg>
            }
          />
          <ToolbarButton
            onClick={() => execCommand("insertOrderedList")}
            label={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M1 4h1v2H1V4zm0 4h1v2H1V8zm0 4h1v2H1v-2zm0 4h1v2H1v-2z" />
              </svg>
            }
          />
          <div className="w-px h-8 bg-gray-300 mx-1" />
          <ToolbarButton
            onClick={() => execCommand("justifyLeft")}
            label="左对齐"
          />
          <ToolbarButton
            onClick={() => execCommand("justifyCenter")}
            label="居中"
          />
          <ToolbarButton
            onClick={() => execCommand("justifyRight")}
            label="右对齐"
          />
        </div>
      )}

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable={showToolbar}
        onInput={handleInput}
        className={`p-4 focus:outline-none prose prose-sm max-w-none rich-editor-content overflow-auto ${maxHeight ? 'max-h-[' + maxHeight + ']' : 'min-h-[300px]'}`}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        style={{
          color: value ? 'inherit' : '#9ca3af',
          maxHeight: maxHeight,
          minHeight: maxHeight ? undefined : '300px',
        }}
      />
    </div>
  )
}
