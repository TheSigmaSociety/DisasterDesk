import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { callId, resourceId } = body

    // Create resource assignment
    const assignment = await prisma.resourceAssignment.create({
      data: {
        callId,
        resourceId,
        status: 'ASSIGNED'
      }
    })

    // Update resource status to DISPATCHED
    await prisma.resource.update({
      where: { id: resourceId },
      data: { status: 'DISPATCHED' }
    })

    // Update call status to DISPATCHED if not already
    await prisma.emergencyCall.update({
      where: { id: callId },
      data: { status: 'DISPATCHED' }
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error assigning resource:', error)
    return NextResponse.json(
      { error: 'Failed to assign resource' },
      { status: 500 }
    )
  }
}
