import React, { useState } from 'react';
import { Search, Database, Shield, Zap, Globe, Mail, Server, Download, Upload, RefreshCw, Play, Pause, Settings, AlertCircle, CheckCircle } from 'lucide-react';

function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [runningTasks, setRunningTasks] = useState({});

  const tools = [
    {
      id: 1,
      name: 'DNS Propagation Checker',
      description: 'Check DNS propagation status across global servers',
      category: 'network',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      action: 'Check DNS'
    },
    {
      id: 2,
      name: 'SSL Certificate Validator',
      description: 'Validate SSL certificates and check expiry dates',
      category: 'security',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      action: 'Validate SSL'
    },
    {
      id: 3,
      name: 'Email Deliverability Test',
      description: 'Test email delivery and spam score analysis',
      category: 'email',
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      action: 'Test Email'
    },
    {
      id: 4,
      name: 'Database Optimizer',
      description: 'Optimize database performance and clean up unused data',
      category: 'database',
      icon: <Database className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      action: 'Optimize DB'
    },
    {
      id: 5,
      name: 'Server Performance Monitor',
      description: 'Monitor server resources and performance metrics',
      category: 'server',
      icon: <Server className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-teal-500 to-blue-500',
      action: 'Monitor'
    },
    {
      id: 6,
      name: 'Cache Management',
      description: 'Clear and manage system caches for better performance',
      category: 'performance',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      action: 'Clear Cache'
    },
    {
      id: 7,
      name: 'Security Scanner',
      description: 'Scan for security vulnerabilities and malware',
      category: 'security',
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      action: 'Scan'
    },
    {
      id: 8,
      name: 'Backup Manager',
      description: 'Create and manage system backups',
      category: 'maintenance',
      icon: <Download className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      action: 'Backup'
    },
    {
      id: 9,
      name: 'Log Analyzer',
      description: 'Analyze system logs and generate reports',
      category: 'maintenance',
      icon: <Search className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-gray-500 to-slate-500',
      action: 'Analyze'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', count: tools.length },
    { id: 'network', name: 'Network', count: tools.filter(t => t.category === 'network').length },
    { id: 'security', name: 'Security', count: tools.filter(t => t.category === 'security').length },
    { id: 'email', name: 'Email', count: tools.filter(t => t.category === 'email').length },
    { id: 'database', name: 'Database', count: tools.filter(t => t.category === 'database').length },
    { id: 'server', name: 'Server', count: tools.filter(t => t.category === 'server').length },
    { id: 'performance', name: 'Performance', count: tools.filter(t => t.category === 'performance').length },
    { id: 'maintenance', name: 'Maintenance', count: tools.filter(t => t.category === 'maintenance').length }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const runTool = (toolId) => {
    setRunningTasks(prev => ({ ...prev, [toolId]: true }));
    
    // Simulate tool execution
    setTimeout(() => {
      setRunningTasks(prev => ({ ...prev, [toolId]: false }));
    }, 3000);
  };

  const [toolInputs, setToolInputs] = useState({
    dnsChecker: { domain: '' },
    sslValidator: { domain: '' },
    emailTest: { email: '', subject: 'Test Email' }
  });

  const [toolResults, setToolResults] = useState({});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Tools</h1>
              <p className="text-gray-600 mt-1">Powerful utilities for system management and troubleshooting</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tools..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center text-white`}>
                    {tool.icon}
                  </div>
                  <button
                    onClick={() => runTool(tool.id)}
                    disabled={runningTasks[tool.id]}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      runningTasks[tool.id]
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {runningTasks[tool.id] ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Running...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Play size={16} />
                        {tool.action}
                      </div>
                    )}
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                    {tool.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tools Panel */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Tools</h2>
            <p className="text-gray-600 mt-1">Common tools with direct input</p>
          </div>
          
          <div className="p-6 space-y-8">
            {/* DNS Checker */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
                  <Globe size={18} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">DNS Propagation Checker</h3>
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={toolInputs.dnsChecker.domain}
                  onChange={(e) => setToolInputs(prev => ({
                    ...prev,
                    dnsChecker: { domain: e.target.value }
                  }))}
                  placeholder="Enter domain name (e.g., example.com)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => runTool('dns-checker')}
                  disabled={!toolInputs.dnsChecker.domain || runningTasks['dns-checker']}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {runningTasks['dns-checker'] ? 'Checking...' : 'Check DNS'}
                </button>
              </div>
              
              {toolResults.dnsChecker && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-800 text-sm">DNS propagation complete across all servers</span>
                  </div>
                </div>
              )}
            </div>

            {/* SSL Validator */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <Shield size={18} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">SSL Certificate Validator</h3>
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={toolInputs.sslValidator.domain}
                  onChange={(e) => setToolInputs(prev => ({
                    ...prev,
                    sslValidator: { domain: e.target.value }
                  }))}
                  placeholder="Enter domain name (e.g., example.com)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => runTool('ssl-validator')}
                  disabled={!toolInputs.sslValidator.domain || runningTasks['ssl-validator']}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {runningTasks['ssl-validator'] ? 'Validating...' : 'Validate SSL'}
                </button>
              </div>
            </div>

            {/* Email Tester */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <Mail size={18} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Email Deliverability Test</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="email"
                  value={toolInputs.emailTest.email}
                  onChange={(e) => setToolInputs(prev => ({
                    ...prev,
                    emailTest: { ...prev.emailTest, email: e.target.value }
                  }))}
                  placeholder="Enter test email address"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={toolInputs.emailTest.subject}
                  onChange={(e) => setToolInputs(prev => ({
                    ...prev,
                    emailTest: { ...prev.emailTest, subject: e.target.value }
                  }))}
                  placeholder="Email subject"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={() => runTool('email-test')}
                disabled={!toolInputs.emailTest.email || runningTasks['email-test']}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {runningTasks['email-test'] ? 'Testing...' : 'Test Email Delivery'}
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <p className="text-sm text-gray-600">All Systems</p>
              <p className="font-semibold text-green-600">Operational</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Server size={24} className="text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Server Load</p>
              <p className="font-semibold text-blue-600">12%</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Database size={24} className="text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Database</p>
              <p className="font-semibold text-purple-600">Healthy</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap size={24} className="text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="font-semibold text-orange-600">145ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsPage;