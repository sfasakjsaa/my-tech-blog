import { NextResponse } from 'next/server'

const BACKEND_URL = 'https://azhen-blog-backend.onrender.com'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('[Proxy PUT] Request id:', id)

    const body = await request.json()
    console.log('[Proxy PUT] Request body:', body)

    const url = `${BACKEND_URL}/api/questions/${id}`
    console.log('[Proxy PUT] Backend URL:', url)

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('[Proxy PUT] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Proxy PUT] Backend error:', errorText)
      throw new Error(`Backend returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('[Proxy PUT] Backend response data:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[Proxy PUT] Proxy error:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Proxy error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('[Proxy DELETE] Request id:', id)

    const url = `${BACKEND_URL}/api/questions/${id}`
    console.log('[Proxy DELETE] Backend URL:', url)

    const response = await fetch(url, {
      method: 'DELETE',
    })

    console.log('[Proxy DELETE] Backend response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Proxy DELETE] Backend error:', errorText)
      throw new Error(`Backend returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('[Proxy DELETE] Backend response data:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('[Proxy DELETE] Proxy error:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Proxy error' },
      { status: 500 }
    )
  }
}
