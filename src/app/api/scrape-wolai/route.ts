import { NextRequest, NextResponse } from "next/server"
import { SearchClient, Config } from "coze-coding-dev-sdk"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      )
    }

    // 提取页面 ID
    const pageId = url.split('/').pop()

    const config = new Config()
    const client = new SearchClient(config)

    // 使用搜索来查找相关内容
    const response = await client.advancedSearch(
      `CSS 题库 ${pageId}`,
      {
        searchType: 'web',
        count: 10,
        sites: 'wolai.com',
        needContent: true,
        needUrl: true,
        needSummary: true
      }
    )

    return NextResponse.json({
      success: true,
      data: {
        results: response.web_items || [],
        summary: response.summary || ''
      }
    })
  } catch (error) {
    console.error("Scraping failed:", error)
    return NextResponse.json(
      { success: false, error: "Failed to scrape the page" },
      { status: 500 }
    )
  }
}
