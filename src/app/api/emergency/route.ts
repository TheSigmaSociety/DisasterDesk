import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const calls = await prisma.emergencyCall.findMany({
      include: {
        resources: {
          include: {
            resource: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(calls)
  } catch (error) {
    console.error('Error fetching emergency calls:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emergency calls' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      severity,
      description,
      casualties = 0,
      location,
      latitude,
      longitude,
      transcript,
      autoEscalated = false,
      humanTakeover = false,
      callerName,
      callerPhone
    } = body

    console.log('Creating emergency call with Gemini AI data:', body)

    const emergencyCall = await prisma.emergencyCall.create({
      data: {
        emergencyType: type || 'OTHER',
        severity: severity || 'MEDIUM',
        description: description || 'No description provided',
        casualties: casualties,
        location: location || 'Location unavailable',
        latitude: latitude,
        longitude: longitude,
        transcript: transcript,
        autoEscalated: autoEscalated,
        humanTakeover: humanTakeover,
        callerName: callerName,
        callerPhone: callerPhone,
        status: humanTakeover || autoEscalated ? 'IN_PROGRESS' : 'PENDING',
        priority: severity === 'CRITICAL' ? 'CRITICAL' :
                 severity === 'HIGH' ? 'HIGH' :
                 severity === 'MEDIUM' ? 'MEDIUM' : 'LOW'
      }
    })

    console.log('Emergency call created successfully:', emergencyCall)
    return NextResponse.json(emergencyCall)
  } catch (error) {
    console.error('Error creating emergency call:', error)
    return NextResponse.json(
      { error: 'Failed to create emergency call', details: error },
      { status: 500 }
    )
  }
}
