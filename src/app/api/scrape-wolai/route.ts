import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      )
    }

    // 暂时禁用 Wolai 抓取功能
    // 如果需要这个功能，可以集成联网搜索服务或其他抓取工具
    return NextResponse.json(
      {
        success: false,
        error: "Wolai 抓取功能暂时不可用，请手动添加题目",
      },
      { status: 503 }
    )
  } catch (error) {
    console.error("Scraping failed:", error)
    return NextResponse.json(
      { success: false, error: "Failed to scrape the page" },
      { status: 500 }
    )
  }
}
