'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Plus, Link2, FileText, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Invoice {
  id: string
  number: string
  date: string
  amount: number
  ecciNumber: string
  grnNumber?: string
  status: 'draft' | 'issued' | 'paid'
  dueDate: string
}

interface ECCI {
  id: string
  number: string
  date: string
  amount: number
  invoiceId?: string
  grnNumber?: string
  description: string
}

const mockECCIs: ECCI[] = [
  {
    id: '1',
    number: 'ECCI-2024-001',
    date: '2024-12-01',
    amount: 50000,
    description: 'Explosives supply - Type A',
    grnNumber: 'GRN-2024-001',
  },
  {
    id: '2',
    number: 'ECCI-2024-002',
    date: '2024-12-05',
    amount: 35000,
    description: 'Detonators and accessories',
  },
  {
    id: '3',
    number: 'ECCI-2024-003',
    date: '2024-12-08',
    amount: 75000,
    description: 'Large scale explosives shipment',
    invoiceId: '1',
  },
]

const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '2024-12-08',
    amount: 75000,
    ecciNumber: 'ECCI-2024-003',
    grnNumber: 'GRN-2024-003',
    status: 'paid',
    dueDate: '2024-12-15',
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '2024-12-05',
    amount: 35000,
    ecciNumber: 'ECCI-2024-002',
    status: 'issued',
    dueDate: '2024-12-20',
  },
]

