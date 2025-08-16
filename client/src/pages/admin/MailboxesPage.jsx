import React, { useState } from 'react'
import { Mail, Plus, Settings, Trash2, Edit3, Shield, Users, HardDrive, Search, Filter, MoreVertical } from 'lucide-react'
import AddMailbox from '../../components/forms/AddMailbox'

function MailboxesPage() {
  const [mailboxes, setMailboxes] = useState([
    {
      id: 1,
      email: 'admin@mycompany.com',
      name: 'Admin Account',
      storage: '2.1 GB',
      storageLimit: '5 GB',
      status: 'active',
      lastLogin: '2 hours ago',
      forwards: 0,
      aliases: 2
    },
    {
      id: 2,
      email: 'support@mycompany.com',
      name: 'Support Team',
      storage: '1.8 GB',
      storageLimit: '10 GB',
      status: 'active',
      lastLogin: '1 day ago',
      forwards: 1,
      aliases: 1
    },
    {
      id: 3,
      email: 'sales@mycompany.com',
      name: 'Sales Department',
      storage: '3.2 GB',
      storageLimit: '5 GB',
      status: 'suspended',
      lastLogin: '5 days ago',
      forwards: 0,
      aliases: 0
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMailbox, setNewMailbox] = useState({
    email: '',
    name: '',
    password: '',
    storageLimit: '5'
  })

  const handleCreateMailbox = () => {
    if (newMailbox.email && newMailbox.name && newMailbox.password) {
      const newId = Math.max(...mailboxes.map(m => m.id)) + 1
      setMailboxes([...mailboxes, {
        id: newId,
        email: newMailbox.email,
        name: newMailbox.name,
        storage: '0 MB',
        storageLimit: `${newMailbox.storageLimit} GB`,
        status: 'active',
        lastLogin: 'Never',
        forwards: 0,
        aliases: 0
      }])
      setNewMailbox({ email: '', name: '', password: '', storageLimit: '5' })
      setShowCreateModal(false)
    }
  }

  const handleDeleteMailbox = (id) => {
    setMailboxes(mailboxes.filter(m => m.id !== id))
  }

  const toggleStatus = (id) => {
    setMailboxes(mailboxes.map(m =>
      m.id === id ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' } : m
    ))
  }

  const filteredMailboxes = mailboxes.filter(mailbox =>
    mailbox.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mailbox.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStoragePercentage = (used, limit) => {
    const usedGB = parseFloat(used.replace(/[^0-9.]/g, '')) / (used.includes('GB') ? 1 : 1000)
    const limitGB = parseFloat(limit.replace(/[^0-9.]/g, ''))
    return Math.min((usedGB / limitGB) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
                <p className="text-sm text-gray-600">Manage your domain mailboxes</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Mailbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Mailboxes</p>
                <p className="text-2xl font-bold text-gray-900">{mailboxes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{mailboxes.filter(m => m.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <HardDrive className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">7.1 GB</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Aliases</p>
                <p className="text-2xl font-bold text-gray-900">{mailboxes.reduce((sum, m) => sum + m.aliases, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search mailboxes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mailboxes Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email & Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Storage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aliases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMailboxes.map((mailbox) => (
                  <tr key={mailbox.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{mailbox.email}</div>
                          <div className="text-sm text-gray-500">{mailbox.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mailbox.storage} / {mailbox.storageLimit}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${getStoragePercentage(mailbox.storage, mailbox.storageLimit)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${mailbox.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {mailbox.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mailbox.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {mailbox.aliases}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(mailbox.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMailbox(mailbox.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Mailbox Modal */}
      {showCreateModal && (
        <AddMailbox
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMailbox}
          initialData={newMailbox}
        />
      )}

    </div>
  )
}

export default MailboxesPage