import { NextRequest, NextResponse } from 'next/server'

export interface MusicTrack {
  id: number
  title: string
  artist: string
  audio_url: string
  created_at: string
}

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const tracks: MusicTrack[] = [
    {
      id: 1,
      title: 'Lavender Dreams',
      artist: 'Dreamy Mood',
      audio_url: '',
      created_at: new Date().toISOString(),
    },
  ]

  return NextResponse.json(tracks)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const newTrack: MusicTrack = {
    id: Date.now(),
    title: body.title || '',
    artist: body.artist || '',
    audio_url: body.audio_url || '',
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({ success: true, id: newTrack.id })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  return NextResponse.json({ success: true })
}
