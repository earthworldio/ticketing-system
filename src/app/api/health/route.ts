/* Health Check API Endpoint for Docker */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json(
      { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'ticketing-system' 
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    )
  }
}

