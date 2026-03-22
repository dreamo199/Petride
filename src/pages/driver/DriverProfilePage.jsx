import { useState, useEffect } from 'react';
import { User, Car, FileText, Star, CheckCircle, Upload, Loader2 } from 'lucide-react';
import { driverService } from '../../services/driver';
import { toast } from 'sonner';

function DriverProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    rating: 0, total_deliveries: 0, approvalStatus: '', driver_id: '',
  });
  const [vehicle, setVehicle] = useState({ vehicle_type: '', vehicle_number: '', vehicle_capacity: '' });
  const [documents, setDocuments] = useState([]);
  const [personalForm, setPersonalForm] = useState({ first_name: '', last_name: '', email: '', phone: '', license_number: '' });
  const [vehicleForm, setVehicleForm] = useState({ vehicle_type: '', vehicle_number: '', vehicle_capacity: '' });

  useEffect(() => { loadProfileData(); }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const user = await driverService.getDriverProfile();
      const dp = {
        first_name: user?.user?.first_name || '',
        last_name: user?.user?.last_name || '',
        email: user?.user?.email || '',
        phone: user?.user?.phone || '',
        rating: user?.rating || 0,
        total_deliveries: user?.total_deliveries || 0,
        approvalStatus: user?.approval_status || 'unknown',
        license_number: user?.license_number || '',
        driver_id: user?.driver_id || '',
      };
      const vd = {
        vehicle_type: user?.vehicle_type || '',
        vehicle_number: user?.vehicle_number || '',
        vehicle_capacity: user?.vehicle_capacity || '',
      };
      setProfile(dp);
      setVehicle(vd);
      setPersonalForm({ first_name: dp.first_name, last_name: dp.last_name, email: dp.email, phone: dp.phone, license_number: dp.license_number });
      setVehicleForm(vd);
      setDocuments([
        { id: '1', name: "Driver's License", status: 'verified', uploaded_date: '2024-01-15' },
        { id: '2', name: 'Vehicle Registration', status: 'verified', uploaded_date: '2024-01-15' },
        { id: '3', name: 'Insurance Certificate', status: 'pending', uploaded_date: '2024-02-01' },
      ]);
    } catch { toast.error('Failed to load profile'); }
    finally { setLoading(false); }
  };

  const handleSavePersonalInfo = async () => {
    try {
      setSaving(true);
      await driverService.updateProfile(personalForm);
      setProfile({ ...profile, ...personalForm });
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleSaveVehicleInfo = async () => {
    try {
      setSaving(true);
      await driverService.updateProfile(vehicleForm);
      setVehicle(vehicleForm);
      toast.success('Vehicle updated');
    } catch { toast.error('Failed to update vehicle'); }
    finally { setSaving(false); }
  };

  const getStatusStyle = (status) => ({
    verified: 'approved': { color: '#4ade80', border: 'rgba(74,222,128,0.2)', bg: 'rgba(74,222,128,0.06)' },
    pending: { color: '#facc15', border: 'rgba(250,204,21,0.2)', bg: 'rgba(250,204,21,0.06)' },
    rejected: { color: '#f87171', border: 'rgba(248,113,113,0.2)', bg: 'rgba(248,113,113,0.06)' },
  }[status] || { color: '#555', border: '#1a1a1a', bg: '#0d0d0d' });

  const inputClass = "font-switzer w-full h-11 rounded-xl px-4 text-white placeholder-[#333] outline-none transition-all";
  const inputStyle = { background: '#0d0d0d', border: '1px solid #1a1a1a' };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
        <p className="font-switzer text-[#555]">Loading profile...</p>
      </div>
    </div>
  );

  const statusStyle = getStatusStyle(profile.approvalStatus);

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'vehicle', label: 'Vehicle', icon: Car },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="font-technor font-black text-2xl sm:text-3xl text-white mb-1">Driver Profile</h1>
          <p className="font-switzer text-[#444] text-sm">Manage your profile, vehicle, and documents</p>
        </div>

        {/* Profile Hero Card */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
          style={{ background: '#080808', border: '1px solid #1a1a1a' }}>

          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage: 'radial-gradient(circle, #1e1e1e 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(242,253,125,0.2), transparent)' }} />
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 100% 0%, rgba(242,253,125,0.05), transparent 70%)' }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">

            {/* Avatar */}
            <div className="w-20 h-20 bg-[#f2fd7d] rounded-2xl flex items-center justify-center shrink-0">
              <span className="font-technor font-black text-2xl text-black">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="font-technor font-black text-2xl text-white">
                  {profile.first_name} {profile.last_name}
                </h2>
                <span className="font-switzer text-xs px-3 py-1 rounded-full font-semibold capitalize"
                  style={{ color: statusStyle.color, border: `1px solid ${statusStyle.border}`, background: statusStyle.bg }}>
                  {profile.approvalStatus}
                </span>
              </div>
              <p className="font-switzer text-[#444] text-sm mb-4">ID: {profile.driver_id}</p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#f2fd7d] fill-[#f2fd7d]" />
                  <span className="font-technor font-bold text-white">{Number(profile.rating).toFixed(1)}</span>
                  <span className="font-switzer text-[#444] text-xs">rating</span>
                </div>
                <div className="w-px h-4 self-center" style={{ background: '#1a1a1a' }} />
                <div>
                  <span className="font-technor font-bold text-white">{profile.total_deliveries}</span>
                  <span className="font-switzer text-[#444] text-xs ml-1.5">deliveries</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + Content */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>

          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid #111' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`font-switzer flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all ${
                  activeTab === id ? 'text-[#f2fd7d]' : 'text-[#333] hover:text-[#666]'
                }`}
                style={{ borderBottom: activeTab === id ? '2px solid #f2fd7d' : '2px solid transparent', marginBottom: '-1px' }}>
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* Personal Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-5">
                <h3 className="font-satoshi font-bold text-white">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', key: 'first_name', placeholder: 'John', required: true },
                    { label: 'Last Name', key: 'last_name', placeholder: 'Doe', required: true },
                    { label: 'Email Address', key: 'email', placeholder: 'your@email.com', type: 'email', required: true },
                    { label: 'Phone Number', key: 'phone', placeholder: '+234 000 000 0000', type: 'tel', required: true },
                    { label: 'License Number', key: 'license_number', placeholder: 'Your license number', required: true, span: true },
                  ].map(({ label, key, placeholder, type = 'text', required, span }) => (
                    <div key={key} className={span ? 'sm:col-span-2' : ''}>
                      <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
                        {label} {required && <span className="text-red-400">*</span>}
                      </label>
                      <input type={type} value={personalForm[key]}
                        onChange={(e) => setPersonalForm({ ...personalForm, [key]: e.target.value })}
                        placeholder={placeholder} className={inputClass} style={{ ...inputStyle }}
                        onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                        onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
                    </div>
                  ))}
                </div>
                <button onClick={handleSavePersonalInfo} disabled={saving}
                  className="font-switzer bg-[#f2fd7d] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Vehicle Tab */}
            {activeTab === 'vehicle' && (
              <div className="space-y-5">
                <h3 className="font-satoshi font-bold text-white">Vehicle Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Vehicle Type', key: 'vehicle_type', placeholder: 'e.g. Fuel Truck', required: true },
                    { label: 'Vehicle Number', key: 'vehicle_number', placeholder: 'e.g. LAG 234 XY', required: true },
                    { label: 'Capacity (Liters)', key: 'vehicle_capacity', placeholder: '500', type: 'number', required: true, span: true },
                  ].map(({ label, key, placeholder, type = 'text', required, span }) => (
                    <div key={key} className={span ? 'sm:col-span-2' : ''}>
                      <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
                        {label} {required && <span className="text-red-400">*</span>}
                      </label>
                      <input type={type} value={vehicleForm[key]}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, [key]: e.target.value })}
                        placeholder={placeholder} className={inputClass} style={{ ...inputStyle }}
                        onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                        onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
                    </div>
                  ))}
                </div>

                {/* Current vehicle summary */}
                {vehicle.vehicle_type && (
                  <div className="rounded-xl p-4" style={{ background: '#0d0d0d', border: '1px solid #111' }}>
                    <p className="font-switzer text-[#333] text-xs uppercase tracking-wider mb-3">Current Vehicle</p>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { label: 'Type', value: vehicle.vehicle_type },
                        { label: 'Plate', value: vehicle.vehicle_number },
                        { label: 'Capacity', value: `${vehicle.vehicle_capacity}L` },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="font-switzer text-[#333] text-xs">{label}</p>
                          <p className="font-satoshi font-semibold text-white text-sm capitalize">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={handleSaveVehicleInfo} disabled={saving}
                  className="font-switzer bg-[#f2fd7d] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Updating...' : 'Update Vehicle'}
                </button>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-satoshi font-bold text-white">Documents</h3>
                  <button className="font-switzer bg-[#f2fd7d] text-black font-bold py-2 px-5 rounded-xl text-sm hover:opacity-90 transition-all inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => {
                    const ds = getStatusStyle(doc.status);
                    return (
                      <div key={doc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl transition-all"
                        style={{ background: '#0d0d0d', border: '1px solid #111' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#1a1a1a'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#111'}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'rgba(242,253,125,0.08)', border: '1px solid rgba(242,253,125,0.1)' }}>
                            <FileText className="w-6 h-6 text-[#f2fd7d]" />
                          </div>
                          <div>
                            <p className="font-satoshi font-bold text-white mb-0.5">{doc.name}</p>
                            <p className="font-switzer text-[#333] text-xs">
                              Uploaded {new Date(doc.uploaded_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="font-switzer text-xs px-3 py-1 rounded-full font-semibold capitalize"
                            style={{ color: ds.color, border: `1px solid ${ds.border}`, background: ds.bg }}>
                            {doc.status === 'verified' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                            {doc.status}
                          </span>
                          <button className="font-switzer text-[#444] hover:text-white text-sm transition-colors font-medium px-3 py-1.5 rounded-lg"
                            style={{ border: '1px solid #1a1a1a' }}>
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {documents.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: '#0d0d0d', border: '1px solid #111' }}>
                        <FileText className="w-8 h-8 text-[#2a2a2a]" />
                      </div>
                      <p className="font-satoshi text-white font-semibold mb-1">No documents yet</p>
                      <p className="font-switzer text-[#333] text-sm mb-4">Upload your documents to get verified</p>
                      <button className="font-switzer bg-[#f2fd7d] text-black font-bold py-2.5 px-6 rounded-xl text-sm hover:opacity-90 transition-all inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Upload Document
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverProfilePage;