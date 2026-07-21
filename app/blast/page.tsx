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

// Smart function to handle any Excel date format (DD/MM/YYYY or YYYY-MM-DD)
const parseExcelDate = (rawDate: string) => {
  if (!rawDate) return new Date().toISOString().split('T')[0]
  const clean = rawDate.trim()
  const parts = clean.includes('/') ? clean.split('/') : clean.split('-')
  
  if (parts.length === 3) {
    if (parts[2].length === 4) { // DD/MM/YYYY
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }
    if (parts[0].length === 4) { // YYYY/MM/DD
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
    }
  }
  return clean
}

export default function BlastPage() {
  const [records, setRecords] = useState<BlastRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [bulkText, setBulkText] = useState('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  // 1. Fetch from Supabase on Load
  const fetchRecords = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from('blast_reports').select('*').order('date', { ascending: false })
    
    if (error) {
      console.error("Supabase Error:", error)
      // If table doesn't exist yet, don't crash
    } else if (data) {
      setRecords(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  // Month Filter Logic (Fixed Date Extraction)
  const availableMonths = useMemo(() => {
    const months = new Set(records.map(r => {
      const d = r.date || ''
      return d.substring(0, 7) // Safely extracts YYYY-MM
    }).filter(m => m.length === 7))
    return Array.from(months).sort().reverse()
  }, [records])

  // Auto-select latest month if empty
  useEffect(() => {
    if (selectedMonth === '' && availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0])
    }
  }, [availableMonths, selectedMonth])

  const filteredRecords = selectedMonth 
    ? records.filter(r => (r.date || '').startsWith(selectedMonth))
    : records

  const formatMonthYear = (yyyy_mm: string) => {
    if (!yyyy_mm) return ''
    const date = new Date(yyyy_mm + '-01')
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  // 2. Insert Single Record to Supabase
  const handleNewEntry = async (data: any) => {
    const newEntry = { ...data, date: parseExcelDate(data.date), id: Math.random().toString(36).substr(2, 9) }
    
    // Optimistic UI Update
    setRecords([newEntry, ...records])
    setIsFormModalOpen(false)

    // Save to DB
    await supabase.from('blast_reports').insert([newEntry])
  }

  // 3. Bulk Import & Save to Supabase
  const handleBulkImport = async () => {
    if (!bulkText.trim()) return

    const rows = bulkText.trim().split('\n')
    const newEntries: BlastRecord[] = []

    rows.forEach(row => {
      const cols = row.split('\t')
      if (cols.length < 5) return // Skip empty rows

      newEntries.push({
        id: Math.random().toString(36).substr(2, 9),
        date: parseExcelDate(cols[0]), // Smart Date Converter
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
      setRecords([...newEntries, ...records]) // Update UI immediately
      setBulkText('')
      setIsBulkModalOpen(false)
      alert(`${newEntries.length} records added! Dropdown has been updated.`)
      
      // Save to DB in background
      await supabase.from('blast_reports').insert(newEntries)
    } else {
      alert("No valid data found to import.")
    }
  }

  // 4. Delete from Supabase
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
    const message = `BDEPL \nDate - ${formattedDate} \nFace - ${record.face}\n\nTotal Explosive - ${record.explosiveQty} Kg\nVolume - ${record.volume} Cum\nPf - ${record.pf} kg/cum\nCf - ${record.cf} cum/kg\nVibration - ${record.vibration} mm/s\nBlasting Time - ${record.blastingTime}`
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
                className="block w-full pl-10 pr-10 py-3 text-base border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-xl appearance-none bg-white font-semibold text-gray-700 cursor-pointer shadow-sm"
              >
                {availableMonths.map(month => (
                  <option key={month} value={month}>{formatMonthYear(month)}</option>
                ))}
                {availableMonths.length === 0 && <option value="">No Data Available</option>}
              </select>
            </div>

            <Button 
              onClick={() => setIsBulkModalOpen(true)} 
              variant="outline"
              className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold px-4 py-6 rounded-xl shadow-sm w-full sm:w-auto"
            >
              <FileSpreadsheet className="w-5 h-5 mr-2" /> Bulk Paste
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">Loading database records...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5 shadow-sm">
                <p className="text-sm font-bold text-orange-700 uppercase tracking-wide mb-1">Blasts in {formatMonthYear(selectedMonth)}</p>
                <p className="text-3xl font-black text-orange-700">{filteredRecords.length}</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
                <p className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-1">Avg Explosive (Kg)</p>
                <p className="text-3xl font-black text-blue-700">
                  {filteredRecords.length ? Math.round(filteredRecords.reduce((acc, curr) => acc + curr.explosiveQty, 0) / filteredRecords.length).toLocaleString('en-IN') : 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <div 
                  key={record.id} 
                  onClick={() => setSelectedRecordId(record.id)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative group flex flex-col"
                >
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
                      <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Location / Face</p>
                      <p className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-500" /> {record.face} - {record.location}
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 border-2 border-orange-100 p-3 rounded-lg flex items-center justify-between mt-auto">
                      <span className="text-sm font-bold text-orange-800 flex items-center gap-1.5">
                        <Zap className="w-4 h-4" /> Total Explosive
                      </span>
                      <span className="text-xl font-black text-orange-700">{record.explosiveQty.toLocaleString('en-IN')} Kg</span>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => handleDeleteRecord(record.id, e)}
                    className="absolute top-4 right-4 text-red-500 hover:bg-red-100 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-white/80"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )) : (
                <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                  <Filter className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-semibold text-lg text-gray-700">No records found for {formatMonthYear(selectedMonth) || "this month"}</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* BULK IMPORT MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600" /> Bulk Paste from Excel
                </h2>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-full bg-gray-50">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto bg-gray-50">
              <textarea 
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Click here and press Ctrl+V to paste your Excel rows..."
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-mono whitespace-pre"
              ></textarea>
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setIsBulkModalOpen(false)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl flex-1">Cancel</button>
              <button onClick={handleBulkImport} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex-1 flex justify-center items-center gap-2">
                <Upload className="w-5 h-5" /> Import Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL WITH WHATSAPP SHARE */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative">
            <div className="bg-blue-600 p-4 md:p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-black mb-1">Face: {selectedRecord.face}</h2>
                <p className="text-blue-100 text-sm font-semibold flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(selectedRecord.date).toLocaleDateString('en-IN')}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => shareToWhatsApp(selectedRecord)} className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2 px-4 py-2 rounded-lg font-bold">
                  <MessageCircle className="w-5 h-5" /> Share
                </button>
                <button onClick={() => setSelectedRecordId(null)} className="text-white hover:bg-white/20 p-2 rounded-full"><X className="w-6 h-6" /></button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 font-bold">Explosive Qty</p>
                  <p className="text-xl font-black text-orange-600">{selectedRecord.explosiveQty} Kg</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 font-bold">Volume</p>
                  <p className="text-xl font-black text-blue-600">{selectedRecord.volume} Cum</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 font-bold">Powder Factor</p>
                  <p className="text-xl font-black text-emerald-600">{selectedRecord.pf}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 font-bold">Vibration</p>
                  <p className="text-xl font-black text-red-600">{selectedRecord.vibration}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}