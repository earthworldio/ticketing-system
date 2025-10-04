/* File Upload API Route */

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const extension = originalName.substring(originalName.lastIndexOf('.'))
    const filename = `${timestamp}${extension}`
    
    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(uploadsDir, filename)
    
    await writeFile(filepath, buffer)

    // Return file info
    return NextResponse.json({
      success: true,
      data: {
        filename: originalName,
        filepath: `/uploads/${filename}`,
        size: file.size,
        type: file.type
      }
    })
  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload file', error: error.message },
      { status: 500 }
    )
  }
}

