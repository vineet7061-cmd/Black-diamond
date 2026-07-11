'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Plus, FileText, Upload, Image as ImageIcon, Trash2, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Challan {
  id: string
  number: string
  date: string
  explosiveType: string
  quantity: number
  deliveryLocation: string
  status: 'draft' | 'pending' | 'signed' | 'delivered'
  photoName?: string
  photoUrl?: string
}

const mockChallans: Challan[] = [
  {
    id: '1',
    number: 'CHL-2024-00001',
    date: '2024-12-10',
    explosiveType: 'Dynamite Type A',
    quantity: 500,
    deliveryLocation: 'Delhi Construction Site',
    status: 'delivered',
  },
  {
    id: '2',
    number: 'CHL-2024-00002',
    date: '2024-12-09',
    explosiveType: 'ANFO Mix',
    quantity: 1000,
    deliveryLocation: 'Mumbai Mining Site',
    status: 'signed',
  },
]

function ChallanForm({ onSubmit, onCancel }: { onSubmit: (data: any, file: File | null) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0],
    explosiveType: '',
    quantity: '',
    deliveryLocation: '',
    status: 'draft' as Challan['status']
  })
  const [slipFile, setSlipFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData, slipFile)
    
    // Reset Form
    setFormData({
      number: '',
      date: new Date().toISOString().split('T')[0],
      explosiveType: '',
      quantity: '',
      deliveryLocation: '',
      status: 'draft'
    })
    setSlipFile(null)
  }

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form strictly follows 2-column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Challan Number</label>
            <input
              type="text"
              placeholder="e.g. CHL-2024-XXXXX"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Explosive Type</label>
            <select
              value={formData.explosiveType}
              onChange={(e) => setFormData({ ...formData, explosiveType: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select explosive</option>
              <option value="Dynamite Type A">Dynamite Type A</option>
              <option value="ANFO Mix">ANFO Mix</option>
              <option value="RDX Explosive">RDX Explosive</option>
              <option value="Detonators">Detonators</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Quantity (Kgs)</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Delivery Location/Site</label>
            <input
              type="text"
              placeholder="Site name, address, etc."
              value={formData.deliveryLocation}
              onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Initial Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Challan['status'] })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending Signature</option>
              <option value="signed">Signed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Photo Upload (Working State) */}
        <div className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer mt-4 bg-gray-50 ${slipFile ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-blue-500'}`}>
          <input 
            type="file" 
            id="slip-upload" 
            className="hidden" 
            accept="image/*,.pdf"
            onChange={(e) => setSlipFile(e.target.files ? e.target.files[0] : null)}
          />
          <label htmlFor="slip-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            {slipFile ? (
              <>
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-700">{slipFile.name}</p>
                <p className="text-xs text-emerald-600 mt-1">Click to change document</p>
              </>
            ) : (
              <>
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Upload Challan Document</p>
                <p className="text-xs text-gray-500 mt-1">PDF or Image format</p>
              </>
            )}
          </label>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex-1"
          >
            Cancel
          </button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1">
            Create Challan
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function DeliveryPage() {
  const [challans, setChallans] = useState(mockChallans)
  const [filterStatus, setFilterStatus] = useState<'all' | Challan['status']>('all')
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedChallanId, setSelectedChallanId] = useState<string | null>(null)

  const handleNewChallan = (data: any, file: File | null) => {
    const newChallan: Challan = {
      id: Math.random().toString(36).substr(2, 9),
      number: data.number,
      date: data.date,
      explosiveType: data.explosiveType,
      quantity: parseFloat(data.quantity),
      deliveryLocation: data.deliveryLocation,
      status: data.status,
      photoName: file?.name,
      photoUrl: file ? URL.createObjectURL(file) : undefined
    }
    setChallans([newChallan, ...challans])
    setIsFormModalOpen(false)
  }

  const handleDeleteChallan = (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation()
    if(confirm("Are you sure you want to delete this challan?")) {
      setChallans(prev => prev.filter(c => c.id !== id))
      if (selectedChallanId === id) setSelectedChallanId(null)
    }
  }

  const handleUpdateStatus = (id: string, newStatus: Challan['status']) => {
    setChallans(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
  }

  const filteredChallans = filterStatus === 'all' 
    ? challans
    : challans.filter(c => c.status === filterStatus)
    
  const selectedChallan = challans.find(c => c.id === selectedChallanId)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28">
        {/* Header with Add Button */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Challan Record</h1>
            <p className="text-gray-600">Create, track, and manage delivery challans</p>
          </div>
          <Button 
            onClick={() => setIsFormModalOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-6 rounded-xl shadow-md w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Challan
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'draft', 'pending', 'signed', 'delivered'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Challans' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats - Strictly 2x2 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Challans</p>
            <p className="text-2xl font-bold text-gray-900">{challans.length}</p>
          </div>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
            <p className="text-sm font-medium text-amber-700 mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-700">{challans.filter(c => c.status === 'pending').length}</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <p className="text-sm font-medium text-blue-700 mb-1">Signed</p>
            <p className="text-2xl font-bold text-blue-700">{challans.filter(c => c.status === 'signed').length}</p>
          </div>
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
            <p className="text-sm font-medium text-emerald-700 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-emerald-700">{challans.filter(c => c.status === 'delivered').length}</p>
          </div>
        </div>

        {/* Challans Grid - Strictly 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredChallans.map((challan) => {
            const statusConfig = {
              draft: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-600', label: 'Draft' },
              pending: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', label: 'Pending Signature' },
              signed: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', label: 'Signed' },
              delivered: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', label: 'Delivered' },
            }
            const config = statusConfig[challan.status]

            return (
              <div 
                key={challan.id} 
                onClick={() => setSelectedChallanId(challan.id)}
                className={`rounded-xl border-2 ${config.border} bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative group flex flex-col`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{challan.number}</h3>
                    <p className={`text-xs font-bold ${config.text} px-2 py-1 rounded-md ${config.bg} inline-block mt-1`}>
                      {config.label}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4 flex-grow">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-semibold text-gray-900">{new Date(challan.date).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">Explosive</span>
                    <span className="text-sm font-semibold text-gray-900">{challan.explosiveType}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-600">Quantity</span>
                    <span className="text-sm font-bold text-blue-700">{challan.quantity.toLocaleString('en-IN')} Kgs</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm font-semibold text-gray-900 text-right">{challan.deliveryLocation}</span>
                  </div>
                </div>

                {challan.photoName && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                    <FileText className="w-4 h-4" /> Document Attached
                  </div>
                )}

                {/* Delete Button */}
                <button 
                  onClick={(e) => handleDeleteChallan(challan.id, e)}
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-100 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Challan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>

        {filteredChallans.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl mt-6">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-semibold text-lg text-gray-700">No challans found</p>
            <p className="text-sm text-gray-500 mt-1">Try changing filters or add a new entry.</p>
          </div>
        )}
      </main>

      {/* Add New Challan Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Create New Challan
              </h2>
              <button 
                onClick={() => setIsFormModalOpen(false)} 
                className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              <ChallanForm 
                onSubmit={handleNewChallan} 
                onCancel={() => setIsFormModalOpen(false)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Detail & Image View Modal */}
      {selectedChallan && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
            <button 
              onClick={() => setSelectedChallanId(null)} 
              className="absolute top-4 right-4 md:right-4 text-gray-600 hover:text-gray-900 bg-white shadow-sm hover:bg-gray-100 p-2 rounded-full z-10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Preview Section */}
            <div className="w-full md:w-1/2 bg-gray-100 border-r border-gray-200 min-h-[250px] md:min-h-[500px] flex items-center justify-center p-4">
              {selectedChallan.photoUrl ? (
                <img 
                  src={selectedChallan.photoUrl} 
                  alt="Challan Document" 
                  className="max-w-full max-h-[400px] md:max-h-[80vh] object-contain rounded-lg shadow-sm"
                />
              ) : selectedChallan.photoName ? (
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <ImageIcon className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-800 font-semibold mb-1">{selectedChallan.photoName}</p>
                  <p className="text-xs text-gray-500">Preview not available for mock data.</p>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No document uploaded</p>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 bg-white p-6 md:p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Challan Details</h2>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                  ${selectedChallan.status === 'draft' ? 'bg-slate-100 text-slate-700 border border-slate-300' : ''}
                  ${selectedChallan.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-300' : ''}
                  ${selectedChallan.status === 'signed' ? 'bg-blue-100 text-blue-700 border border-blue-300' : ''}
                  ${selectedChallan.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : ''}
                `}>
                  {selectedChallan.status}
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Challan No</p>
                    <p className="text-base font-bold text-gray-900">{selectedChallan.number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Date</p>
                    <p className="text-base font-bold text-gray-900">{new Date(selectedChallan.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Explosive Type</p>
                    <p className="text-base font-bold text-gray-900">{selectedChallan.explosiveType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Quantity</p>
                    <p className="text-base font-bold text-blue-700">{selectedChallan.quantity.toLocaleString('en-IN')} Kgs</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Delivery Location</p>
                  <p className="text-base font-bold text-gray-900">{selectedChallan.deliveryLocation}</p>
                </div>

                {/* Status Update Actions */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallan.status !== 'pending' && (
                      <Button onClick={() => handleUpdateStatus(selectedChallan.id, 'pending')} variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                        Mark Pending
                      </Button>
                    )}
                    {selectedChallan.status !== 'signed' && (
                      <Button onClick={() => handleUpdateStatus(selectedChallan.id, 'signed')} variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        Mark Signed
                      </Button>
                    )}
                    {selectedChallan.status !== 'delivered' && (
                      <Button onClick={() => handleUpdateStatus(selectedChallan.id, 'delivered')} variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteChallan(selectedChallan.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Challan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}