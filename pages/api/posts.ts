import { NextRequest, NextResponse } from 'next/server'

export interface Post {
  id: number
  content: string
  images: string[]
  type: 'text' | 'image' | 'mixed'
  created_at: string
  updated_at: string
}

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const posts: Post[] = [
    {
      id: 1,
      content: "The essence of beauty is not in what you see, but in how you remember it...",
      images: [],
      type: 'text',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const newPost: Post = {
    id: Date.now(),
    content: body.content || '',
    images: body.images || [],
    type: body.type || 'text',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return NextResponse.json({ success: true, id: newPost.id })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  return NextResponse.json({ success: true })
}
