'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Trash2, User, Phone, MapPin, ChevronRight, X, Download, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface CustomDoc {
  name: string
  url: string
}

interface ManpowerRecord {
  id: string
  name: string
  photo: string
  zone: string
  category: string
  subcategory: string
  safetyPassNo: string
  safetyPassExp: string
  gatePassNo: string
  gatePassExp: string
  phone: string
  trainingCard: string
  medical: string
  drivingLicense: string
  formA: string
  formB: string
  nominationPaper: string
  extraDocs: CustomDoc[]
}

const ZONES = ['Q - AB', 'Q - SEB']
const CATEGORIES = ['Engineer', 'Driver', 'Labour']
const DRIVER_SUBCATS = ['LMV Driver', 'BMD Driver']

export default function ManpowerPage() {
  const [records, setRecords] = useState<ManpowerRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<ManpowerRecord | null>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedZone, setSelectedZone] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSub, setSelectedSub] = useState('')

  const fetchRecords = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from('manpower').select('*')
    if (!error && data) setRecords(data)
    setIsLoading(false)
  }

  useEffect(() => { fetchRecords() }, [])

  const deleteRecord = async (id: string) => {
    if(confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => prev.filter(r => r.id !== id))
      setSelectedRecord(null)
      await supabase.from('manpower').delete().eq('id', id)
    }
  }

  let currentList = records.filter(r => r.zone === selectedZone)
  if (currentStep > 2) currentList = currentList.filter(r => r.category === selectedCategory)
  if (currentStep > 3) currentList = currentList.filter(r => r.subcategory === selectedSub)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-1">Manpower Directory</h1>
            
            <div className="flex flex-wrap items-center text-sm font-bold text-gray-500 mt-2 gap-1">
              <button onClick={() => setCurrentStep(1)} className={`hover:text-blue-600 ${currentStep === 1 ? 'text-blue-600' : ''}`}>All Zones</button>
              {currentStep > 1 && <><ChevronRight className="w-4 h-4"/> <button onClick={() => setCurrentStep(2)} className={`hover:text-blue-600 ${currentStep === 2 ? 'text-blue-600' : ''}`}>{selectedZone}</button></>}
              {currentStep > 2 && <><ChevronRight className="w-4 h-4"/> <button onClick={() => { if(selectedCategory==='Driver') setCurrentStep(3); else setCurrentStep(4) }} className={`hover:text-blue-600 ${currentStep === 3 ? 'text-blue-600' : ''}`}>{selectedCategory}</button></>}
              {currentStep > 3 && selectedCategory === 'Driver' && <><ChevronRight className="w-4 h-4"/> <span className="text-blue-600">{selectedSub}</span></>}
            </div>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ZONES.map(zone => (
              <div key={zone} onClick={() => { setSelectedZone(zone); setCurrentStep(2); }} className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><MapPin className="w-8 h-8"/></div>
                <h3 className="text-xl font-black text-gray-900">{zone}</h3>
              </div>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map(cat => (
              <div key={cat} onClick={() => { 
                setSelectedCategory(cat); 
                if(cat === 'Driver') setCurrentStep(3); else setCurrentStep(4);
              }} className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{cat}</h3>
                  <p className="text-sm font-semibold text-gray-500 mt-1">{records.filter(r => r.zone === selectedZone && r.category === cat).length} Workers</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-300" />
              </div>
            ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DRIVER_SUBCATS.map(sub => (
              <div key={sub} onClick={() => { setSelectedSub(sub); setCurrentStep(4); }} className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">{sub}</h3>
                <ChevronRight className="w-6 h-6 text-gray-300" />
              </div>
            ))}
          </div>
        )}

        {currentStep === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentList.map(worker => (
              <div key={worker.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex gap-4">
                
                <div className="w-24 h-32 md:w-32 md:h-40 bg-gray-100 rounded-xl border-2 border-gray-200 shrink-0 overflow-hidden flex items-center justify-center relative">
                  {worker.photo ? <img src={worker.photo} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-gray-400" />}
                </div>

                <div className="flex flex-col justify-between w-full relative">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">{worker.name}</h3>
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-bold text-gray-500 flex justify-between items-center bg-gray-50 p-1.5 rounded">
                        <span>Safety Pass: <span className="text-gray-900">{worker.safetyPassNo || 'N/A'}</span></span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${worker.safetyPassExp && new Date(worker.safetyPassExp) < new Date() ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>Exp: {worker.safetyPassExp || 'N/A'}</span>
                      </p>
                      <p className="text-xs font-bold text-gray-500 flex justify-between items-center bg-gray-50 p-1.5 rounded">
                        <span>Gatepass: <span className="text-gray-900">{worker.gatePassNo || 'N/A'}</span></span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${worker.gatePassExp && new Date(worker.gatePassExp) < new Date() ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>Exp: {worker.gatePassExp || 'N/A'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <a href={`tel:${worker.phone}`} className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors">
                      <Phone className="w-4 h-4" /> {worker.phone}
                    </a>
                    <button onClick={() => setSelectedRecord(worker)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center py-2 rounded-lg font-bold text-sm shadow-sm transition-colors">
                      View Docs
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {currentList.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-lg font-bold text-gray-500">No manpower found in this category.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* DOCUMENT MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col relative overflow-hidden">
            <div className="bg-blue-600 p-5 text-white flex justify-between items-start shrink-0">
              <div className="flex gap-4 items-center">
                <img src={selectedRecord.photo || ''} className="w-14 h-14 rounded-full border-2 border-white/30 object-cover bg-blue-500" alt="" />
                <div>
                  <h2 className="text-xl font-black leading-tight">{selectedRecord.name}</h2>
                  <p className="text-blue-100 text-sm font-semibold">{selectedRecord.category} {selectedRecord.subcategory ? `(${selectedRecord.subcategory})` : ''}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => deleteRecord(selectedRecord.id)} className="p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-sm"><Trash2 className="w-4 h-4"/></button>
                <button onClick={() => setSelectedRecord(null)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-grow bg-gray-50 space-y-3">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Worker Documents</h3>
              
              {[
                { name: 'Training Card', url: selectedRecord.trainingCard },
                { name: 'Medical Certificate', url: selectedRecord.medical },
                { name: 'Driving License', url: selectedRecord.drivingLicense },
                { name: 'Form A', url: selectedRecord.formA },
                { name: 'Form B', url: selectedRecord.formB },
                { name: 'Nomination Paper', url: selectedRecord.nominationPaper },
                ...(selectedRecord.extraDocs || [])
              ].map((doc, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500 font-semibold">{doc.url ? 'Document available' : 'Not uploaded'}</p>
                    </div>
                  </div>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-sm rounded-lg transition-colors border border-blue-100">
                      <Download className="w-4 h-4" /> Download
                    </a>
                  ) : (
                    <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 font-bold text-sm rounded-lg cursor-not-allowed">
                      Missing
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}