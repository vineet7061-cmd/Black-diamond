'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Plus, Upload, Calendar, Trash2, FileText, CheckCircle, X, Truck, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WeighmentRecord {
  id: string
  date: string
  challanNo: string
  customer: string
  truckNo: string
  material: string
  grossWeight: number
  tareWeight: number
  netWeight: number
  photoName?: string
  photoUrl?: string
}

// User data integrated directly from the provided Tata Steel West Bokaro slip
const mockRecords: WeighmentRecord[] = [
  {
    id: '1',
    date: '2026-07-11',
    challanNo: '87 (Card: 899)',
    customer: 'M/S BLACK DIAMOND',
    truckNo: 'JH10CS-0138',
    material: 'Explosive',
    grossWeight: 30940,
    tareWeight: 14720,
    netWeight: 16220,
    photoName: 'WhatsApp Image 2026-07-11 at 3.23.49 PM.jpeg'
  }
]

function WeighmentForm({ onSubmit, onCancel }: { onSubmit: (data: any, file: File | null) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    challanNo: '',
    truckNo: '',
    customer: 'M/S BLACK DIAMOND', // Default as per slip
    material: 'Explosive',
    grossWeight: '',
    tareWeight: '',
  })
  const [slipFile, setSlipFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData, slipFile)
    
    // Reset Form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      challanNo: '',
      truckNo: '',
      customer: 'M/S BLACK DIAMOND',
      material: 'Explosive',
      grossWeight: '',
      tareWeight: '',
    })
    setSlipFile(null)
  }

  const netWeight = formData.grossWeight && formData.tareWeight 
    ? parseFloat(formData.grossWeight) - parseFloat(formData.tareWeight)
    : 0

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form strictly follows 2-column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Challan / Card No</label>
            <input
              type="text"
              placeholder="e.g. 87 or 899"
              value={formData.challanNo}
              onChange={(e) => setFormData({ ...formData, challanNo: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Truck No.</label>
            <input
              type="text"
              placeholder="e.g. JH10CS-0138"
              value={formData.truckNo}
              onChange={(e) => setFormData({ ...formData, truckNo: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Customer</label>
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Material Type</label>
            <select
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="Explosive">Explosive</option>
              <option value="Detonators">Detonators</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="hidden md:block"></div> 

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Gross Weight (Kgs)</label>
            <input
              type="number"
              placeholder="e.g. 30940"
              value={formData.grossWeight}
              onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Tare Weight (Kgs)</label>
            <input
              type="number"
              placeholder="e.g. 14720"
              value={formData.tareWeight}
              onChange={(e) => setFormData({ ...formData, tareWeight: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
        </div>

        {netWeight > 0 && (
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Final Qty (Net Weight)</span>
              <span className="text-xl font-bold text-blue-700">{netWeight.toLocaleString('en-IN')} Kgs</span>
            </div>
          </div>
        )}

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
                <p className="text-xs text-emerald-600 mt-1">Click to change slip image</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Upload Tata Steel Slip Photo</p>
                <p className="text-xs text-gray-500 mt-1">Drag and drop or click to select</p>
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
            Save Entry
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function WeighmentPage() {
  const [records, setRecords] = useState(mockRecords)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  const handleNewEntry = (data: any, file: File | null) => {
    const newRecord: WeighmentRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: data.date,
      challanNo: data.challanNo,
      customer: data.customer,
      truckNo: data.truckNo,
      material: data.material,
      grossWeight: parseFloat(data.grossWeight),
      tareWeight: parseFloat(data.tareWeight),
      netWeight: parseFloat(data.grossWeight) - parseFloat(data.tareWeight),
      photoName: file?.name,
      photoUrl: file ? URL.createObjectURL(file) : undefined
    }
    setRecords([newRecord, ...records])
    setIsFormModalOpen(false)
  }

  const handleDeleteRecord = (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation() // Prevents the card click event from firing
    if(confirm("Are you sure you want to delete this weighment entry?")) {
      setRecords(prev => prev.filter(record => record.id !== id))
      if (selectedRecordId === id) setSelectedRecordId(null)
    }
  }

  const selectedRecord = records.find(r => r.id === selectedRecordId)

  // Group records by date
  const recordsByDate = records.reduce((acc, record) => {
    if (!acc[record.date]) acc[record.date] = []
    acc[record.date].push(record)
    return acc
  }, {} as Record<string, WeighmentRecord[]>)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28">
        {/* Header with Add Button */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Weighment Slips</h1>
            <p className="text-gray-600">Manage daily entries, final quantities and challans</p>
          </div>
          <Button 
            onClick={() => setIsFormModalOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-6 rounded-xl shadow-md w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Entry
          </Button>
        </div>

        {/* Grid View (Cards) - Fixed strictly as 2x2 Grid per date group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(recordsByDate).length > 0 ? (
            Object.entries(recordsByDate).map(([date, dateRecords]) => (
              <div key={date} className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">
                      {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                    {dateRecords.length} Entries
                  </span>
                </div>

                <div className="space-y-4">
                  {dateRecords.map((record) => (
                    <div 
                      key={record.id} 
                      onClick={() => setSelectedRecordId(record.id)}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="pr-8">
                        {/* Ch No & Truck */}
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase">Challan No</p>
                            <p className="text-base font-bold text-gray-900">{record.challanNo}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-500 uppercase">Truck No</p>
                            <p className="text-sm font-bold text-gray-900">{record.truckNo}</p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 mb-3">{record.customer} • {record.material}</p>
                        
                        {/* Final Qty Highlight */}
                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200">
                          <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                            {record.photoName ? <FileText className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-gray-400" />}
                            Final Qty
                          </span>
                          <span className="text-lg font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                            {record.netWeight.toLocaleString('en-IN')} Kgs
                          </span>
                        </div>
                      </div>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={(e) => handleDeleteRecord(record.id, e)}
                        className="absolute top-3 right-3 text-red-500 hover:bg-red-100 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
              <Truck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-semibold text-lg text-gray-700">No entries yet</p>
              <p className="text-sm mt-1">Click on "Add New Entry" to get started.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add New Entry Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Add New Weighment
              </h2>
              <button 
                onClick={() => setIsFormModalOpen(false)} 
                className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              <WeighmentForm 
                onSubmit={handleNewEntry} 
                onCancel={() => setIsFormModalOpen(false)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Detail & Image View Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative">
            <button 
              onClick={() => setSelectedRecordId(null)} 
              className="absolute top-4 right-4 md:right-4 text-gray-600 hover:text-gray-900 bg-white shadow-sm hover:bg-gray-100 p-2 rounded-full z-10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Preview Section */}
            <div className="w-full md:w-1/2 bg-gray-100 border-r border-gray-200 min-h-[250px] md:min-h-[500px] flex items-center justify-center p-4">
              {selectedRecord.photoUrl ? (
                <img 
                  src={selectedRecord.photoUrl} 
                  alt="Weighment Slip" 
                  className="max-w-full max-h-[400px] md:max-h-[80vh] object-contain rounded-lg shadow-sm"
                />
              ) : selectedRecord.photoName ? (
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <ImageIcon className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-800 font-semibold mb-1">{selectedRecord.photoName}</p>
                  <p className="text-xs text-gray-500">Preview not available for mock/default data.</p>
                  <p className="text-xs text-gray-500 mt-1">Upload a new entry to see real previews.</p>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No slip uploaded for this entry</p>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 bg-white p-6 md:p-8 overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Slip Details</h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Date</p>
                    <p className="text-base font-bold text-gray-900">{new Date(selectedRecord.date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Challan / Card No</p>
                    <p className="text-base font-bold text-gray-900">{selectedRecord.challanNo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Truck No</p>
                    <p className="text-base font-bold text-gray-900">{selectedRecord.truckNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Material</p>
                    <p className="text-base font-bold text-gray-900">{selectedRecord.material}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-base font-bold text-gray-900">{selectedRecord.customer}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Gross Weight</p>
                    <p className="text-lg font-bold text-gray-800">{selectedRecord.grossWeight.toLocaleString('en-IN')} Kgs</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Tare Weight</p>
                    <p className="text-lg font-bold text-gray-800">{selectedRecord.tareWeight.toLocaleString('en-IN')} Kgs</p>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-5 mt-4">
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Final Qty (Net Weight)</p>
                  <p className="text-3xl font-bold text-blue-700">{selectedRecord.netWeight.toLocaleString('en-IN')} <span className="text-lg">Kgs</span></p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteRecord(selectedRecord.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Entry
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