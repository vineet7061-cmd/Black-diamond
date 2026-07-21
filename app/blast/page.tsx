'use client'

import { useState, useMemo, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Plus, Trash2, Zap, MapPin, Calendar, Clock, X, MessageCircle, Upload, Filter, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

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

const parseExcelDate = (rawDate: string) => {
  if (!rawDate) return new Date().toISOString().split('T')[0]
  const clean = rawDate.trim()
  const parts = clean.includes('/') ? clean.split('/') : clean.split('-')
  
  if (parts.length === 3) {
    if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
  }
  return clean
}

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
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-600"
        required
      />
    </div>
  )

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-3 text-sm flex items-center gap-1"><MapPin className="w-4 h-4"/> Basic Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" field="date" type="date" />
            <InputField label="Blasting Time" field="blastingTime" type="time" />
            <InputField label="Face" field="face" type="text" placeholder="e.g. VII OB 2" />
            <InputField label="Exact Location" field="location" type="text" placeholder="e.g. Near Haul Road" />
          </div>
        </div>

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

        <div className="p-4 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3 text-sm">Environmental & Others</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <InputField label="Init Density (g/cc)" field="initialDensity" />
            <InputField label="Final Density (g/cc)" field="finalDensity" />
            <InputField label="Vibration (mm/s)" field="vibration" />
            <InputField label="DB Level" field="db" />
            <InputField label="Distance (m)" field="distance" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <InputField label="Man Power" field="manPower" />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg flex-1">Cancel</button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1">Save Blast Report</Button>
        </div>
      </form>
    </div>
  )
}

