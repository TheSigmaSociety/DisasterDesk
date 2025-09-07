import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

    console.log('Updating emergency call:', id, 'with data:', body)

    const updatedCall = await prisma.emergencyCall.update({
      where: { id: id },
      data: {
        emergencyType: body.type || undefined,
        severity: body.severity || undefined,
        description: body.description || undefined,
        casualties: body.casualties !== undefined ? body.casualties : undefined,
        location: body.location || undefined,
        latitude: body.latitude || undefined,
        longitude: body.longitude || undefined,
        autoEscalated: body.autoEscalated !== undefined ? body.autoEscalated : undefined,
        humanTakeover: body.humanTakeover !== undefined ? body.humanTakeover : undefined,
        priority: body.severity === 'CRITICAL' ? 'CRITICAL' :
                 body.severity === 'HIGH' ? 'HIGH' :
                 body.severity === 'MEDIUM' ? 'MEDIUM' : 
                 body.severity === 'LOW' ? 'LOW' : undefined,
        status: (body.humanTakeover || body.autoEscalated) ? 'IN_PROGRESS' : undefined
      }
    })

    console.log('Emergency call updated successfully:', updatedCall)
    return NextResponse.json(updatedCall)
  } catch (error) {
    console.error('Error updating emergency call:', error)
    return NextResponse.json(
      { error: 'Failed to update emergency call', details: error },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const emergencyCall = await prisma.emergencyCall.findUnique({
      where: { id: id },
      include: {
        resources: {
          include: {
            resource: true
          }
        }
      }
    })

    if (!emergencyCall) {
      return NextResponse.json(
        { error: 'Emergency call not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(emergencyCall)
  } catch (error) {
    console.error('Error fetching emergency call:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emergency call' },
      { status: 500 }
    )
  }
}
