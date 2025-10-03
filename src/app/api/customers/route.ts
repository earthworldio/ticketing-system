/* Customer API Routes */

import { NextRequest, NextResponse } from 'next/server'
import { CustomerController } from '@/controllers/customerController'
import { CreateCustomerDTO } from '@/types'

/* POST /api/customers - Create customer */
export async function POST(request: NextRequest) {
  try {
    const body: CreateCustomerDTO = await request.json()

    const result = await CustomerController.createCustomer(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('API Create Customer Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

/* GET /api/customers - Get all customers */
export async function GET(request: NextRequest) {
  try {
    const result = await CustomerController.getAllCustomers()

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('API Get All Customers Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    )
  }
}

