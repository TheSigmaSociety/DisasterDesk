const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding emergency resources...')
  
  // Create emergency resources
  const resources = [
    {
      type: 'FIRE_TRUCK',
      identifier: 'Fire Truck 101',
      status: 'AVAILABLE',
      station: 'Fire Station 1',
      currentLat: 40.7128,
      currentLng: -74.0060,
    },
    {
      type: 'AMBULANCE',
      identifier: 'Ambulance 5',
      status: 'AVAILABLE',
      station: 'Hospital Central',
      currentLat: 40.7589,
      currentLng: -73.9851,
    },
    {
      type: 'POLICE_CAR',
      identifier: 'Police Unit 42',
      status: 'AVAILABLE',
      station: 'Police Precinct 12',
      currentLat: 40.7505,
      currentLng: -73.9934,
    },
    {
      type: 'AMBULANCE',
      identifier: 'Ambulance 3',
      status: 'DISPATCHED',
      station: 'Hospital East',
      currentLat: 40.7282,
      currentLng: -73.7949,
    },
    {
      type: 'FIRE_TRUCK',
      identifier: 'Fire Truck 203',
      status: 'AVAILABLE',
      station: 'Fire Station 2',
      currentLat: 40.6892,
      currentLng: -74.0445,
    }
  ]

  for (const resource of resources) {
    await prisma.resource.create({
      data: resource
    })
    console.log(`✅ Created ${resource.identifier}`)
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
