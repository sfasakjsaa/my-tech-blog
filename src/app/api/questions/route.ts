import { NextRequest, NextResponse } from "next/server"
import { questionManager } from "@/storage/database/questionManager"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const search = searchParams.get("search") || undefined
    const questions = await questionManager.getQuestions({
      categoryId,
      search,
    })
    return NextResponse.json({ success: true, data: questions })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const question = await questionManager.createQuestion(body)
    return NextResponse.json({ success: true, data: question }, { status: 201 })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create question" },
      { status: 500 }
    )
  }
}
