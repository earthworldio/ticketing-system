/* Customer API Routes (Single Customer) */

import { NextRequest, NextResponse } from 'next/server'
import { CustomerController } from '@/controllers/customerController'
import { UpdateCustomerDTO } from '@/types'

/* GET /api/customers/[id] - Get customer by ID */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await CustomerController.getCustomerById(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch customer',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* PUT /api/customers/[id] - Update customer */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body: UpdateCustomerDTO = await request.json()

    const result = await CustomerController.updateCustomer(id, body)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update customer',
        error: error.message
      },
      { status: 500 }
    )
  }
}

/* DELETE /api/customers/[id] - Delete customer */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await CustomerController.deleteCustomer(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete customer',
        error: error.message
      },
      { status: 500 }
    )
  }
}