export default function BlastPage() {
  const [records, setRecords] = useState<BlastRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [bulkText, setBulkText] = useState('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  const fetchRecords = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from('blast_reports').select('*').order('date', { ascending: false })
    if (!error && data) setRecords(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const availableMonths = useMemo(() => {
    const months = new Set(records.map(r => (r.date || '').substring(0, 7)).filter(m => m.length === 7))
    return Array.from(months).sort().reverse()
  }, [records])

  useEffect(() => {
    if (selectedMonth === '' && availableMonths.length > 0) setSelectedMonth(availableMonths[0])
  }, [availableMonths, selectedMonth])

  const filteredRecords = selectedMonth ? records.filter(r => (r.date || '').startsWith(selectedMonth)) : records

  const formatMonthYear = (yyyy_mm: string) => {
    if (!yyyy_mm) return ''
    const date = new Date(yyyy_mm + '-01')
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  const handleNewEntry = async (data: any) => {
    const newEntry = { ...data, date: parseExcelDate(data.date), id: Math.random().toString(36).substr(2, 9) }
    setRecords([newEntry, ...records])
    setIsFormModalOpen(false)
    await supabase.from('blast_reports').insert([newEntry])
  }

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return
    const rows = bulkText.trim().split('\n')
    const newEntries: BlastRecord[] = []

    rows.forEach(row => {
      const cols = row.split('\t')
      if (cols.length < 5) return
      newEntries.push({
        id: Math.random().toString(36).substr(2, 9),
        date: parseExcelDate(cols[0]),
        blastingTime: cols[1] || '00:00',
        face: cols[2] || '',
        location: cols[3] || '',
        holesMain: parseFloat(cols[4]) || 0,
        holesPilot: parseFloat(cols[5]) || 0,
        benchHeight: parseFloat(cols[6]) || 0,
        depthMain: parseFloat(cols[7]) || 0,
        depthPilot: parseFloat(cols[8]) || 0,
        burden: parseFloat(cols[9]) || 0,
        spacing: parseFloat(cols[10]) || 0,
        stemmingMain: parseFloat(cols[11]) || 0,
        stemmingPilot: parseFloat(cols[12]) || 0,
        cphMain: parseFloat(cols[13]) || 0,
        cphPilot: parseFloat(cols[14]) || 0,
        mcdMain: parseFloat(cols[15]) || 0,
        mcdPilot: parseFloat(cols[16]) || 0,
        explosiveQty: parseFloat(cols[17]) || 0,
        volume: parseFloat(cols[18]) || 0,
        pf: parseFloat(cols[19]) || 0,
        cf: parseFloat(cols[20]) || 0,
        ntd17: parseFloat(cols[21]) || 0,
        ntd25: parseFloat(cols[22]) || 0,
        ntd42: parseFloat(cols[23]) || 0,
        ntdLead17: parseFloat(cols[24]) || 0,
        ntdLead25: parseFloat(cols[25]) || 0,
        ntdLead42: parseFloat(cols[26]) || 0,
        sureBlast: parseFloat(cols[27]) || 0,
        ikon: parseFloat(cols[28]) || 0,
        booster: parseFloat(cols[29]) || 0,
        initialDensity: parseFloat(cols[30]) || 0,
        finalDensity: parseFloat(cols[31]) || 0,
        dth10m: parseFloat(cols[32]) || 0,
        dth6m: parseFloat(cols[33]) || 0,
        vibration: parseFloat(cols[34]) || 0,
        db: parseFloat(cols[35]) || 0,
        distance: parseFloat(cols[36]) || 0,
        manPower: parseFloat(cols[37]) || 0,
      })
    })

    if (newEntries.length > 0) {
      setRecords([...newEntries, ...records])
      setBulkText('')
      setIsBulkModalOpen(false)
      alert(`${newEntries.length} records imported!`)
      await supabase.from('blast_reports').insert(newEntries)
    }
  }

  const handleDeleteRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if(confirm("Are you sure you want to delete this blast report?")) {
      setRecords(prev => prev.filter(record => record.id !== id))
      if (selectedRecordId === id) setSelectedRecordId(null)
      await supabase.from('blast_reports').delete().eq('id', id)
    }
  }

  const shareToWhatsApp = (record: BlastRecord) => {
    const formattedDate = new Date(record.date).toLocaleDateString('en-IN') 
    const message = `BDEPL \nDate - ${formattedDate} \nFace -  ${record.face}\n\nNo of Holes\nMain - ${record.holesMain}\nPilot - ${record.holesPilot}\nBench height - ${record.benchHeight} m\n\nAvg.Depth\nMain - ${record.depthMain} m\nPilot - ${record.depthPilot} m\n\nBurden -   ${record.burden} m\nSpacing - ${record.spacing} m\n\nStemming\nMain - ${record.stemmingMain} m\nPilot - ${record.stemmingPilot} m\n\nCPH\nMain - ${record.cphMain} Kg \nPilot - ${record.cphPilot} Kg \n\nMCD\nMain - ${record.mcdMain} Kg \nPilot - ${record.mcdPilot} Kg \n\nExplosive - ${record.explosiveQty} Kg\nVolume -  ${record.volume} Cum\n\nPf- ${record.pf} kg/cum\nCf- ${record.cf} cum/kg\n\n17 ms NTD - ${record.ntd17}\n25 ms NTD-  ${record.ntd25}\n42 ms NTD-  ${record.ntd42}\nNTD used for lead\n17 ms NTD- ${record.ntdLead17}\n25 ms NTD-  ${record.ntdLead25}\n42 ms NTD-  ${record.ntdLead42}\n\nSURE BLAST  -  ${record.sureBlast}\nIkon - ${record.ikon}\n\nInitial density -${record.initialDensity} g/cc\nFinal density - ${record.finalDensity} g/cc\n\nBooster- ${record.booster} kg\n\nDTH \n10m - ${record.dth10m}\n6m - ${record.dth6m}\n\nVibration -  ${record.vibration} mm/s\nDB- ${record.db} \nLocation -  ${record.location}\nDistance - ${record.distance} m\nMan power - ${record.manPower}\nBlasting Time : ${record.blastingTime}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const selectedRecord = records.find(r => r.id === selectedRecordId)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Blast Reports</h1>
            <p className="text-gray-600">Track drilling, explosives, and environmental metrics</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl bg-white font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600"
              >
                {availableMonths.map(month => <option key={month} value={month}>{formatMonthYear(month)}</option>)}
                {availableMonths.length === 0 && <option value="">No Data</option>}
              </select>
            </div>
            <Button onClick={() => setIsBulkModalOpen(true)} variant="outline" className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold px-4 py-6 rounded-xl">
              <FileSpreadsheet className="w-5 h-5 mr-2" /> Bulk Paste
            </Button>
            <Button onClick={() => setIsFormModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-6 rounded-xl">
              <Plus className="w-5 h-5 mr-2" /> Add Report
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">Loading data...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 shadow-sm">
                <p className="text-sm font-bold text-orange-700 mb-1">Blasts in {formatMonthYear(selectedMonth)}</p>
                <p className="text-3xl font-black text-orange-700">{filteredRecords.length}</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
                <p className="text-sm font-bold text-blue-700 mb-1">Avg Explosive (Kg)</p>
                <p className="text-3xl font-black text-blue-700">
                  {filteredRecords.length ? Math.round(filteredRecords.reduce((acc, curr) => acc + curr.explosiveQty, 0) / filteredRecords.length).toLocaleString('en-IN') : 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecords.map((record) => (
                <div key={record.id} onClick={() => setSelectedRecordId(record.id)} className="bg-white border-2 border-gray-200 rounded-xl p-5 cursor-pointer hover:border-blue-400 relative group flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-gray-900 text-sm">{new Date(record.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-bold">{record.blastingTime}</span>
                    </div>
                  </div>
                  <div className="space-y-4 mb-2 flex-grow">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Location / Face</p>
                      <p className="text-lg font-black text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500" /> {record.face} - {record.location}</p>
                    </div>
                    <div className="bg-orange-50 border-2 border-orange-100 p-3 rounded-lg flex items-center justify-between mt-auto">
                      <span className="text-sm font-bold text-orange-800 flex items-center gap-1.5"><Zap className="w-4 h-4" /> Total Explosive</span>
                      <span className="text-xl font-black text-orange-700">{record.explosiveQty.toLocaleString('en-IN')} Kg</span>
                    </div>
                  </div>
                  <button onClick={(e) => handleDeleteRecord(record.id, e)} className="absolute top-4 right-4 text-red-500 hover:bg-red-100 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 bg-white">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-6 h-6 text-blue-600" /> Enter Blast Report</h2>
              <button onClick={() => setIsFormModalOpen(false)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <BlastForm onSubmit={handleNewEntry} onCancel={() => setIsFormModalOpen(false)} />
          </div>
        </div>
      )}

      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b flex justify-between"><h2 className="text-xl font-bold">Bulk Paste from Excel</h2><button onClick={() => setIsBulkModalOpen(false)}><X className="w-6 h-6"/></button></div>
            <div className="p-5 bg-gray-50 flex-grow"><textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder="Paste Excel rows here..." className="w-full h-64 p-4 border-2 rounded-xl text-sm font-mono"></textarea></div>
            <div className="p-5 border-t flex gap-3"><button onClick={() => setIsBulkModalOpen(false)} className="px-6 py-3 bg-gray-100 font-bold rounded-xl flex-1">Cancel</button><button onClick={handleBulkImport} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl flex-1 flex justify-center gap-2"><Upload className="w-5 h-5"/> Import Data</button></div>
          </div>
        </div>
      )}

      {/* TERA ORIGINAL DETAIL MODAL WAPAS LAGA DIYA HAI */}
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
                <button onClick={() => shareToWhatsApp(selectedRecord)} className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2 px-4 py-2 rounded-lg font-bold">
                  <MessageCircle className="w-5 h-5" /> <span className="hidden sm:inline">Share Report</span>
                </button>
                <button onClick={() => setSelectedRecordId(null)} className="text-white hover:bg-white/20 p-2 rounded-full"><X className="w-6 h-6" /></button>
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
                  <div><p className="text-xs text-gray-500">NTD (17/25/42)</p><p className="font-bold text-gray-900">{selectedRecord.ntd17} / {selectedRecord.ntd25} / {selectedRecord.ntd42}</p></div>
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