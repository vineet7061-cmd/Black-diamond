'use client'

import Navigation from '@/components/Navigation'
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Calendar, DollarSign } from 'lucide-react'

interface DashboardMetric {
  label: string
  value: string | number
  change?: number
  icon: any
  color: string
}

export default function AnalyticsPage() {
  // Consolidated data from all departments
  const totalVehicles = 3
  const vehiclesInWarning = 1
  const vehiclesCritical = 1
  
  const totalWeighmentRecords = 15
  const totalMaterialsHandled = 4200
  
  const totalChallans = 8
  const deliveredChallans = 5
  const explosivesDelivered = 1750
  
  const totalBlasts = 12
  const approvedReports = 10
  const averageVibration = 8.4
  
  const totalInvoiced = 850000
  const totalPaid = 675000
  const pendingPayment = 175000
  
  const metrics: DashboardMetric[] = [
    {
      label: 'Active Vehicles',
      value: totalVehicles,
      icon: TrendingUp,
      color: 'text-blue-700',
      change: 0,
    },
    {
      label: 'Vehicles Requiring Attention',
      value: vehiclesInWarning + vehiclesCritical,
      icon: AlertTriangle,
      color: 'text-red-700',
    },
    {
      label: 'Total Weighments',
      value: totalWeighmentRecords,
      icon: BarChart3,
      color: 'text-emerald-700',
    },
    {
      label: 'Materials Handled (kg)',
      value: totalMaterialsHandled.toLocaleString(),
      icon: TrendingUp,
      color: 'text-accent',
    },
    {
      label: 'Deliveries Completed',
      value: deliveredChallans,
      icon: CheckCircle,
      color: 'text-emerald-700',
    },
    {
      label: 'Total Explosives Delivered (kg)',
      value: explosivesDelivered.toLocaleString(),
      icon: TrendingUp,
      color: 'text-amber-700',
    },
    {
      label: 'Blast Operations',
      value: totalBlasts,
      icon: BarChart3,
      color: 'text-blue-700',
    },
    {
      label: 'Approved Reports',
      value: approvedReports,
      icon: CheckCircle,
      color: 'text-emerald-700',
    },
    {
      label: 'Total Billed',
      value: `₹${(totalInvoiced / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: 'text-accent',
    },
    {
      label: 'Total Paid',
      value: `₹${(totalPaid / 100000).toFixed(1)}L`,
      icon: CheckCircle,
      color: 'text-emerald-700',
    },
    {
      label: 'Pending Payment',
      value: `₹${(pendingPayment / 100000).toFixed(1)}L`,
      icon: AlertTriangle,
      color: 'text-amber-700',
    },
    {
      label: 'Collection Rate',
      value: `${((totalPaid / totalInvoiced) * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-emerald-700',
    },
  ]

  // Historical data for blast logs
  const blastLogs = [
    { date: '2024-12-10', location: 'Delhi Site', type: 'Production', explosives: 500, vibration: 8.5 },
    { date: '2024-12-08', location: 'Mumbai Site', type: 'Production', explosives: 1200, vibration: 9.2 },
    { date: '2024-12-05', location: 'Bangalore Site', type: 'Test', explosives: 250, vibration: 7.1 },
    { date: '2024-12-02', location: 'Delhi Site', type: 'Controlled', explosives: 400, vibration: 8.0 },
    { date: '2024-11-30', location: 'Mumbai Site', type: 'Production', explosives: 950, vibration: 9.1 },
  ]

  // Department breakdown
  const departments = [
    {
      name: 'Fleet Fitness',
      status: 'Active',
      records: totalVehicles,
      color: 'text-blue-700',
    },
    {
      name: 'Materials Logistics',
      status: 'Active',
      records: totalWeighmentRecords,
      color: 'text-emerald-700',
    },
    {
      name: 'Delivery & Challan',
      status: 'Active',
      records: totalChallans,
      color: 'text-purple-400',
    },
    {
      name: 'Blast Operations',
      status: 'Active',
      records: totalBlasts,
      color: 'text-amber-700',
    },
    {
      name: 'Billing & Invoicing',
      status: 'Active',
      records: 8,
      color: 'text-blue-600',
    },
  ]

  const invoices = [
    { number: 'INV-2024-001', amount: 75000, status: 'paid' },
    { number: 'INV-2024-002', amount: 35000, status: 'issued' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-4 md:pt-6 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Master Dashboard</h1>
          <p className="text-gray-600">Consolidated cross-departmental logistics and fleet management analytics</p>
        </div>

        {/* Date Filter */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <input
              type="date"
              className="bg-transparent text-gray-900 text-sm font-semibold outline-none"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-600/80 text-white font-semibold rounded-lg transition-colors">
            Export Report
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, i) => {
            const Icon = metric.icon
            return (
              <div key={i} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:border-accent/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-600 line-clamp-1">{metric.label}</p>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
                <p className={`text-xl md:text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                {metric.change !== undefined && (
                  <p className={`text-xs mt-1 ${metric.change >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}% vs last period
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Blast Operations Log */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Recent Blast Operations
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {blastLogs.map((log, i) => (
                <div key={i} className="p-3 bg-gray-100/10 rounded-lg border border-gray-200 hover:border-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-gray-900">{log.location}</p>
                    <span className="text-xs font-semibold text-accent">{log.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{log.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Explosives</p>
                      <p className="font-semibold text-gray-900">{log.explosives} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Vibration</p>
                      <p className={`font-semibold ${log.vibration > 9 ? 'text-red-700' : log.vibration > 8 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {log.vibration} mm/s
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Summary */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              Billing & Revenue Summary
            </h2>
            
            {/* Payment breakdown */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Billed</span>
                  <span className="text-lg font-bold text-gray-900">₹{(totalInvoiced / 100000).toFixed(1)}L</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="text-lg font-bold text-emerald-700">₹{(totalPaid / 100000).toFixed(1)}L</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${(totalPaid / totalInvoiced) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-lg font-bold text-amber-700">₹{(pendingPayment / 100000).toFixed(1)}L</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${(pendingPayment / totalInvoiced) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Recent invoices */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-bold text-gray-900 mb-3">Recent Invoices</p>
              <div className="space-y-2">
                {invoices.map((inv, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-900 font-semibold">{inv.number}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-accent font-bold">₹{inv.amount.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        inv.status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {inv.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Department Status */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Department Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {departments.map((dept, i) => (
              <div key={i} className="p-4 bg-gray-100/10 rounded-lg border border-gray-200 hover:border-accent/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">{dept.name}</h3>
                  <CheckCircle className={`w-4 h-4 ${dept.color}`} />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p className={`text-sm font-semibold ${dept.color}`}>{dept.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Records</p>
                    <p className="text-lg font-bold text-gray-900">{dept.records}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Last Updated: {new Date().toLocaleString()}</p>
          <p className="mt-2">Fleet Logistics Management System • Real-time Dashboard</p>
        </div>
      </main>
    </div>
  )
}
