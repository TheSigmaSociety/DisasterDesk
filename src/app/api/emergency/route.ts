import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      callerName,
      callerPhone,
      location,
      latitude,
      longitude,
      emergencyType,
      severity,
      description,
      casualties,
      transcript,
      autoEscalated,
      humanTakeover
    } = body

    // Determine priority based on severity and type
    let priority = 'MEDIUM'
    if (severity === 'CRITICAL' || autoEscalated) {
      priority = 'CRITICAL'
    } else if (severity === 'HIGH') {
      priority = 'HIGH'
    } else if (severity === 'LOW') {
      priority = 'LOW'
    }

    const emergencyCall = await prisma.emergencyCall.create({
      data: {
        callerName,
        callerPhone,
        location,
        latitude,
        longitude,
        emergencyType,
        severity,
        description,
        casualties: casualties || 0,
        transcript,
        autoEscalated: autoEscalated || false,
        humanTakeover: humanTakeover || false,
        priority,
        status: 'PENDING'
      }
    })

    return NextResponse.json(emergencyCall)
  } catch (error) {
    console.error('Error creating emergency call:', error)
    return NextResponse.json(
      { error: 'Failed to create emergency call' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const calls = await prisma.emergencyCall.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        resources: {
          include: {
            resource: true
          }
        }
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
