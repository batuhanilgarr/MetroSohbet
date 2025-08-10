import UsersList from './UsersList'
import Link from 'next/link'

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Admin Paneli
              </Link>
            </div>
          </div>

          <UsersList />
        </div>
      </div>
    </div>
  )
}