function InvoiceForm({ ecciRecords, onSubmit }: { ecciRecords: ECCI[], onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    selectedECCI: '',
    grnNumber: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      selectedECCI: '',
      grnNumber: '',
    })
  }

  const selectedECCI = ecciRecords.find(e => e.id === formData.selectedECCI)

  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" />
        Link ECCI to Invoice
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invoice Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Invoice Number</label>
            <input
              type="text"
              placeholder="INV-2024-XXX"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Invoice Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* ECCI Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Link to ECCI</label>
            <select
              value={formData.selectedECCI}
              onChange={(e) => setFormData({ ...formData, selectedECCI: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select ECCI document</option>
              {ecciRecords.map(ecci => (
                <option key={ecci.id} value={ecci.id}>
                  {ecci.number} - {ecci.description}
                </option>
              ))}
            </select>
          </div>

          {/* GRN Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">GRN Number</label>
            <input
              type="text"
              placeholder="GRN-2024-XXX"
              value={formData.grnNumber}
              onChange={(e) => setFormData({ ...formData, grnNumber: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Amount Display */}
        {selectedECCI && (
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Invoice Amount</span>
              <span className="text-2xl font-bold text-blue-700">₹{selectedECCI.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1">
            Create Invoice
          </Button>
          <button
            type="button"
            className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function ECCICard({ ecci, linkedInvoice }: { ecci: ECCI, linkedInvoice?: Invoice }) {
  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{ecci.number}</h3>
          <p className="text-xs text-gray-600">{new Date(ecci.date).toLocaleDateString()}</p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200">
          ₹{ecci.amount.toLocaleString('en-IN')}
        </div>
      </div>

      <p className="text-sm text-gray-900 mb-4 flex-grow">{ecci.description}</p>

      {linkedInvoice ? (
        <div className="mb-4 p-3 bg-emerald-50 border-2 border-emerald-300 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-700" />
            <p className="text-xs font-semibold text-emerald-700">Linked to Invoice</p>
          </div>
          <p className="text-sm font-bold text-emerald-600">{linkedInvoice.number}</p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-300 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-700" />
            <p className="text-xs font-semibold text-amber-700">Awaiting Invoice</p>
          </div>
          <p className="text-xs text-amber-600">Link this ECCI to an invoice</p>
        </div>
      )}

      {ecci.grnNumber && (
        <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-semibold">GRN: {ecci.grnNumber}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-gray-200 mt-auto">
        <button className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
          <Link2 className="w-4 h-4" />
          Link
        </button>
        <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          View
        </button>
      </div>
    </div>
  )
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const statusConfig = {
    draft: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Draft' },
    issued: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Issued' },
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Paid' },
  }

  const config = statusConfig[invoice.status]

  return (
    <div className={`bg-gray-50 border-2 border-gray-200 rounded-xl p-6 flex flex-col`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{invoice.number}</h3>
          <p className={`text-xs font-semibold px-2 py-1 inline-block rounded-md mt-1 ${config.bg} ${config.text}`}>{config.label}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600">Amount</p>
          <p className="text-lg font-bold text-blue-700">₹{invoice.amount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6 text-sm flex-grow">
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-600">Invoice Date</span>
          <span className="font-semibold text-gray-900">{new Date(invoice.date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-600">Due Date</span>
          <span className="font-semibold text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-600">Linked ECCI</span>
          <span className="font-semibold text-blue-600">{invoice.ecciNumber}</span>
        </div>
        {invoice.grnNumber && (
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">GRN</span>
            <span className="font-semibold text-purple-700">{invoice.grnNumber}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 mt-auto">
        <button className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-semibold rounded-lg transition-colors">
          View
        </button>
        <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
          Download
        </button>
      </div>
    </div>
  )
}

export default function BillingPage() {
  const [ecciRecords, setEcciRecords] = useState(mockECCIs)
  const [invoices, setInvoices] = useState(mockInvoices)
  const [activeTab, setActiveTab] = useState<'ecci' | 'invoices'>('ecci')

  const handleCreateInvoice = (data: any) => {
    const newInvoice: Invoice = {
      id: String(invoices.length + 1),
      number: data.invoiceNumber,
      date: data.date,
      amount: ecciRecords.find(e => e.id === data.selectedECCI)?.amount || 0,
      ecciNumber: ecciRecords.find(e => e.id === data.selectedECCI)?.number || '',
      grnNumber: data.grnNumber,
      status: 'issued',
      dueDate: new Date(new Date(data.date).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
    setInvoices([newInvoice, ...invoices])
    
    // Update ECCI with linked invoice
    if (data.selectedECCI) {
      setEcciRecords(ecciRecords.map(ecci => 
        ecci.id === data.selectedECCI 
          ? { ...ecci, invoiceId: newInvoice.id, grnNumber: data.grnNumber }
          : ecci
      ))
    }
  }

  const totalECCIAmount = ecciRecords.reduce((sum, e) => sum + e.amount, 0)
  const totalInvoiceAmount = invoices.reduce((sum, i) => sum + i.amount, 0)
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Procurement, Billing & Invoicing</h1>
          <p className="text-gray-600">Manage ECCI documents, link invoices, and track GRN payments</p>
        </div>

        {/* Form */}
        <InvoiceForm ecciRecords={ecciRecords} onSubmit={handleCreateInvoice} />

        {/* Stats - Maintained strictly as 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-600 mb-1 font-medium">Total ECCI Amount</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalECCIAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
            <p className="text-sm text-blue-600 mb-1 font-medium">Total Invoiced</p>
            <p className="text-2xl font-bold text-blue-700">₹{totalInvoiceAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-5">
            <p className="text-sm text-emerald-600 mb-1 font-medium">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-700">₹{paidAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-5">
            <p className="text-sm text-amber-600 mb-1 font-medium">Pending</p>
            <p className="text-2xl font-bold text-amber-700">₹{(totalInvoiceAmount - paidAmount).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('ecci')}
            className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 ${
              activeTab === 'ecci'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            ECCI Documents ({ecciRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 ${
              activeTab === 'invoices'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Invoices ({invoices.length})
          </button>
        </div>

        {/* ECCI View - 2x2 Grid */}
        {activeTab === 'ecci' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ecciRecords.map(ecci => {
              const linkedInvoice = invoices.find(inv => inv.ecciNumber === ecci.number)
              return <ECCICard key={ecci.id} ecci={ecci} linkedInvoice={linkedInvoice} />
            })}
          </div>
        )}

        {/* Invoices View - 2x2 Grid */}
        {activeTab === 'invoices' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invoices.map(invoice => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}