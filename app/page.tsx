'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { Plus, AlertTriangle, Clock, CheckCircle, AlertCircle, X, UploadCloud, User, FileText, IdCard, ArrowLeft, Image as ImageIcon, Trash2, Edit, ShieldCheck, Wind, FileSignature } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

// Interfaces
interface Driver {
  id: string
  name: string
  contact: string
  photoName?: string
  licenseName?: string
  gatePassName?: string
  trainingCardName?: string
}

interface Vehicle {
  id: string
  registrationNumber: string
  type: 'LMV' | 'HMV'
  lastInspectionDate: string
  inspectionExpiryDate: string
  status: 'excellent' | 'good' | 'warning' | 'critical'
  condition: 'good' | 'average' | 'needs-repair'
  driver?: Driver
  rcName?: string
  insuranceName?: string
  pucName?: string
  permitName?: string
}

export default function Page() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filter, setFilter] = useState<'all' | 'LMV' | 'HMV'>('all')
  const [isLoading, setIsLoading] = useState(true)
  
  // Navigation States
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [viewingDriverId, setViewingDriverId] = useState<string | null>(null)
  
  // Modal States
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false)
  const [isVehicleDocsModalOpen, setIsVehicleDocsModalOpen] = useState(false)
  
  // Add Vehicle Form State
  const [newReg, setNewReg] = useState('')
  const [newType, setNewType] = useState<'LMV' | 'HMV'>('LMV')
  const [lastCheckedDate, setLastCheckedDate] = useState('')
  const [newCheckedDate, setNewCheckedDate] = useState('')

  // Add/Edit Driver Form State
  const [driverName, setDriverName] = useState('')
  const [driverContact, setDriverContact] = useState('')
  const [driverPhoto, setDriverPhoto] = useState<File | null>(null)
  const [driverDL, setDriverDL] = useState<File | null>(null)
  const [driverGatePass, setDriverGatePass] = useState<File | null>(null)
  const [driverTraining, setDriverTraining] = useState<File | null>(null)

  // Vehicle Docs Form State
  const [vehRC, setVehRC] = useState<File | null>(null)
  const [vehInsurance, setVehInsurance] = useState<File | null>(null)
  const [vehPUC, setVehPUC] = useState<File | null>(null)
  const [vehPermit, setVehPermit] = useState<File | null>(null)

  // Fetch Data from Supabase
  const fetchVehicles = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching vehicles:", error)
    } else if (data) {
      const formattedData: Vehicle[] = data.map((item: any) => ({
        id: item.id,
        registrationNumber: item.registration_number,
        type: item.type,
        lastInspectionDate: item.last_inspection_date,
        inspectionExpiryDate: item.inspection_expiry_date,
        status: item.status,
        condition: item.condition,
        rcName: item.rc_name || undefined,
        insuranceName: item.insurance_name || undefined,
        pucName: item.puc_name || undefined,
        permitName: item.permit_name || undefined,
        driver: item.driver_name ? {
          id: item.driver_id,
          name: item.driver_name,
          contact: item.driver_contact,
          photoName: item.driver_photo_name || undefined,
          licenseName: item.driver_license_name || undefined,
          gatePassName: item.driver_gate_pass_name || undefined,
          trainingCardName: item.driver_training_card_name || undefined,
        } : undefined
      }))
      setVehicles(formattedData)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  // Derived Data
  const filteredVehicles = filter === 'all' ? vehicles : vehicles.filter(v => v.type === filter)
  const criticalCount = vehicles.filter(v => v.status === 'critical').length
  const warningCount = vehicles.filter(v => v.status === 'warning').length

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId)
  const selectedDriver = selectedVehicle?.driver

  const hasDriverDocuments = (driver?: Driver) => {
    if (!driver) return false;
    return !!(driver.photoName || driver.licenseName || driver.gatePassName || driver.trainingCardName);
  }

  const hasAllVehicleDocs = (vehicle: Vehicle) => {
    return !!(vehicle.rcName && vehicle.insuranceName && vehicle.pucName && vehicle.permitName);
  }

  // Handlers
  const handleUpdateCondition = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation() 
    const vehicle = vehicles.find(v => v.id === id)
    if (!vehicle) return

    const statuses: ('excellent' | 'good' | 'warning' | 'critical')[] = ['excellent', 'good', 'warning', 'critical']
    const nextStatus = statuses[(statuses.indexOf(vehicle.status) + 1) % statuses.length]
    
    // Optimistic UI Update
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status: nextStatus } : v))

    // Database Update
    const { error } = await supabase.from('vehicles').update({ status: nextStatus }).eq('id', id)
    if(error) {
      alert("Status update failed in database.")
      fetchVehicles() // Revert on fail
    }
  }

  const handleDeleteVehicle = async (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) {
      const { error } = await supabase.from('vehicles').delete().eq('id', id)
      if (!error) {
        setVehicles(prev => prev.filter(v => v.id !== id))
        setSelectedVehicleId(null)
      } else {
        alert("Failed to delete vehicle: " + error.message)
      }
    }
  }

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReg || !lastCheckedDate || !newCheckedDate) return
    
    const { error } = await supabase.from('vehicles').insert([{
      registration_number: newReg.toUpperCase(),
      type: newType,
      last_inspection_date: lastCheckedDate,
      inspection_expiry_date: newCheckedDate,
      status: 'excellent',
      condition: 'good'
    }])

    if (!error) {
      await fetchVehicles()
      setIsVehicleModalOpen(false)
      setNewReg(''); setLastCheckedDate(''); setNewCheckedDate('')
    } else {
      alert("Failed to save vehicle: " + error.message)
    }
  }

  const openDriverModal = (editMode = false) => {
    if (editMode && selectedVehicle?.driver) {
      setDriverName(selectedVehicle.driver.name)
      setDriverContact(selectedVehicle.driver.contact)
    } else {
      setDriverName('')
      setDriverContact('')
    }
    setDriverPhoto(null); setDriverDL(null); setDriverGatePass(null); setDriverTraining(null);
    setIsDriverModalOpen(true)
  }

  const handleRemoveDriver = async (vehicleId: string) => {
    if (confirm("Are you sure you want to remove this driver from the vehicle?")) {
      const { error } = await supabase.from('vehicles').update({
        driver_id: null,
        driver_name: null,
        driver_contact: null,
        driver_photo_name: null,
        driver_license_name: null,
        driver_gate_pass_name: null,
        driver_training_card_name: null
      }).eq('id', vehicleId)

      if (!error) {
        await fetchVehicles()
      } else {
        alert("Failed to remove driver.")
      }
    }
  }

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicleId || !driverName) return

    const driverId = selectedVehicle?.driver ? selectedVehicle.driver.id : Math.random().toString(36).substr(2, 9)

    const updateData = {
      driver_id: driverId,
      driver_name: driverName,
      driver_contact: driverContact,
      driver_photo_name: driverPhoto?.name || selectedVehicle?.driver?.photoName || null,
      driver_license_name: driverDL?.name || selectedVehicle?.driver?.licenseName || null,
      driver_gate_pass_name: driverGatePass?.name || selectedVehicle?.driver?.gatePassName || null,
      driver_training_card_name: driverTraining?.name || selectedVehicle?.driver?.trainingCardName || null,
    }

    const { error } = await supabase.from('vehicles').update(updateData).eq('id', selectedVehicleId)
    
    if (!error) {
      await fetchVehicles()
      setIsDriverModalOpen(false)
    } else {
      alert("Failed to save driver details: " + error.message)
    }
  }

  const openVehicleDocsModal = () => {
    setVehRC(null); setVehInsurance(null); setVehPUC(null); setVehPermit(null);
    setIsVehicleDocsModalOpen(true)
  }

  const handleUpdateVehicleDocs = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicleId) return

    const updateData = {
      rc_name: vehRC?.name || selectedVehicle?.rcName || null,
      insurance_name: vehInsurance?.name || selectedVehicle?.insuranceName || null,
      puc_name: vehPUC?.name || selectedVehicle?.pucName || null,
      permit_name: vehPermit?.name || selectedVehicle?.permitName || null,
    }

    const { error } = await supabase.from('vehicles').update(updateData).eq('id', selectedVehicleId)

    if (!error) {
      await fetchVehicles()
      setIsVehicleDocsModalOpen(false)
    } else {
      alert("Failed to update documents: " + error.message)
    }
  }

  const FileUploadInput = ({ label, icon: Icon, file, setFile }: any) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
      <input 
        type="file" 
        id={`upload-${label}`} 
        className="hidden" 
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />
      <label htmlFor={`upload-${label}`} className="cursor-pointer flex flex-col items-center gap-1">
        <Icon className={`w-6 h-6 ${file ? 'text-emerald-600' : 'text-blue-600'}`} />
        <span className="text-xs font-semibold text-gray-700">
          {file ? file.name : `Upload ${label}`}
        </span>
      </label>
    </div>
  )

  // ================= RENDER DRIVER PROFILE PAGE =================
  if (viewingDriverId && selectedDriver) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28">
          <Button variant="ghost" onClick={() => setViewingDriverId(null)} className="mb-6 -ml-2 text-gray-600">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Vehicle
          </Button>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 max-w-2xl mx-auto shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-gray-100 pb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-50">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{selectedDriver.name}</h1>
                <p className="text-gray-600 font-medium">{selectedDriver.contact || 'No contact provided'}</p>
                <p className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full inline-block mt-2 font-semibold">
                  Assigned to: {selectedVehicle?.registrationNumber}
                </p>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" /> Uploaded Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <IdCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Driving License</p>
                    <p className="text-xs text-gray-500">{selectedDriver.licenseName || 'Not uploaded'}</p>
                  </div>
                </div>
                {selectedDriver.licenseName && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Gate Pass</p>
                    <p className="text-xs text-gray-500">{selectedDriver.gatePassName || 'Not uploaded'}</p>
                  </div>
                </div>
                {selectedDriver.gatePassName && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              </div>

              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <UploadCloud className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Training Card</p>
                    <p className="text-xs text-gray-500">{selectedDriver.trainingCardName || 'Not uploaded'}</p>
                  </div>
                </div>
                {selectedDriver.trainingCardName && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ================= RENDER VEHICLE DETAIL PAGE =================
  if (selectedVehicle) {
    const isExpiringSoon = new Date(selectedVehicle.inspectionExpiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" onClick={() => setSelectedVehicleId(null)} className="-ml-2 text-gray-600">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => handleDeleteVehicle(selectedVehicle.id)} 
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-red-50/50"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Vehicle
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Registration No.</span>
                  <span className="font-bold text-lg text-gray-900">{selectedVehicle.registrationNumber}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Vehicle Type</span>
                  <span className="font-semibold text-gray-900">{selectedVehicle.type}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Last Checked Date</span>
                  <span className="font-semibold text-gray-900">{new Date(selectedVehicle.lastInspectionDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Fitness Until</span>
                  <span className={`font-bold ${isExpiringSoon ? 'text-red-600' : 'text-emerald-600'}`}>
                    {new Date(selectedVehicle.inspectionExpiryDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-100 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Driver Assignment</h2>
                {!selectedVehicle.driver && (
                  <Button onClick={() => openDriverModal(false)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-1" /> Add Driver
                  </Button>
                )}
              </div>

              {selectedVehicle.driver ? (
                <div className="border-2 border-gray-200 rounded-lg p-4 flex items-center gap-4 transition-all bg-gray-50">
                  <div className="bg-blue-200 p-3 rounded-full text-blue-700">
                    <User className="w-6 h-6" />
                  </div>
                  
                  <div 
                    className="flex-grow cursor-pointer group"
                    onClick={() => setViewingDriverId(selectedVehicle.driver!.id)}
                  >
                    <p className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{selectedVehicle.driver.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {hasDriverDocuments(selectedVehicle.driver) ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle className="w-4 h-4" /> Documents Uploaded
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          <AlertTriangle className="w-4 h-4" /> Documents Pending
                        </span>
                      )}
                    </p>
                    <span className="text-blue-600 text-xs font-semibold group-hover:underline mt-1 block">Click to view full profile</span>
                  </div>

                  <div className="flex flex-col gap-2 border-l border-gray-200 pl-4">
                    <button 
                      onClick={() => openDriverModal(true)} 
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors flex items-center justify-center"
                      title="Edit Driver"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleRemoveDriver(selectedVehicle.id)} 
                      className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors flex items-center justify-center"
                      title="Remove Driver"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex-grow flex flex-col justify-center items-center">
                  <User className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-gray-500 font-medium">No driver assigned to this vehicle yet.</p>
                </div>
              )}
            </div>

            <div className="bg-white border-2 border-indigo-100 rounded-xl p-6 shadow-sm flex flex-col md:col-span-2">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Vehicle Documents</h2>
                <Button onClick={openVehicleDocsModal} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Edit className="w-4 h-4 mr-1" /> Manage Documents
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">RC Book</p>
                      <p className="text-xs text-gray-500 line-clamp-1" title={selectedVehicle.rcName}>{selectedVehicle.rcName || 'Not uploaded'}</p>
                    </div>
                  </div>
                  {selectedVehicle.rcName ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Insurance</p>
                      <p className="text-xs text-gray-500 line-clamp-1" title={selectedVehicle.insuranceName}>{selectedVehicle.insuranceName || 'Not uploaded'}</p>
                    </div>
                  </div>
                  {selectedVehicle.insuranceName ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wind className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">PUC (Pollution)</p>
                      <p className="text-xs text-gray-500 line-clamp-1" title={selectedVehicle.pucName}>{selectedVehicle.pucName || 'Not uploaded'}</p>
                    </div>
                  </div>
                  {selectedVehicle.pucName ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSignature className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Vehicle Permit</p>
                      <p className="text-xs text-gray-500 line-clamp-1" title={selectedVehicle.permitName}>{selectedVehicle.permitName || 'Not uploaded'}</p>
                    </div>
                  </div>
                  {selectedVehicle.permitName ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Add/Edit Driver Modal */}
        {isDriverModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsDriverModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {selectedVehicle?.driver ? 'Edit Driver Details' : 'Add Driver Details'}
              </h2>
              
              <form onSubmit={handleAddDriver} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                  <input type="text" value={driverName} onChange={(e) => setDriverName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number (Optional)</label>
                  <input type="text" value={driverContact} onChange={(e) => setDriverContact(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>

                <div className="mt-2">
                  <p className="block text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Upload Documents (To Drive)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FileUploadInput label="Photo" icon={ImageIcon} file={driverPhoto} setFile={setDriverPhoto} />
                    <FileUploadInput label="Driving License" icon={IdCard} file={driverDL} setFile={setDriverDL} />
                    <FileUploadInput label="Gate Pass" icon={FileText} file={driverGatePass} setFile={setDriverGatePass} />
                    <FileUploadInput label="Training Card" icon={UploadCloud} file={driverTraining} setFile={setDriverTraining} />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                  {selectedVehicle?.driver ? 'Update Driver' : 'Save Driver & Upload'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Vehicle Documents Modal */}
        {isVehicleDocsModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsVehicleDocsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Vehicle Documents</h2>
              
              <form onSubmit={handleUpdateVehicleDocs} className="flex flex-col gap-4">
                <div className="mb-2">
                  <p className="block text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Upload Required Papers</p>
                  <div className="grid grid-cols-2 gap-3">
                    <FileUploadInput label="RC Book" icon={FileText} file={vehRC} setFile={setVehRC} />
                    <FileUploadInput label="Insurance" icon={ShieldCheck} file={vehInsurance} setFile={setVehInsurance} />
                    <FileUploadInput label="PUC" icon={Wind} file={vehPUC} setFile={setVehPUC} />
                    <FileUploadInput label="Permit" icon={FileSignature} file={vehPermit} setFile={setVehPermit} />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4">
                  Save & Upload Documents
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ================= RENDER DASHBOARD (MAIN VIEW) =================
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      <main className="pt-4 md:pt-6 px-4 md:px-8 pb-28 flex-grow flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Vehicle fitness</h1>
          <p className="text-gray-600">Monitor vehicle status, inspections, and maintenance</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            Loading vehicle records...
          </div>
        ) : (
          <>
            {(criticalCount > 0 || warningCount > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {criticalCount > 0 && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-700 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-red-700 font-semibold">CRITICAL STATUS</p>
                      <p className="text-sm text-gray-900">{criticalCount} vehicle(s) need immediate attention</p>
                    </div>
                  </div>
                )}
                {warningCount > 0 && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-amber-700 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-amber-700 font-semibold">EXPIRY WARNING</p>
                      <p className="text-sm text-gray-900">{warningCount} vehicle(s) require inspection soon</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredVehicles.map((vehicle) => {
                const isExpiringSoon = new Date(vehicle.inspectionExpiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                const statusConfig = {
                  excellent: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', icon: CheckCircle },
                  good: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', icon: CheckCircle },
                  warning: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', icon: AlertCircle },
                  critical: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: AlertTriangle },
                }
                const config = statusConfig[vehicle.status]
                const StatusIcon = config.icon

                return (
                  <div 
                    key={vehicle.id} 
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                    className={`cursor-pointer rounded-lg border-2 ${config.border} ${config.bg} p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 flex flex-col`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{vehicle.registrationNumber}</h3>
                        <p className={`text-xs font-semibold ${config.text}`}>{vehicle.type} • {vehicle.status.toUpperCase()}</p>
                      </div>
                      <StatusIcon className={`w-6 h-6 ${config.text}`} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Last Checked</p>
                        <p className="text-sm font-semibold text-gray-900">{new Date(vehicle.lastInspectionDate).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Fitness Until</p>
                        <p className={`text-sm font-semibold ${isExpiringSoon ? 'text-red-700' : 'text-gray-900'}`}>
                          {new Date(vehicle.inspectionExpiryDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-col gap-2 bg-white/50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" /> Vehicle Papers
                        </span>
                        {hasAllVehicleDocs(vehicle) ? (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Complete
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-600 flex items-center gap-1 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                        <span className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-blue-600" /> {vehicle.driver ? vehicle.driver.name : 'No Driver'}
                        </span>
                        {vehicle.driver ? (
                           hasDriverDocuments(vehicle.driver) ? (
                            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" /> Docs Uploaded
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 flex items-center gap-1 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" /> Docs Pending
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">Unassigned</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-semibold rounded-lg transition-colors">
                        View Full Details
                      </button>
                      <button 
                        onClick={(e) => handleUpdateCondition(e, vehicle.id)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Quick Update
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No vehicles found in database.</p>
              </div>
            )}
          </>
        )}

        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex gap-2">
              {(['all', 'LMV', 'HMV'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${filter === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {type === 'all' ? 'All Vehicles' : type}
                </button>
              ))}
            </div>
            <Button onClick={() => setIsVehicleModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 w-full md:w-auto">
              <Plus className="w-4 h-4" /> Add New Vehicle
            </Button>
          </div>
        </div>
      </main>

      {/* Add Vehicle Modal */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsVehicleModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Vehicle Details</h2>
            <form onSubmit={handleAddVehicle} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input type="text" value={newReg} onChange={(e) => setNewReg(e.target.value)} placeholder="DL-01-AB-1234" className="w-full border border-gray-300 rounded-lg p-2.5 uppercase outline-none" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select value={newType} onChange={(e) => setNewType(e.target.value as 'LMV' | 'HMV')} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none">
                    <option value="LMV">LMV</option>
                    <option value="HMV">HMV</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Checked Date</label>
                  <input type="date" value={lastCheckedDate} onChange={(e) => setLastCheckedDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Until</label>
                  <input type="date" value={newCheckedDate} onChange={(e) => setNewCheckedDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none" required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">Save Vehicle Details</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}