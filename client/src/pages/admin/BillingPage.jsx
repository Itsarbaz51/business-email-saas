import React, { useEffect, useState } from 'react'
import { CreditCard, Download, FileText, CheckCircle, DollarSign, Calendar, Plus, Edit3, Trash2, RefreshCw } from 'lucide-react'
import { getMySubscription } from '../../redux/slices/subscriptionSlice'
import { useDispatch, useSelector } from "react-redux"
import Footer from '../../components/Footer'

function BillingPage() {
  const dispatch = useDispatch()
  const { subscription: subscriptionData, loading } = useSelector(state => state.subscribe)

  const [subscription, setSubscription] = useState(null)
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    holderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  })

  // Sample data for demonstration
  const [invoices] = useState([
    { id: 'INV-001', date: '2023-10-15', description: 'Premium Plan', period: 'Oct 1 - Oct 31, 2023', amount: 29.99, status: 'paid' },
    { id: 'INV-002', date: '2023-11-15', description: 'Premium Plan', period: 'Nov 1 - Nov 30, 2023', amount: 29.99, status: 'paid' },
    { id: 'INV-003', date: '2023-12-15', description: 'Premium Plan', period: 'Dec 1 - Dec 31, 2023', amount: 29.99, status: 'overdue' }
  ])

  const [paymentMethods] = useState([
    { id: 1, type: 'visa', last4: '1234', holderName: 'John Doe', expiryMonth: '12', expiryYear: '2025', isDefault: true }
  ])

  useEffect(() => {
    dispatch(getMySubscription())
  }, [dispatch])

  useEffect(() => {
    if (subscriptionData) {
      const sub = subscriptionData
      setSubscription({
        plan: sub.plan,
        price: sub.plan === "BASIC" ? 10 : sub.plan === "PREMIUM" ? 29.99 : 0,
        billing: sub.billingCycle?.toLowerCase() || 'monthly',
        nextBilling: sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A',
        status: sub.isActive ? "active" : "inactive",
        features: [
          `${sub.maxMailboxes || 1} Mailboxes`,
          `${sub.maxDomains || 1} Domains`,
          `${sub.maxSentEmails || 100} Sent Emails`,
          `${sub.maxReceivedEmails || 1000} Received Emails`,
          `${(sub.allowedStorageMB ? sub.allowedStorageMB / 1024 : 1)} GB Storage`,
          `Payment via ${sub.paymentProvider || 'Stripe'}`
        ].filter(Boolean),
        autoRenew: true
      })
    }
  }, [subscriptionData])

  const getCardIcon = (type) => {
    return <CreditCard className="h-8 w-8 text-gray-500" />
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-3 w-3" />
      case 'overdue': return <FileText className="h-3 w-3" />
      default: return <FileText className="h-3 w-3" />
    }
  }

  const handleAddPaymentMethod = () => {
    // Implementation for adding payment method
    console.log('Adding payment method:', newPaymentMethod)
    setShowAddPaymentModal(false)
    setNewPaymentMethod({
      holderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    })
  }

  const handleSetDefaultPayment = (id) => {
    // Implementation for setting default payment
    console.log('Setting default payment method:', id)
  }

  const handleDeletePaymentMethod = (id) => {
    // Implementation for deleting payment method
    console.log('Deleting payment method:', id)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
        <span className="ml-2">Loading Subscription...</span>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="p-6 text-center text-gray-600">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow p-8">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No active subscription found</h2>
            <p className="text-gray-600 mb-6">You don't have an active subscription plan.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
              Subscribe Now
            </button>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Developed by Azzunique Software Pvt. Ltd. · © 2025
          </div>
        </div>
      </div>
    )
  }

  const totalDue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
  const nextPayment = subscription.nextBilling

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
                <p className="text-sm text-gray-600">Manage your subscription and billing information</p>
              </div>
            </div>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Renew</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        {/* Billing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="text-2xl font-bold text-gray-900">{subscription.plan}</p>
                <p className="text-sm text-gray-500">${subscription.price}/{subscription.billing}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Billing</p>
                <p className="text-2xl font-bold text-gray-900">{nextPayment}</p>
                <p className="text-sm text-gray-500">Auto-renew {subscription.autoRenew ? 'On' : 'Off'}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="text-2xl font-bold text-red-600">${totalDue.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{invoices.filter(inv => inv.status === 'overdue').length} overdue</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Subscription */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Current Subscription</h2>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{subscription.plan} Plan</h3>
                <p className="text-gray-600">${subscription.price} per {subscription.billing}</p>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {subscription.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Next billing date</p>
                <p className="text-lg font-semibold text-gray-900">{subscription.nextBilling}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Plan Features:</h4>
              <ul className="space-y-1">
                {subscription.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={subscription.autoRenew}
                  onChange={(e) => setSubscription({ ...subscription, autoRenew: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-600">Auto-renew subscription</label>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-blue-600 hover:text-blue-800">
                  Change Plan
                </button>
                <button className="px-4 py-2 text-red-600 hover:text-red-800">
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Billing History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{invoice.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.description}</div>
                      <div className="text-sm text-gray-500">{invoice.period}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1 capitalize">{invoice.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Download className="h-4 w-4" />
                        </button>
                        {invoice.status === 'overdue' && (
                          <button className="text-green-600 hover:text-green-900">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BillingPage