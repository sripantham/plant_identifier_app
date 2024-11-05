import { Leaf } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-green-800">PlantID</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link 
              href="/"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-green-900 hover:text-green-600"
            >
              Home
            </Link>
            <Link 
              href="/database"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-green-600"
            >
              Plant Database
            </Link>
            <Link 
              href="/about"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-green-600"
            >
              About
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-green-600"
            >
              Contact
            </Link>
            <Link 
              href="/blog"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-green-600"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}