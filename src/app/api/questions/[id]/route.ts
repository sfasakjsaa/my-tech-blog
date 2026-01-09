import { NextRequest, NextResponse } from "next/server"
import { questionManager } from "@/storage/database/questionManager"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const question = await questionManager.updateQuestion(id, body)
    if (question) {
      return NextResponse.json({ success: true, data: question })
    }
    return NextResponse.json(
      { success: false, error: "Question not found" },
      { status: 404 }
    )
  } catch (error) {
    console.error("Error updating question:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update question" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = await questionManager.deleteQuestion(id)
    if (success) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json(
      { success: false, error: "Question not found" },
      { status: 404 }
    )
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete question" },
      { status: 500 }
    )
  }
}
