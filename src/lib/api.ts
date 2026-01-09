// API 客户端工具模块

// 使用前端 API 代理，避免跨域问题
const API_BASE_URL = ''

console.log('[API Client] Using proxy mode (base URL: empty)')

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

export interface Category {
  id: string
  name: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  title: string
  content: string
  categoryId: string
  isFrequent: boolean
  createdAt: string
  updatedAt: string
}

// 通用请求方法
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `/api/proxy${endpoint}`

  console.log('[API Client] Requesting:', url)

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  try {
    console.log('[API Client] Starting fetch...')
    const response = await fetch(url, {
      ...options,
      headers,
    })

    console.log('[API Client] Response status:', response.status)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('[API Client] API request failed:', url, error)
    console.error('[API Client] Error details:', error instanceof Error ? error.message : error)
    throw error
  }
}

// ============ 分类 API ============

export const categoryApi = {
  // 获取所有分类
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return request<Category[]>("/categories")
  },

  // 创建分类
  create: async (name: string): Promise<ApiResponse<Category>> => {
    return request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  },

  // 更新分类
  update: async (id: string, name: string, order: number): Promise<ApiResponse<Category>> => {
    return request<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, order }),
    })
  },

  // 删除分类
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return request<void>(`/categories/${id}`, {
      method: "DELETE",
    })
  },

  // 更新分类排序
  reorder: async (categories: { id: string; order: number }[]): Promise<ApiResponse<void>> => {
    return request<void>("/categories/reorder", {
      method: "POST",
      body: JSON.stringify({ categories }),
    })
  },
}

// ============ 题目 API ============

export const questionApi = {
  // 获取题目列表
  list: async (params?: { categoryId?: string; search?: string }): Promise<ApiResponse<Question[]>> => {
    const searchParams = new URLSearchParams()
    if (params?.categoryId) searchParams.append("categoryId", params.categoryId)
    if (params?.search) searchParams.append("search", params.search)

    const endpoint = `/questions${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    return request<Question[]>(endpoint)
  },

  // 创建题目
  create: async (data: {
    title: string
    content: string
    categoryId: string
    isFrequent?: boolean
  }): Promise<ApiResponse<Question>> => {
    return request<Question>("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // 更新题目
  update: async (
    id: string,
    data: {
      title: string
      content: string
      categoryId: string
      isFrequent?: boolean
    }
  ): Promise<ApiResponse<Question>> => {
    return request<Question>(`/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // 删除题目
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return request<void>(`/questions/${id}`, {
      method: "DELETE",
    })
  },

  // 更新题目排序
  reorder: async (questions: { id: string; order: number }[]): Promise<ApiResponse<void>> => {
    return request<void>("/questions/reorder", {
      method: "POST",
      body: JSON.stringify({ questions }),
    })
  },
}

export default { categoryApi, questionApi }
