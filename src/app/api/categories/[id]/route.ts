import { NextRequest, NextResponse } from "next/server"
import { categoryManager } from "@/storage/database/categoryManager"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const category = await categoryManager.updateCategory(id, body)
    if (category) {
      return NextResponse.json({ success: true, data: category })
    }
    return NextResponse.json(
      { success: false, error: "Category not found" },
      { status: 404 }
    )
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
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
    const success = await categoryManager.deleteCategory(id)
    if (success) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json(
      { success: false, error: "Category not found" },
      { status: 404 }
    )
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
