'use client'

import { useState, useMemo, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Plus, Trash2, Zap, MapPin, Calendar, Clock, X, MessageCircle, Upload, Filter, FileSpreadsheet, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

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

const parseDateString = (rawDate: any) => {
  if (!rawDate) return new Date().toISOString().split('T')[0]
  if (typeof rawDate === 'number') {
    const jsDate = new Date((rawDate - (25567 + 2)) * 86400 * 1000)
    return jsDate.toISOString().split('T')[0]
  }
  const clean = String(rawDate).trim()
  const parts = clean.includes('/') ? clean.split('/') : clean.split('-')
  if (parts.length === 3) {
    if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
  }
  return clean
}

function BlastForm({ onSubmit, onCancel, isSaving }: { onSubmit: (data: any) => void, onCancel: () => void, isSaving: boolean }) {
  const [pasteText, setPasteText] = useState('')
  const [formData, setFormData] = useState<Partial<BlastRecord>>({
    date: new Date().toISOString().split('T')[0],
    blastingTime: '14:30', face: '', location: '',
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

  const handleTextPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setPasteText(text)

    if (!text.trim()) return

    const splitIndex = text.toLowerCase().indexOf('ntd used for lead');
    const firstHalf = splitIndex !== -1 ? text.substring(0, splitIndex) : text;
    const secondHalf = splitIndex !== -1 ? text.substring(splitIndex) : '';

    const extractNum = (source: string, regex: RegExp, defaultVal = 0) => {
      const match = source.match(regex)
      return match && match[1] && !isNaN(parseFloat(match[1])) ? parseFloat(match[1]) : defaultVal
    }

    const extractStr = (source: string, regex: RegExp, defaultVal = '') => {
      const match = source.match(regex)
      return match && match[1] ? match[1].trim() : defaultVal
    }

    let parsedDate = formData.date
    const dateMatch = text.match(/Date\s*-\s*([0-9/]+)/i)
    if (dateMatch && dateMatch[1]) {
      const dParts = dateMatch[1].trim().split('/')
      if (dParts.length === 3) parsedDate = `${dParts[2]}-${dParts[1].padStart(2, '0')}-${dParts[0].padStart(2, '0')}`
    }

    setFormData(prev => ({
      ...prev,
      date: parsedDate,
      face: extractStr(text, /Face\s*-\s*([^\n]+)/i, prev.face),
      location: extractStr(text, /Location\s*-\s*([^\n]+)/i, prev.location),
      blastingTime: extractStr(text, /Blasting Time\s*[:\-]*\s*([^\n]+)/i, prev.blastingTime),
      
      holesMain: extractNum(text, /Main\s*-\s*([\d.]+)/i, prev.holesMain),
      holesPilot: extractNum(text, /pilot\s*-\s*([\d.]+)/i, 0),
      benchHeight: extractNum(text, /Bench height\s*-\s*([\d.]+)/i, prev.benchHeight),
      depthMain: extractNum(text, /Avg\.Depth\s*-\s*([\d.]+)/i, prev.depthMain),
      burden: extractNum(text, /Burden\s*-\s*([\d.]+)/i, prev.burden),
      spacing: extractNum(text, /Spacing\s*-\s*([\d.]+)/i, prev.spacing),
      stemmingMain: extractNum(text, /Stemming\s*-\s*([\d.]+)/i, prev.stemmingMain),
      
      cphMain: extractNum(text, /CPH\s*-\s*([\d.]+)/i, prev.cphMain),
      mcdMain: extractNum(text, /MCD\s*-\s*([\d.]+)/i, prev.mcdMain),
      explosiveQty: extractNum(text, /Explosive\s*-\s*([\d.]+)/i, prev.explosiveQty),
      volume: extractNum(text, /Volume\s*-\s*([\d.]+)/i, prev.volume),
      pf: extractNum(text, /Pf\s*-\s*([\d.]+)/i, prev.pf),
      cf: extractNum(text, /Cf\s*-\s*([\d.]+)/i, prev.cf),

      ntd17: extractNum(firstHalf, /17\s*ms\s*NTD\s*-\s*([\d.]+)/i, prev.ntd17),
      ntd25: extractNum(firstHalf, /25\s*ms\s*NTD\s*-\s*([\d.]+)/i, prev.ntd25),
      ntd42: extractNum(firstHalf, /42\s*ms\s*NTD\s*-\s*([\d.]+)/i, prev.ntd42),

      ntdLead17: extractNum(secondHalf, /17\s*ms\s*NTD\s*-\s*([\d.]+)/i, prev.ntdLead17),
      ntdLead25: extractNum(secondHalf, /25\s*ms\s*NTD\s*-\s*([\d.]+)/i, prev.ntdLead25),
      ntdLead42: extractNum(secondHalf, /42\s*ms\s*NTD\s*-\s*([\d.]+)/i, prev.ntdLead42),

      sureBlast: extractNum(text, /Sure\s*blast\s*-\s*([\d.]+)/i, prev.sureBlast),
      ikon: extractNum(text, /Ikon\s*-\s*([\d.]+)/i, prev.ikon),
      initialDensity: extractNum(text, /Initial density\s*-\s*([\d.]+)/i, prev.initialDensity),
      finalDensity: extractNum(text, /Final density\s*-\s*([\d.]+)/i, prev.finalDensity),
      booster: extractNum(text, /Booster\s*-\s*([\d.]+)/i, prev.booster),
      dth10m: extractNum(text, /DTH\s*\(10m\)\s*-\s*([\d.]+)/i, prev.dth10m),
      dth6m: extractNum(text, /DTH\s*\(6m\)\s*-\s*([\d.]+)/i, prev.dth6m),
      vibration: extractNum(text, /Vibration\s*-\s*([\d.]+)/i, prev.vibration),
      db: extractNum(text, /Peak Overpressure\s*-\s*([\d.]+)/i, prev.db),
      distance: extractNum(text, /Distance\s*-\s*([\d.]+)/i, prev.distance),
      manPower: extractNum(text, /Man power\s*-\s*([\d.]+)/i, prev.manPower),
    }))
  }

  const handleInput = (field: keyof BlastRecord, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const InputField = ({ label, field, type = "number", step = "any", placeholder = "0", isRequired = false }: any) => (
    <div>
      <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        step={step}
        placeholder={placeholder}
        value={formData[field as keyof BlastRecord] ?? ''} 
        onChange={(e) => handleInput(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-600"
        required={isRequired}
        disabled={isSaving}
      />
    </div>
  )

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
          <label className="block text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
            <Copy className="w-4 h-4" /> Paste Message Details (Auto-Fill)
          </label>
          <textarea
            value={pasteText}
            onChange={handleTextPaste}
            placeholder={`Date - 01/07/2026\nFace - XOB-1\nNo of Holes - 54...`}
            className="w-full h-28 px-4 py-3 bg-white border border-emerald-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
            disabled={isSaving}
          ></textarea>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-800 mb-3 text-sm flex items-center gap-1"><MapPin className="w-4 h-4"/> Basic Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" field="date" type="date" isRequired={true} />
            <InputField label="Blasting Time" field="blastingTime" type="text" placeholder="e.g. 2:30 PM" />
            <InputField label="Face" field="face" type="text" placeholder="e.g. XOB-1" isRequired={true} />
            <InputField label="Exact Location" field="location" type="text" placeholder="e.g. Near X OB 1 area" />
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
            <InputField label="Total Explosive (Kg)" field="explosiveQty" isRequired={true} />
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
            <InputField label="Peak Overpressure (dB)" field="db" />
            <InputField label="Distance (m)" field="distance" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <InputField label="Man Power" field="manPower" />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onCancel} disabled={isSaving} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg flex-1 disabled:opacity-50">Cancel</button>
          <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1 disabled:opacity-50">
            {isSaving ? 'Saving to Database...' : 'Save Blast Report'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function BlastPage() {
  const [records, setRecords] = useState<BlastRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false) // Added saving state

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

  // 🚀 FIXED: Wait for DB Insert BEFORE updating UI 🚀
  const handleNewEntry = async (data: any) => {
    setIsSaving(true)
    const newEntry = { ...data, date: parseDateString(data.date), id: Math.random().toString(36).substr(2, 9) }
    
    const { error } = await supabase.from('blast_reports').insert([newEntry])
    
    if (error) {
      alert("❌ ERROR SAVING TO DATABASE:\n" + error.message + "\n\n(Supabase dashboard me check karo column names ya RLS settings)")
    } else {
      setRecords([newEntry, ...records])
      setIsFormModalOpen(false)
      alert("✅ Data successfully saved!")
    }
    setIsSaving(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keeping your previous solid Excel logic intact
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const jsonData: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' })

        if (jsonData.length === 0) {
          alert("Excel file empty hai!")
          setUploading(false)
          return
        }

        const formattedEntries: BlastRecord[] = jsonData.map((row) => {
          const getCol = (keyNames: string[]) => {
            const foundKey = Object.keys(row).find(k => 
              keyNames.some(kn => k.toLowerCase().replace(/[^a-z0-9]/g, '') === kn.toLowerCase().replace(/[^a-z0-9]/g, ''))
            )
            return foundKey ? row[foundKey] : ''
          }

          return {
            id: Math.random().toString(36).substr(2, 9),
            date: parseDateString(getCol(['date'])),
            blastingTime: String(getCol(['blasting time', 'time']) || '14:30'),
            face: String(getCol(['face'])),
            location: String(getCol(['location'])),
            holesMain: parseFloat(getCol(['holes main', 'main holes', 'main'])) || 0,
            holesPilot: parseFloat(getCol(['holes pilot', 'pilot holes', 'pilot'])) || 0,
            benchHeight: parseFloat(getCol(['bench height'])) || 0,
            depthMain: parseFloat(getCol(['depth main', 'avg depth main', 'avg depth'])) || 0,
            depthPilot: parseFloat(getCol(['depth pilot', 'avg depth pilot'])) || 0,
            burden: parseFloat(getCol(['burden'])) || 0,
            spacing: parseFloat(getCol(['spacing'])) || 0,
            stemmingMain: parseFloat(getCol(['stemming main', 'stemming'])) || 0,
            stemmingPilot: parseFloat(getCol(['stemming pilot'])) || 0,
            cphMain: parseFloat(getCol(['cph main', 'cph'])) || 0,
            cphPilot: parseFloat(getCol(['cph pilot'])) || 0,
            mcdMain: parseFloat(getCol(['mcd main', 'mcd'])) || 0,
            mcdPilot: parseFloat(getCol(['mcd pilot'])) || 0,
            explosiveQty: parseFloat(getCol(['explosive', 'explosive qty'])) || 0,
            volume: parseFloat(getCol(['volume'])) || 0,
            pf: parseFloat(getCol(['pf', 'powder factor'])) || 0,
            cf: parseFloat(getCol(['cf', 'charge factor'])) || 0,
            ntd17: parseFloat(getCol(['17 ms ntd', '17ms ntd', '17ms'])) || 0,
            ntd25: parseFloat(getCol(['25 ms ntd', '25ms ntd', '25ms'])) || 0,
            ntd42: parseFloat(getCol(['42 ms ntd', '42ms ntd', '42ms'])) || 0,
            ntdLead17: parseFloat(getCol(['lead 17ms', '17ms lead', 'lead 17 ms ntd'])) || 0,
            ntdLead25: parseFloat(getCol(['lead 25ms', '25ms lead', 'lead 25 ms ntd'])) || 0,
            ntdLead42: parseFloat(getCol(['lead 42ms', '42ms lead', 'lead 42 ms ntd'])) || 0,
            sureBlast: parseFloat(getCol(['sure blast', 'sureblast'])) || 0,
            ikon: parseFloat(getCol(['ikon'])) || 0,
            booster: parseFloat(getCol(['booster'])) || 0,
            initialDensity: parseFloat(getCol(['initial density'])) || 0,
            finalDensity: parseFloat(getCol(['final density'])) || 0,
            dth10m: parseFloat(getCol(['dth 10m', 'dth10m'])) || 0,
            dth6m: parseFloat(getCol(['dth 6m', 'dth6m'])) || 0,
            vibration: parseFloat(getCol(['vibration'])) || 0,
            db: parseFloat(getCol(['peak overpressure', 'db', 'db level'])) || 0,
            distance: parseFloat(getCol(['distance'])) || 0,
            manPower: parseFloat(getCol(['man power', 'manpower'])) || 0,
          }
        })

        const { error } = await supabase.from('blast_reports').insert(formattedEntries)
        if (error) {
          alert("Database saving error: " + error.message)
        } else {
          setRecords([...formattedEntries, ...records])
          alert(`Success! ${formattedEntries.length} entries Excel se import ho gayi hain.`)
          setIsExcelModalOpen(false)
        }
      } catch (err: any) {
        alert("Excel File parsing error: " + err.message)
      } finally {
        setUploading(false)
      }
    }
    reader.readAsBinaryString(file)
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
    const message = `BDEPL \nDate - ${formattedDate} \nFace -  ${record.face}\n\nNo of Holes\nMain - ${record.holesMain}\nPilot - ${record.holesPilot}\nBench height - ${record.benchHeight} m\n\nAvg.Depth\nMain - ${record.depthMain} m\nPilot - ${record.depthPilot} m\n\nBurden -   ${record.burden} m\nSpacing - ${record.spacing} m\n\nStemming\nMain - ${record.stemmingMain} m\nPilot - ${record.stemmingPilot} m\n\nCPH\nMain - ${record.cphMain} Kg \nPilot - ${record.cphPilot} Kg \n\nMCD\nMain - ${record.mcdMain} Kg \nPilot - ${record.mcdPilot} Kg \n\nExplosive - ${record.explosiveQty} Kg\nVolume -  ${record.volume} Cum\n\nPf- ${record.pf} kg/cum\nCf- ${record.cf} cum/kg\n\n17 ms NTD - ${record.ntd17}\n25 ms NTD-  ${record.ntd25}\n42 ms NTD - ${record.ntd42}\nNTD used for lead\n17 ms NTD- ${record.ntdLead17}\n25 ms NTD-  ${record.ntdLead25}\n42 ms NTD-  ${record.ntdLead42}\n\nSURE BLAST  -  ${record.sureBlast}\nIkon - ${record.ikon}\n\nInitial density -${record.initialDensity} g/cc\nFinal density - ${record.finalDensity} g/cc\n\nBooster- ${record.booster} kg\n\nDTH \n10m - ${record.dth10m}\n6m - ${record.dth6m}\n\nVibration -  ${record.vibration} mm/sec\nPeak Overpressure- ${record.db} dB\nLocation -  ${record.location}\nDistance - ${record.distance} m\nMan power - ${record.manPower}\nBlasting Time : ${record.blastingTime}`
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
            
            <Button onClick={() => setIsExcelModalOpen(true)} variant="outline" className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold px-4 py-6 rounded-xl">
              <FileSpreadsheet className="w-5 h-5 mr-2" /> Upload Excel
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
              <button onClick={() => setIsFormModalOpen(false)} disabled={isSaving} className="p-2 bg-gray-50 rounded-full disabled:opacity-50"><X className="w-5 h-5" /></button>
            </div>
            <BlastForm onSubmit={handleNewEntry} onCancel={() => setIsFormModalOpen(false)} isSaving={isSaving} />
          </div>
        </div>
      )}

      {isExcelModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative">
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-700">
                <FileSpreadsheet className="w-6 h-6" /> Upload Excel File
              </h2>
              <button onClick={() => setIsExcelModalOpen(false)} className="p-1 rounded-full bg-gray-100"><X className="w-5 h-5"/></button>
            </div>

            <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl p-8 text-center">
              <input
                type="file"
                id="excel-file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label htmlFor="excel-file" className="cursor-pointer flex flex-col items-center gap-3">
                <Upload className="w-12 h-12 text-emerald-600" />
                <span className="text-base font-bold text-gray-800">
                  {uploading ? 'Reading Excel sheet...' : 'Click to select .xlsx or .csv file'}
                </span>
                <span className="text-xs text-gray-500">Auto-detects columns and imports to database</span>
              </label>
            </div>
          </div>
        </div>
      )}

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
                  <div><p className="text-xs text-gray-500">Density (Init / Final)</p><p className="font-bold text-gray-900">{selectedRecord.initialDensity} / {selectedRecord.finalDensity} g/cc</p></div>
                  <div><p className="text-xs text-gray-500">DTH (10m / 6m)</p><p className="font-bold text-gray-900">{selectedRecord.dth10m} / {selectedRecord.dth6m}</p></div>
                  <div><p className="text-xs text-gray-500">Vibration</p><p className="font-bold text-red-600">{selectedRecord.vibration} mm/sec</p></div>
                  <div><p className="text-xs text-gray-500">Peak Overpressure</p><p className="font-bold text-gray-900">{selectedRecord.db} dB</p></div>
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