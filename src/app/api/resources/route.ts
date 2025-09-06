import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        assignments: {
          include: {
            call: true
          }
        }
      }
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, identifier, location, latitude, longitude } = body

    const resource = await prisma.resource.create({
      data: {
        type,
        identifier,
        location,
        latitude,
        longitude,
        status: 'AVAILABLE'
      }
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}
