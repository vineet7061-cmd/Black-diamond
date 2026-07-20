'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { FileSpreadsheet, Calendar, Upload, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'

interface SaleRecord {
  id: string
  recordMonth: string
  date: string
  chalanNo: string
  bmdNo: string
  qty: number
  amount: number
  invoiceNo: string
  ecciDate: string
  ecciNo: string
  grnNo: string
  billUploadDate: string
  chalanDate: string
}

export default function EcciAndSalePage() {
  const [records, setRecords] = useState<SaleRecord[]>([])
  // Default to current month (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)) 
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 1. Fetch Data from Supabase
  const fetchRecords = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('ecci_sales')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching records:", error)
    } else if (data) {
      const formattedData: SaleRecord[] = data.map((item: any) => ({
        id: item.id,
        recordMonth: item.record_month || '',
        date: item.date || '',
        chalanNo: item.chalan_no || '',
        bmdNo: item.bmd_no || '',
        qty: Number(item.qty) || 0,
        amount: Number(item.amount) || 0,
        invoiceNo: item.invoice_no || '',
        ecciDate: item.ecci_date || '',
        ecciNo: item.ecci_no || '',
        grnNo: item.grn_no || '',
        billUploadDate: item.bill_upload_date || '',
        chalanDate: item.chalan_date || '',
      }))
      setRecords(formattedData)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  // 2. Smart Excel File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedMonth) {
      alert("Please select a Month from the top before uploading the file!")
      if(e.target) e.target.value = ''
      return
    }

    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)

        // Date Parser
        const parseDate = (val: any) => {
          if (!val) return null
          if (typeof val === 'number') {
            const date = new Date((val - (25567 + 2)) * 86400 * 1000)
            return date.toISOString().split('T')[0]
          }
          return String(val).trim()
        }

        // SMART KEY SCANNER: Removes all spaces, dots, and makes it lowercase
        const normalizeKey = (key: string) => key.toString().toLowerCase().replace(/[^a-z0-9]/g, '')

        const rowsToInsert = data.map((rawRow: any) => {
          const row: any = {}
          Object.keys(rawRow).forEach(key => {
            row[normalizeKey(key)] = rawRow[key]
          })

          return {
            record_month: selectedMonth, // Tags the record with the selected month
            date: parseDate(row['date']),
            chalan_no: row['chalanno'] ? String(row['chalanno']).trim() : null,
            bmd_no: row['bmdno'] ? String(row['bmdno']).trim() : null,
            qty: Number(row['qty']) || 0,
            amount: Number(row['amount']) || 0,
            invoice_no: row['invoiceno'] ? String(row['invoiceno']).trim() : null,
            ecci_date: parseDate(row['eccidate']),
            ecci_no: row['eccino'] ? String(row['eccino']).trim() : null,
            grn_no: row['grnno'] ? String(row['grnno']).trim() : null,
            bill_upload_date: parseDate(row['billuploaddate']),
            chalan_date: parseDate(row['chalandate']),
          }
        })

        if (rowsToInsert.length === 0) {
          alert("No data found in Excel sheet.")
          setIsUploading(false)
          return
        }

        // Save to Database
        const { error } = await supabase.from('ecci_sales').insert(rowsToInsert)

        if (error) {
          alert("Failed to save to database: " + error.message)
        } else {
          alert(`Success! Data tagged and saved for ${selectedMonth}`)
          fetchRecords()
        }
      } catch (error) {
        alert("Error reading Excel. Please ensure correct format.")
        console.error(error)
      } finally {
        setIsUploading(false)
        if(e.target) e.target.value = ''
      }
    }
    reader.readAsBinaryString(file)
  }

  // Delete Record
  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to delete this record?")) {
      const { error } = await supabase.from('ecci_sales').delete().eq('id', id)
      if(!error) {
        setRecords(prev => prev.filter(r => r.id !== id))
      }
    }
  }

  // Strict Month Filtering (Only shows records uploaded for the selected month)
  const filteredRecords = selectedMonth 
    ? records.filter(record => record.recordMonth === selectedMonth)
    : [] // If no month is selected, show nothing

  // Stats
  const totalAmount = filteredRecords.reduce((sum, r) => sum + r.amount, 0)
  const totalQty = filteredRecords.reduce((sum, r) => sum + r.qty, 0)
  const totalInvoices = filteredRecords.filter(r => r.invoiceNo).length
  const totalGrns = filteredRecords.filter(r => r.grnNo).length

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28 flex-grow flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">ECCI and SALE</h1>
            <p className="text-gray-600">Upload Excel reports and track monthly billing records</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Strict Month Filter */}
            <div className="bg-white border-2 border-blue-400 rounded-xl px-4 py-2 flex items-center gap-3 w-full md:w-auto shadow-sm ring-4 ring-blue-50">
              <Calendar className="w-6 h-6 text-blue-600" />
              <div className="flex flex-col">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Selected Month</label>
                <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="outline-none font-bold text-gray-900 bg-transparent text-lg"
                />
              </div>
            </div>

            {/* Excel Upload Button */}
            <div className="relative w-full md:w-auto">
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileUpload}
                disabled={isUploading || !selectedMonth}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="excel-upload"
              />
              <label 
                htmlFor="excel-upload"
                className={`flex items-center justify-center gap-2 text-white font-semibold px-6 py-4 rounded-xl shadow-md transition-colors w-full ${isUploading || !selectedMonth ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'}`}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving Data...
                  </div>
                ) : (
                  <>
                    <FileSpreadsheet className="w-5 h-5" />
                    Upload for {selectedMonth || 'Month'}
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Warning if no month selected */}
        {!selectedMonth && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700 font-semibold">
            <AlertCircle className="w-5 h-5" />
            Please select a month above to view or upload data.
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-gray-500 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            Loading Database...
          </div>
        ) : selectedMonth && (
          <>
            {/* Stats - Strictly 2x2 Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-blue-700">₹{totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <p className="text-sm font-medium text-blue-700 mb-1">Total Quantity</p>
                <p className="text-2xl font-bold text-blue-800">{totalQty.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
                <p className="text-sm font-medium text-emerald-700 mb-1">Invoices Linked</p>
                <p className="text-2xl font-bold text-emerald-800">{totalInvoices}</p>
              </div>
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                <p className="text-sm font-medium text-amber-700 mb-1">GRNs Generated</p>
                <p className="text-2xl font-bold text-amber-800">{totalGrns}</p>
              </div>
            </div>

            {/* Records Display - Strictly 2x2 Grid */}
            {filteredRecords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 transition-colors shadow-sm flex flex-col relative group">
                    
                    {/* Delete Button (Hover) */}
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="absolute top-4 right-4 text-red-500 hover:bg-red-100 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-3 pr-8">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{record.ecciNo || 'NO ECCI'}</h3>
                        <p className="text-xs font-semibold text-gray-500">Date: {record.date || '-'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-700">₹{record.amount.toLocaleString('en-IN')}</p>
                        <p className="text-xs font-bold text-gray-500">QTY: {record.qty}</p>
                      </div>
                    </div>

                    {/* Card Body - 2 Column Detail Layout */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4 flex-grow">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Chalan No</p>
                        <p className="text-sm font-semibold text-gray-900">{record.chalanNo || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">BMD No</p>
                        <p className="text-sm font-semibold text-gray-900">{record.bmdNo || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Invoice No</p>
                        <p className={`text-sm font-bold ${record.invoiceNo ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {record.invoiceNo || 'Pending'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">GRN No</p>
                        <p className={`text-sm font-bold ${record.grnNo ? 'text-purple-600' : 'text-gray-400'}`}>
                          {record.grnNo || 'Pending'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">ECCI Date</p>
                        <p className="text-sm font-medium text-gray-700">{record.ecciDate || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Bill Upload</p>
                        <p className="text-sm font-medium text-gray-700">{record.billUploadDate || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl mt-4 bg-gray-50 flex-grow flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-gray-300 mb-3" />
                <p className="font-bold text-xl text-gray-700">No Data Available for {selectedMonth}</p>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                  Click the upload button to add your Excel file records specifically to this month.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}