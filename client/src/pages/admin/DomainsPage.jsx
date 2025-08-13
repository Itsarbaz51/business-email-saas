import React, { useState } from 'react';
import { Plus, Settings, Mail, Globe, Check, X, AlertCircle, Copy, ExternalLink, Server, Shield, Zap } from 'lucide-react';

function DomainsPage() {
  const [domains, setDomains] = useState([
    {
      id: 1,
      name: 'primewebdev.in',
      status: 'active',
      emailProvider: 'primemail',
      verified: true,
      sslEnabled: true,
      expiryDate: '2025-12-15',
      emailAccounts: 5,
      maxEmails: 100
    },
    {
      id: 2,
      name: 'example.com',
      status: 'pending',
      emailProvider: 'primemail',
      verified: false,
      sslEnabled: false,
      expiryDate: '2025-08-20',
      emailAccounts: 2,
      maxEmails: 50
    }
  ]);

  const [selectedDomain, setSelectedDomain] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState({
    name: '',
    emailProvider: 'primemail'
  });

  const emailProviders = {
    primemail: {
      name: 'PrimeMail Pro',
      color: 'bg-gradient-to-r from-blue-600 to-purple-600',
      icon: <Mail className="w-5 h-5" />,
      settings: {
        incoming: {
          server: 'mail.primewebdev.in',
          port: 993,
          ssl: true
        },
        outgoing: {
          server: 'smtp.primewebdev.in',
          port: 587,
          ssl: true
        }
      }
    },
    primemail_basic: {
      name: 'PrimeMail Basic',
      color: 'bg-gradient-to-r from-green-500 to-blue-500',
      icon: <Server className="w-5 h-5" />,
      settings: {
        incoming: {
          server: 'imap.primewebdev.in',
          port: 993,
          ssl: true
        },
        outgoing: {
          server: 'smtp.primewebdev.in',
          port: 465,
          ssl: true
        }
      }
    },
    primemail_enterprise: {
      name: 'PrimeMail Enterprise',
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      icon: <Shield className="w-5 h-5" />,
      settings: {
        incoming: {
          server: 'secure.primewebdev.in',
          port: 993,
          ssl: true
        },
        outgoing: {
          server: 'relay.primewebdev.in',
          port: 587,
          ssl: true
        }
      }
    }
  };

  const handleAddDomain = () => {
    if (newDomain.name) {
      const domain = {
        id: domains.length + 1,
        name: newDomain.name,
        status: 'pending',
        emailProvider: newDomain.emailProvider,
        verified: false,
        sslEnabled: false,
        expiryDate: '2026-01-01',
        emailAccounts: 0,
        maxEmails: emailProviders[newDomain.emailProvider].name === 'PrimeMail Enterprise' ? 500 : 
                   emailProviders[newDomain.emailProvider].name === 'PrimeMail Pro' ? 100 : 50
      };
      setDomains([...domains, domain]);
      setNewDomain({ name: '', emailProvider: 'zoho' });
      setShowAddDomain(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getDNSRecords = (domain) => {
    const provider = emailProviders[domain.emailProvider];
    return [
      {
        type: 'MX',
        name: '@',
        value: 'mail.primewebdev.in',
        priority: 10
      },
      {
        type: 'MX',
        name: '@',
        value: 'mail2.primewebdev.in',
        priority: 20
      },
      {
        type: 'TXT',
        name: '@',
        value: 'v=spf1 include:primewebdev.in ~all',
        priority: '-'
      },
      {
        type: 'TXT',
        name: '_dmarc',
        value: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@primewebdev.in',
        priority: '-'
      },
      {
        type: 'CNAME',
        name: 'mail',
        value: 'mail.primewebdev.in',
        priority: '-'
      },
      {
        type: 'CNAME',
        name: 'webmail',
        value: 'webmail.primewebdev.in',
        priority: '-'
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Domain Management</h1>
              <p className="text-gray-600 mt-1">Configure your domains and email servers</p>
            </div>
            <button
              onClick={() => setShowAddDomain(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} />
              Add Domain
            </button>
          </div>
        </div>

        {/* Add Domain Modal */}
        {showAddDomain && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Domain</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
                  <input
                    type="text"
                    value={newDomain.name}
                    onChange={(e) => setNewDomain({...newDomain, name: e.target.value})}
                    placeholder="example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Provider</label>
                  <select
                    value={newDomain.emailProvider}
                    onChange={(e) => setNewDomain({...newDomain, emailProvider: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(emailProviders).map(([key, provider]) => (
                      <option key={key} value={key}>{provider.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddDomain(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDomain}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Domain
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Domains Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedDomain(domain)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{domain.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      domain.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {domain.status}
                    </span>
                    {domain.verified ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <X size={16} className="text-red-500" />
                    )}
                  </div>
                </div>
                <div className={`w-10 h-10 ${emailProviders[domain.emailProvider].color} rounded-lg flex items-center justify-center text-white`}>
                  {emailProviders[domain.emailProvider].icon}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Email Provider:</span>
                  <span className="font-medium">{emailProviders[domain.emailProvider].name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email Accounts:</span>
                  <span className="font-medium">{domain.emailAccounts}/{domain.maxEmails}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expires:</span>
                  <span className="font-medium">{new Date(domain.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>SSL:</span>
                  <span className={`font-medium ${domain.sslEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {domain.sslEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Domain Details Panel */}
        {selectedDomain && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <div className="flex justify-between items-center p-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDomain.name}</h2>
                  <p className="text-gray-600">{emailProviders[selectedDomain.emailProvider].name}</p>
                </div>
                <button
                  onClick={() => setSelectedDomain(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="px-6">
                <nav className="flex space-x-8">
                  {['overview', 'email-settings', 'dns-records'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Domain Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Verification Status:</span>
                        <span className={`font-medium ${selectedDomain.verified ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedDomain.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">SSL Certificate:</span>
                        <span className={`font-medium ${selectedDomain.sslEnabled ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedDomain.sslEnabled ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expiry Date:</span>
                        <span className="font-medium">{new Date(selectedDomain.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Email Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Accounts:</span>
                        <span className="font-medium">{selectedDomain.emailAccounts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Accounts:</span>
                        <span className="font-medium">{selectedDomain.maxEmails}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Provider:</span>
                        <span className="font-medium">{emailProviders[selectedDomain.emailProvider].name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'email-settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Server Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Mail size={18} />
                          Incoming Mail (IMAP)
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Server:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{emailProviders[selectedDomain.emailProvider].settings.incoming.server}</span>
                              <button
                                onClick={() => copyToClipboard(emailProviders[selectedDomain.emailProvider].settings.incoming.server)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Port:</span>
                            <span className="font-mono">{emailProviders[selectedDomain.emailProvider].settings.incoming.port}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">SSL/TLS:</span>
                            <span className="font-medium text-green-600">Enabled</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Settings size={18} />
                          Outgoing Mail (SMTP)
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Server:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{emailProviders[selectedDomain.emailProvider].settings.outgoing.server}</span>
                              <button
                                onClick={() => copyToClipboard(emailProviders[selectedDomain.emailProvider].settings.outgoing.server)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Port:</span>
                            <span className="font-mono">{emailProviders[selectedDomain.emailProvider].settings.outgoing.port}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">SSL/TLS:</span>
                            <span className="font-medium text-green-600">Enabled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Account Settings</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Setup Instructions</h4>
                          <p className="text-blue-800 text-sm mt-1">
                            Use these settings to configure your email client. Username should be your full email address (e.g., own@{selectedDomain.name})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dns-records' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Required DNS Records</h3>
                    <p className="text-gray-600 mb-4">
                      Add these DNS records to your domain registrar to enable email functionality:
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Value</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Priority</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getDNSRecords(selectedDomain).map((record, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2 font-mono text-sm">{record.type}</td>
                            <td className="border border-gray-200 px-4 py-2 font-mono text-sm">{record.name}</td>
                            <td className="border border-gray-200 px-4 py-2 font-mono text-sm">{record.value}</td>
                            <td className="border border-gray-200 px-4 py-2 font-mono text-sm">{record.priority}</td>
                            <td className="border border-gray-200 px-4 py-2">
                              <button
                                onClick={() => copyToClipboard(record.value)}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                              >
                                <Copy size={14} />
                                Copy
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Important Note</h4>
                        <p className="text-yellow-800 text-sm mt-1">
                          DNS changes can take up to 24-48 hours to propagate. After adding these records, 
                          verification may take some time to complete.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DomainsPage;