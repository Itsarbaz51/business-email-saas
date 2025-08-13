import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Trash2, RefreshCw, AlertTriangle, Info, CheckCircle, XCircle, Calendar, Clock, User } from 'lucide-react';

function SystemLogsPage() {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '2025-07-19T10:30:45.123Z',
      level: 'info',
      category: 'email',
      user: 'admin@primewebdev.in',
      message: 'Email sent successfully to user@example.com',
      details: { emailId: 'msg_12345', recipient: 'user@example.com', subject: 'Welcome to PrimeWebDev' }
    },
    {
      id: 2,
      timestamp: '2025-07-19T10:28:32.456Z',
      level: 'warning',
      category: 'domain',
      user: 'system',
      message: 'Domain primewebdev.in SSL certificate expires in 30 days',
      details: { domain: 'primewebdev.in', expiryDate: '2025-08-19', daysLeft: 30 }
    },
    {
      id: 3,
      timestamp: '2025-07-19T10:25:18.789Z',
      level: 'error',
      category: 'authentication',
      user: 'failed_user@example.com',
      message: 'Failed login attempt from IP 192.168.1.100',
      details: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0 Chrome/91.0', attempts: 3 }
    },
    {
      id: 4,
      timestamp: '2025-07-19T10:20:05.234Z',
      level: 'success',
      category: 'domain',
      user: 'admin@primewebdev.in',
      message: 'New domain example.com added successfully',
      details: { domain: 'example.com', provider: 'primemail', status: 'pending' }
    },
    {
      id: 5,
      timestamp: '2025-07-19T10:15:42.567Z',
      level: 'info',
      category: 'system',
      user: 'system',
      message: 'System backup completed successfully',
      details: { backupSize: '2.4GB', duration: '45min', location: '/backups/backup_20250719.tar.gz' }
    },
    {
      id: 6,
      timestamp: '2025-07-19T10:10:15.890Z',
      level: 'warning',
      category: 'email',
      user: 'system',
      message: 'SMTP connection timeout, retrying...',
      details: { server: 'smtp.primewebdev.in', port: 587, timeout: '30s' }
    }
  ]);

  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);

  const logLevels = {
    info: { color: 'bg-blue-100 text-blue-800', icon: <Info size={16} /> },
    success: { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} /> },
    warning: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle size={16} /> },
    error: { color: 'bg-red-100 text-red-800', icon: <XCircle size={16} /> }
  };

  const categories = ['all', 'email', 'domain', 'authentication', 'system'];
  const levels = ['all', 'info', 'success', 'warning', 'error'];

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(log => log.category === selectedCategory);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedLevel, selectedCategory]);

  useEffect(() => {
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        // Simulate new logs
        const newLog = {
          id: logs.length + Math.random(),
          timestamp: new Date().toISOString(),
          level: ['info', 'warning', 'error', 'success'][Math.floor(Math.random() * 4)],
          category: ['email', 'domain', 'authentication', 'system'][Math.floor(Math.random() * 4)],
          user: 'system',
          message: 'Auto-generated log entry for demo',
          details: { automated: true }
        };
        setLogs(prev => [newLog, ...prev]);
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isAutoRefresh, logs.length]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `system_logs_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setLogs([]);
      setSelectedLog(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
              <p className="text-gray-600 mt-1">Monitor system activities and troubleshoot issues</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isAutoRefresh 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                <RefreshCw size={20} className={isAutoRefresh ? 'animate-spin' : ''} />
                {isAutoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
              </button>
              <button
                onClick={exportLogs}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Download size={20} />
                Export
              </button>
              <button
                onClick={clearLogs}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Trash2 size={20} />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      Timestamp
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      User
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Info size={48} className="text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No logs found</p>
                        <p className="text-sm">Try adjusting your search filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const timestamp = formatTimestamp(log.timestamp);
                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{timestamp.date}</div>
                            <div className="text-gray-500">{timestamp.time}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${logLevels[log.level].color}`}>
                            {logLevels[log.level].icon}
                            {log.level.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {log.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate">{log.message}</div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Log Details</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <p className="text-sm text-gray-900 mt-1">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${logLevels[selectedLog.level].color} mt-1`}>
                      {logLevels[selectedLog.level].icon}
                      {selectedLog.level.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">{selectedLog.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLog.user}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-md">{selectedLog.message}</p>
                </div>

                {selectedLog.details && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Additional Details</label>
                    <pre className="text-xs text-gray-900 mt-1 bg-gray-50 p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemLogsPage;