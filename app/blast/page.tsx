'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Plus, Trash2, Zap, MapPin, Calendar, Clock, X, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BlastRecord {
  id: string
  date: string
  face: string
  holesMain: number
  holesPilot: number
  benchHeight: number
  depthMain: number
  depthPilot: number
  burden: number
  spacing: number
  stemmingMain: number
  stemmingPilot: number
  cphMain: number
  cphPilot: number
  mcdMain: number
  mcdPilot: number
  explosiveQty: number
  volume: number
  pf: number
  cf: number
  ntd17: number
  ntd25: number
  ntd42: number
  ntdLead17: number
  ntdLead25: number
  ntdLead42: number
  sureBlast: number
  ikon: number
  initialDensity: number
  finalDensity: number
  booster: number
  dth10m: number
  dth6m: number
  vibration: number
  db: number
  location: string
  distance: number
  manPower: number
  blastingTime: string
}

// Default data based on your exact provided report
const mockBlastRecords: BlastRecord[] = [
  {
    id: '1',
    date: '2026-07-04',
    face: 'VII OB 2',
    holesMain: 85,
    holesPilot: 65,
    benchHeight: 10.5,
    depthMain: 10.8,
    depthPilot: 6.2,
    burden: 5.0,
    spacing: 6.0,
    stemmingMain: 4.3,
    stemmingPilot: 3.8,
    cphMain: 150,
    cphPilot: 55,
    mcdMain: 200,
    mcdPilot: 65,
    explosiveQty: 16280,
    volume: 27540,
    pf: 1.70,
    cf: 0.59,
    ntd17: 80,
    ntd25: 5,
    ntd42: 7,
    ntdLead17: 15,
    ntdLead25: 0,
    ntdLead42: 0,
    sureBlast: 1,
    ikon: 0,
    initialDensity: 1.31,
    finalDensity: 1.16,
    booster: 58.75,
    dth10m: 150,
    dth6m: 85,
    vibration: 11.69,
    db: 127.0,
    location: 'Near VII OB 2 Haul Road',
    distance: 120,
    manPower: 8,
    blastingTime: '02:55:18 PM'
  }
]

function BlastForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<BlastRecord>>({
    date: new Date().toISOString().split('T')[0],
    blastingTime: '', face: '', location: '',
    holesMain: 0, holesPilot: 0, benchHeight: 0,
    depthMain: 0, depthPilot: 0, burden: 0, spacing: 0,
    stemmingMain: 0, stemmingPilot: 0,
    cphMain: 0, cphPilot: 0, mcdMain: 0, mcdPilot: 0,
    explosiveQty: 0, volume: 0, pf: 0, cf: 0,
    ntd17: 0, ntd25: 0, ntd42: 0,
    ntdLead17: 0, ntdLead25: 0, ntdLead42: 0,
    sureBlast: 0, ikon: 0, booster: 0,
    initialDensity: 0, finalDensity: 0,
    dth10m: 0, dth6m: 0,
    vibration: 0, db: 0, distance: 0, manPower: 0
  })

  const handleInput = (field: keyof BlastRecord, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const InputField = ({ label, field, type = "number", step = "any", placeholder = "0" }: any) => (
    <div>
      <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        step={step}
        placeholder={placeholder}
        value={formData[field as keyof BlastRecord] || ''}
        onChange={(e) => handleInput(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
        required
      />
    </div>
  )

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Details */}
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-3 text-sm flex items-center gap-1"><MapPin className="w-4 h-4"/> Basic Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" field="date" type="date" />
            <InputField label="Blasting Time" field="blastingTime" type="time" />
            <InputField label="Face" field="face" type="text" placeholder="e.g. VII OB 2" />
            <InputField label="Exact Location" field="location" type="text" placeholder="e.g. Near Haul Road" />
          </div>
        </div>

        {/* Geometry & Holes */}
        <div className="p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Holes & Geometry</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <InputField label="No of Holes (Main)" field="holesMain" />
            <InputField label="No of Holes (Pilot)" field="holesPilot" />
            <InputField label="Avg Depth (Main) m" field="depthMain" />
            <InputField label="Avg Depth (Pilot) m" field="depthPilot" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <InputField label="Bench Height (m)" field="benchHeight" />
            <InputField label="Burden (m)" field="burden" />
            <InputField label="Spacing (m)" field="spacing" />
            <InputField label="Stemming (Main) m" field="stemmingMain" />
            <InputField label="Stemming (Pilot) m" field="stemmingPilot" />
          </div>
        </div>

        {/* Explosives & Charges */}
        <div className="p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Charge Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <InputField label="CPH (Main) Kg" field="cphMain" />
            <InputField label="CPH (Pilot) Kg" field="cphPilot" />
            <InputField label="MCD (Main) Kg" field="mcdMain" />
            <InputField label="MCD (Pilot) Kg" field="mcdPilot" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InputField label="Total Explosive (Kg)" field="explosiveQty" />
            <InputField label="Volume (Cum)" field="volume" />
            <InputField label="Pf (kg/cum)" field="pf" />
            <InputField label="Cf (cum/kg)" field="cf" />
          </div>
        </div>

        {/* Accessories */}
        <div className="p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Accessories & Delays</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <InputField label="17 ms NTD" field="ntd17" />
            <InputField label="25 ms NTD" field="ntd25" />
            <InputField label="42 ms NTD" field="ntd42" />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <InputField label="Lead 17 ms" field="ntdLead17" />
            <InputField label="Lead 25 ms" field="ntdLead25" />
            <InputField label="Lead 42 ms" field="ntdLead42" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <InputField label="SURE BLAST" field="sureBlast" />
            <InputField label="Ikon" field="ikon" />
            <InputField label="Booster (Kg)" field="booster" />
            <InputField label="DTH 10m" field="dth10m" />
            <InputField label="DTH 6m" field="dth6m" />
          </div>
        </div>

        {/* Environmental */}
        <div className="p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Environmental & Others</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <InputField label="Init Density (g/cc)" field="initialDensity" />
            <InputField label="Final Density (g/cc)" field="finalDensity" />
            <InputField label="Vibration (mm/s)" field="vibration" />
            <InputField label="DB Level" field="db" />
            <InputField label="Distance (m)" field="distance" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField label="Man Power" field="manPower" />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors flex-1">
            Cancel
          </button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1">
            Save Blast Report
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function BlastPage() {
  const [records, setRecords] = useState<BlastRecord[]>(mockBlastRecords)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  const handleNewEntry = (data: any) => {
    const newRecord: BlastRecord = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    }
    setRecords([newRecord, ...records])
    setIsFormModalOpen(false)
  }

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if(confirm("Are you sure you want to delete this blast report?")) {
      setRecords(prev => prev.filter(record => record.id !== id))
      if (selectedRecordId === id) setSelectedRecordId(null)
    }
  }

  // Exact formatting function for WhatsApp integration
  const shareToWhatsApp = (record: BlastRecord) => {
    const formattedDate = new Date(record.date).toLocaleDateString('en-IN') // Format: DD/MM/YYYY
    
    const message = `BDEPL 
Date - ${formattedDate} 
Face -  ${record.face}

No of Holes
Main - ${record.holesMain}
Pilot - ${record.holesPilot}
Bench height - ${record.benchHeight} m

Avg.Depth
Main - ${record.depthMain} m
Pilot - ${record.depthPilot} m

Burden -   ${record.burden} m
Spacing - ${record.spacing} m

Stemming
Main - ${record.stemmingMain} m
Pilot - ${record.stemmingPilot} m

CPH
Main - ${record.cphMain} Kg 
Pilot - ${record.cphPilot} Kg 

MCD
Main - ${record.mcdMain} Kg 
Pilot - ${record.mcdPilot} Kg 

Explosive - ${record.explosiveQty} Kg
Volume -  ${record.volume} Cum

Pf- ${record.pf} kg/cum
Cf- ${record.cf} cum/kg

17 ms NTD - ${record.ntd17}
25 ms NTD-  ${record.ntd25}
42 ms NTD-  ${record.ntd42}
NTD used for lead
17 ms NTD- ${record.ntdLead17}
25 ms NTD-  ${record.ntdLead25}
42 ms NTD-  ${record.ntdLead42}

SURE BLAST  -  ${record.sureBlast}
Ikon - ${record.ikon}

Initial density -${record.initialDensity} g/cc
Final density - ${record.finalDensity} g/cc

Booster- ${record.booster} kg

DTH 
10m - ${record.dth10m}
6m - ${record.dth6m}

Vibration -  ${record.vibration} mm/s
DB- ${record.db} 
Location -  ${record.location}
Distance - ${record.distance} m
Man power - ${record.manPower}
Blasting Time : ${record.blastingTime}`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const selectedRecord = records.find(r => r.id === selectedRecordId)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Blast Reports</h1>
            <p className="text-gray-600">Track drilling, explosives, and environmental metrics</p>
          </div>
          <Button 
            onClick={() => setIsFormModalOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-6 rounded-xl shadow-md w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Blast Report
          </Button>
        </div>

        {/* Stats Grid - 2x2 Strict */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
            <p className="text-sm font-medium text-orange-700 mb-1">Total Blasts</p>
            <p className="text-2xl font-bold text-orange-700">{records.length}</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <p className="text-sm font-medium text-blue-700 mb-1">Avg Explosive (Kg)</p>
            <p className="text-2xl font-bold text-blue-700">
              {records.length ? (records.reduce((acc, curr) => acc + curr.explosiveQty, 0) / records.length).toLocaleString('en-IN') : 0}
            </p>
          </div>
        </div>

        {/* Blast Cards Grid - STRICTLY Minimal Information on Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.length > 0 ? records.map((record) => (
            <div 
              key={record.id} 
              onClick={() => setSelectedRecordId(record.id)}
              className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative group flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-gray-900 text-sm">{new Date(record.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{record.blastingTime}</span>
                </div>
              </div>

              <div className="space-y-4 mb-2 flex-grow">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Location / Face</p>
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-500" /> {record.face} - {record.location}
                  </p>
                </div>
                
                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex items-center justify-between mt-auto">
                  <span className="text-sm font-bold text-orange-800 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Total Explosive
                  </span>
                  <span className="text-lg font-black text-orange-700">{record.explosiveQty.toLocaleString('en-IN')} Kg</span>
                </div>
              </div>

              <button 
                onClick={(e) => handleDeleteRecord(record.id, e)}
                className="absolute top-4 right-4 text-red-500 hover:bg-red-100 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-white/80"
                title="Delete Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
              <Zap className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-semibold text-lg text-gray-700">No blast reports</p>
              <p className="text-sm mt-1">Add a new report to see it here.</p>
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Enter Blast Report
              </h2>
              <button onClick={() => setIsFormModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <BlastForm onSubmit={handleNewEntry} onCancel={() => setIsFormModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Detail Modal with WhatsApp Share */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative">
            <div className="bg-blue-600 p-4 md:p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-bold mb-1">Blast Report: {selectedRecord.face}</h2>
                <p className="text-blue-100 text-sm font-medium flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(selectedRecord.date).toLocaleDateString('en-IN')}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {selectedRecord.blastingTime}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* WhatsApp Share Button Added Here */}
                <button 
                  onClick={() => shareToWhatsApp(selectedRecord)} 
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">Share Report</span>
                </button>
                <button onClick={() => setSelectedRecordId(null)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto flex-grow bg-gray-50 space-y-6">
              
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Holes & Parameters</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
                  <div><p className="text-xs text-gray-500">No of Holes (Main / Pilot)</p><p className="font-bold text-gray-900">{selectedRecord.holesMain} / {selectedRecord.holesPilot}</p></div>
                  <div><p className="text-xs text-gray-500">Avg Depth (Main / Pilot)</p><p className="font-bold text-gray-900">{selectedRecord.depthMain}m / {selectedRecord.depthPilot}m</p></div>
                  <div><p className="text-xs text-gray-500">Stemming (Main / Pilot)</p><p className="font-bold text-gray-900">{selectedRecord.stemmingMain}m / {selectedRecord.stemmingPilot}m</p></div>
                  <div><p className="text-xs text-gray-500">Bench Height</p><p className="font-bold text-gray-900">{selectedRecord.benchHeight} m</p></div>
                  <div><p className="text-xs text-gray-500">Burden</p><p className="font-bold text-gray-900">{selectedRecord.burden} m</p></div>
                  <div><p className="text-xs text-gray-500">Spacing</p><p className="font-bold text-gray-900">{selectedRecord.spacing} m</p></div>
                  <div><p className="text-xs text-gray-500">Volume</p><p className="font-bold text-blue-700">{selectedRecord.volume.toLocaleString('en-IN')} Cum</p></div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Explosives & Charge</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
                  <div><p className="text-xs text-gray-500">CPH (Main / Pilot)</p><p className="font-bold text-gray-900">{selectedRecord.cphMain} / {selectedRecord.cphPilot} Kg</p></div>
                  <div><p className="text-xs text-gray-500">MCD (Main / Pilot)</p><p className="font-bold text-gray-900">{selectedRecord.mcdMain} / {selectedRecord.mcdPilot} Kg</p></div>
                  <div><p className="text-xs text-gray-500">Powder Factor (Pf)</p><p className="font-bold text-emerald-600">{selectedRecord.pf} kg/cum</p></div>
                  <div><p className="text-xs text-gray-500">Charge Factor (Cf)</p><p className="font-bold text-emerald-600">{selectedRecord.cf} cum/kg</p></div>
                  <div className="col-span-2 md:col-span-4 bg-orange-50 border border-orange-100 p-3 rounded-lg">
                    <p className="text-xs text-orange-600 font-bold uppercase">Total Explosive</p>
                    <p className="text-2xl font-black text-orange-700">{selectedRecord.explosiveQty.toLocaleString('en-IN')} Kg</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Accessories & Environment</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-6">
                  <div><p className="text-xs text-gray-500">NTD (17ms/25ms/42ms)</p><p className="font-bold text-gray-900">{selectedRecord.ntd17} / {selectedRecord.ntd25} / {selectedRecord.ntd42}</p></div>
                  <div><p className="text-xs text-gray-500">NTD Lead (17/25/42)</p><p className="font-bold text-gray-900">{selectedRecord.ntdLead17} / {selectedRecord.ntdLead25} / {selectedRecord.ntdLead42}</p></div>
                  <div><p className="text-xs text-gray-500">SURE BLAST / Ikon</p><p className="font-bold text-gray-900">{selectedRecord.sureBlast} / {selectedRecord.ikon}</p></div>
                  <div><p className="text-xs text-gray-500">Booster</p><p className="font-bold text-gray-900">{selectedRecord.booster} Kg</p></div>
                  <div><p className="text-xs text-gray-500">Density (Init / Final)</p><p className="font-bold text-gray-900">{selectedRecord.initialDensity} / {selectedRecord.finalDensity}</p></div>
                  <div><p className="text-xs text-gray-500">DTH (10m / 6m)</p><p className="font-bold text-gray-900">{selectedRecord.dth10m} / {selectedRecord.dth6m}</p></div>
                  <div><p className="text-xs text-gray-500">Vibration</p><p className="font-bold text-red-600">{selectedRecord.vibration} mm/s</p></div>
                  <div><p className="text-xs text-gray-500">DB Level / Dist</p><p className="font-bold text-gray-900">{selectedRecord.db} / {selectedRecord.distance} m</p></div>
                  <div><p className="text-xs text-gray-500">Location</p><p className="font-bold text-gray-900">{selectedRecord.location}</p></div>
                  <div><p className="text-xs text-gray-500">Man Power</p><p className="font-bold text-gray-900">{selectedRecord.manPower}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}