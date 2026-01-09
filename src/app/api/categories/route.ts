import { NextRequest, NextResponse } from "next/server"
import { categoryManager } from "@/storage/database/categoryManager"

export async function GET(request: NextRequest) {
  try {
    console.log("API: Fetching categories...")
    const categories = await categoryManager.getCategories()
    console.log("API: Categories fetched:", categories.length)
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const category = await categoryManager.createCategory(body)
    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    )
  }
}
