import Link from 'next/link'
import { Phone, Users, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          DisasterDesk
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Emergency Response System
        </p>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Advanced emergency call handling with real-time speech AI, intelligent 
          resource allocation, and automated dispatch management.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* User Client */}
        <Link
          href="/emergency"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-red-500"
        >
          <div className="flex items-center mb-4">
            <Phone className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Emergency Caller</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Report an emergency through our AI-powered voice interface that captures
            your location, emergency type, and severity automatically.
          </p>
          <div className="text-red-600 font-semibold">
            Start Emergency Report →
          </div>
        </Link>

        {/* Dispatcher Client */}
        <Link
          href="/dispatch"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-blue-500"
        >
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Dispatch Center</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Manage emergency calls, allocate resources, and coordinate response
            efforts with AI-powered recommendations and priority management.
          </p>
          <div className="text-blue-600 font-semibold">
            Open Dispatch Dashboard →
          </div>
        </Link>
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
          <Shield className="h-5 w-5 mr-2" />
          System Status: Operational
        </div>
      </div>
    </div>
  )
}
