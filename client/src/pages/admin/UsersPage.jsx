import React, { useState } from 'react';
import { Plus, Edit, Trash2, Mail, User, Search, Filter, MoreVertical, Shield, Key, Globe, Settings, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'info@primewebdev.in',
      name: 'Info Department',
      role: 'info',
      status: 'active',
      domain: 'primewebdev.in',
      createdAt: '2024-01-15',
      lastLogin: '2024-07-15',
      storage: '2.5 GB',
      maxStorage: '5 GB',
      password: 'Info@123',
      forwardTo: '',
      autoReply: false
    },
    {
      id: 2,
      email: 'support@primewebdev.in',
      name: 'Support Team',
      role: 'support',
      status: 'active',
      domain: 'primewebdev.in',
      createdAt: '2024-01-15',
      lastLogin: '2024-07-16',
      storage: '1.8 GB',
      maxStorage: '5 GB',
      password: 'Support@456',
      forwardTo: 'team@primewebdev.in',
      autoReply: true
    },
    {
      id: 3,
      email: 'sales@primewebdev.in',
      name: 'Sales Department',
      role: 'sales',
      status: 'active',
      domain: 'primewebdev.in',
      createdAt: '2024-02-01',
      lastLogin: '2024-07-16',
      storage: '3.2 GB',
      maxStorage: '10 GB',
      password: 'Sales@789',
      forwardTo: '',
      autoReply: false
    },
    {
      id: 4,
      email: 'admin@primewebdev.in',
      name: 'Administrator',
      role: 'admin',
      status: 'active',
      domain: 'primewebdev.in',
      createdAt: '2024-01-01',
      lastLogin: '2024-07-16',
      storage: '5.1 GB',
      maxStorage: '25 GB',
      password: 'Admin@999',
      forwardTo: '',
      autoReply: false
    },
    {
      id: 5,
      email: 'noreply@primewebdev.in',
      name: 'No Reply',
      role: 'system',
      status: 'inactive',
      domain: 'primewebdev.in',
      createdAt: '2024-01-10',
      lastLogin: 'Never',
      storage: '0.1 GB',
      maxStorage: '1 GB',
      password: 'NoReply@000',
      forwardTo: '',
      autoReply: true
    }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'user',
    domain: 'primewebdev.in',
    password: '',
    maxStorage: '5',
    forwardTo: '',
    autoReply: false
  });

  const roleConfig = {
    admin: { color: 'bg-red-100 text-red-800', icon: <Shield size={14} />, label: 'Admin' },
    support: { color: 'bg-blue-100 text-blue-800', icon: <User size={14} />, label: 'Support' },
    sales: { color: 'bg-green-100 text-green-800', icon: <Globe size={14} />, label: 'Sales' },
    info: { color: 'bg-purple-100 text-purple-800', icon: <Mail size={14} />, label: 'Info' },
    system: { color: 'bg-gray-100 text-gray-800', icon: <Settings size={14} />, label: 'System' },
    user: { color: 'bg-yellow-100 text-yellow-800', icon: <User size={14} />, label: 'User' }
  };

  const commonEmailPrefixes = [
    'info', 'support', 'sales', 'admin', 'contact', 'help', 'team', 'noreply',
    'marketing', 'billing', 'hr', 'tech', 'dev', 'hello', 'mail', 'webmaster'
  ];

  const handleAddUser = () => {
    if (newUser.email && newUser.name && newUser.password) {
      const user = {
        id: users.length + 1,
        email: newUser.email.includes('@') ? newUser.email : `${newUser.email}@${newUser.domain}`,
        name: newUser.name,
        role: newUser.role,
        status: 'active',
        domain: newUser.domain,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never',
        storage: '0 GB',
        maxStorage: `${newUser.maxStorage} GB`,
        password: newUser.password,
        forwardTo: newUser.forwardTo,
        autoReply: newUser.autoReply
      };
      setUsers([...users, user]);
      setNewUser({
        email: '',
        name: '',
        role: 'user',
        domain: 'primewebdev.in',
        password: '',
        maxStorage: '5',
        forwardTo: '',
        autoReply: false
      });
      setShowAddUser(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setSelectedUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setSelectedUser(updatedUser);
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Users Management</h1>
              <p className="text-gray-600 mt-1">Manage email accounts for your domains</p>
            </div>
            <button
              onClick={() => setShowAddUser(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Add User
            </button>
          </div>
        </div>
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Storage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((acc, user) => acc + parseFloat(user.storage), 0).toFixed(1)} GB
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="info">Info</option>
              <option value="system">System</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Add New Email User</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Prefix</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="info, support, sales..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                        @{newUser.domain}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {commonEmailPrefixes.map(prefix => (
                        <button
                          key={prefix}
                          onClick={() => setNewUser({ ...newUser, email: prefix })}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                          {prefix}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Support Team, Sales Department..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="support">Support</option>
                      <option value="sales">Sales</option>
                      <option value="info">Info</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Storage (GB)</label>
                    <input
                      type="number"
                      value={newUser.maxStorage}
                      onChange={(e) => setNewUser({ ...newUser, maxStorage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Enter password..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setNewUser({ ...newUser, password: generatePassword() })}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      <Key size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forward To (Optional)</label>
                  <input
                    type="email"
                    value={newUser.forwardTo}
                    onChange={(e) => setNewUser({ ...newUser, forwardTo: e.target.value })}
                    placeholder="Forward emails to another address..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoReply"
                    checked={newUser.autoReply}
                    onChange={(e) => setNewUser({ ...newUser, autoReply: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoReply" className="ml-2 block text-sm text-gray-700">
                    Enable auto-reply
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleConfig[user.role].color}`}>
                        {roleConfig[user.role].icon}
                        {roleConfig[user.role].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {user.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(parseFloat(user.storage) / parseFloat(user.maxStorage)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{user.storage} / {user.maxStorage}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {showPasswords[user.id] ? user.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords[user.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(user.password)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
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
    </div>
  );
}

export default UsersPage;