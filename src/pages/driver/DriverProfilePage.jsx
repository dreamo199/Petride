import { useState, useEffect } from 'react';
import { User, Car, FileText, Settings, Mail, Phone, MapPin, Star, Award, CheckCircle, Upload, Camera, Loader2, Edit } from 'lucide-react';
import { driverService } from '../../services/driver';
import { toast } from 'sonner';

function DriverProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    rating: 0,
    total_deliveries: 0,
    approvalStatus: '',
    driver_id: '',
  });

  const [vehicle, setVehicle] = useState({
    vehicle_type: '',
    vehicle_number: '',
    vehicle_capacity: '',
  });

  const [documents, setDocuments] = useState([]);

  const [personalForm, setPersonalForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    license_number: '',
  });

  const [vehicleForm, setVehicleForm] = useState({
    vehicle_type: '',
    vehicle_number: '',
    vehicle_capacity: '',
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      const user = await driverService.getDriverProfile();

      const driverProfile = {
        first_name: user?.user?.first_name,
        last_name: user?.user?.last_name,
        email: user?.user?.email || '',
        phone: user?.user?.phone || '',
        rating: user?.rating || 0,
        total_deliveries: user.total_deliveries || 0,
        approvalStatus: user.approval_status || 'Unknown',
        license_number: user?.license_number || 'Unknown',
        driver_id: user?.driver_id || 'Unknown',
      };

      const vehicleData = {
        vehicle_type: user?.vehicle_type || 'Unknown',
        vehicle_number: user?.vehicle_number || 'Unknown',
        vehicle_capacity: user?.vehicle_capacity || 'Unknown',
      };

      const mockDocuments = [
        { id: '1', name: "Driver's License", status: 'verified', uploaded_date: '2024-01-15' },
        { id: '2', name: 'Vehicle Registration', status: 'verified', uploaded_date: '2024-01-15' },
        { id: '3', name: 'Insurance Certificate', status: 'pending', uploaded_date: '2024-02-01' },
      ];

      console.log(user);
      setProfile(driverProfile);
      setVehicle(vehicleData);
      setDocuments(mockDocuments);
      
      setPersonalForm({
        first_name: driverProfile.first_name,
        last_name: driverProfile.last_name,
        email: driverProfile.email,
        phone: driverProfile.phone,
        license_number: driverProfile.license_number,
      });

      setVehicleForm(vehicleData);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonalInfo = async () => {
    try {
      setSaving(true);
      await driverService.updateProfile(personalForm);
      setProfile({ ...profile, ...personalForm });
      console.log(personalForm );
      toast.success('Personal information updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVehicleInfo = async () => {
    try {
      setSaving(true);
      await driverService.updateProfile(vehicleForm); 
      setVehicle(vehicleForm);
      toast.success('Vehicle information updated successfully');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Failed to update vehicle information');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#f2fd7d] animate-spin mx-auto mb-4" />
          <p className="text-[#b2beb5]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'vehicle', label: 'Vehicle', icon: Car },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc] mb-2">
            Driver Profile
          </h1>
          <p className="font-['Manrope',sans-serif] text-[#b2beb5]">
            Manage your profile, vehicle, and documents
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-[#f2fd7d]/10 to-[#0a0a0a] border border-[#343434] rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-[#f2fd7d] to-[#e8f171] rounded-full flex items-center justify-center shadow-lg">
                <User className="w-14 h-14 text-black" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-['Inter',sans-serif] font-bold text-3xl text-[#fcfcfc]">
                  {profile.first_name} {profile.last_name}
                </h2>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(profile.approvalStatus)}`}>
                    {profile.approvalStatus.charAt(0).toUpperCase() + profile.approvalStatus.slice(1)}
                  </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-[#b2beb5] mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{profile.driver_id}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#f2fd7d]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#fcfcfc]">{profile.rating}</p>
                    <p className="text-xs text-[#b2beb5]">Rating</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#f2fd7d]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#fcfcfc]">{profile.total_deliveries}</p>
                    <p className="text-xs text-[#b2beb5]">Deliveries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#343434] overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap border-b-2
                    ${activeTab === tab.id
                      ? 'text-[#f2fd7d] border-[#f2fd7d] bg-[#f2fd7d]/5'
                      : 'text-[#b2beb5] border-transparent hover:text-[#fcfcfc] hover:bg-[#141414]'
                    }
                  `}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-[#f2fd7d]" />
                  <h3 className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
                    Personal Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[#b2beb5] text-sm font-medium mb-2 block">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={personalForm.first_name}
                      onChange={(e) => setPersonalForm({ ...personalForm, first_name: e.target.value })}
                      className="w-full h-12 bg-[#141414] border border-[#343434] rounded-xl px-4 text-[#fcfcfc] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="text-[#b2beb5] text-sm font-medium mb-2 block">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={personalForm.last_name}
                      onChange={(e) => setPersonalForm({ ...personalForm, last_name: e.target.value })}
                      className="w-full h-12 bg-[#141414] border border-[#343434] rounded-xl px-4 text-[#fcfcfc] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label className="text-[#b2beb5] text-sm font-medium mb-2 block">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={personalForm.email}
                      onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                      className="w-full h-12 bg-[#141414] border border-[#343434] rounded-xl px-4 text-[#fcfcfc] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-[#b2beb5] text-sm font-medium mb-2 block">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={personalForm.phone}
                      onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                      className="w-full h-12 bg-[#141414] border border-[#343434] rounded-xl px-4 text-[#fcfcfc] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      placeholder="+234 000 000 0000"
                    />
                  </div>

                  <div>
                    <label className="text-[#b2beb5] text-sm font-medium mb-2 block">
                      License Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={personalForm.license_number}
                      onChange={(e) => setPersonalForm({ ...personalForm, license_number: e.target.value })}
                      className="w-full h-12 bg-[#141414] border border-[#343434] rounded-xl px-4 text-[#fcfcfc] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      placeholder="Your license number"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSavePersonalInfo}
                  disabled={saving}
                  className="bg-[#f2fd7d] text-black hover:bg-[#e8f171] font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}

            {/* Vehicle Information */}
            {activeTab === 'vehicle' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Car className="w-6 h-6 text-[#f2fd7d]" />
                  <h3 className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
                    Vehicle Information
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[#b2beb5] text-sm font-medium mb-2 block">
                      Vehicle Type <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={vehicleForm.vehicle_type}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_type: e.target.value })}
                      className="w-full h-12 bg-[#141414] border border-[#343434] rounded-xl px-4 text-[#fcfcfc] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      placeholder="e.g., Fuel Truck"
                    />
                  </div>

                  <div>
                    <label className="text-[#b2beb5] text-sm font-medium mb-2 block">
                      Vehicle Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={vehicleForm.vehicle_number}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_number: e.target.value })}
                      className="w-full h-12 bg-[#141414] border border-[#343434] rounded-xl px-4 text-[#fcfcfc] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      placeholder="e.g., LAG 234 XY"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[#b2beb5] text-sm font-medium mb-2 block">
                      Capacity (Liters) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={vehicleForm.vehicle_capacity}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_capacity: e.target.value })}
                      className="w-full h-12 bg-[#141414] border border-[#343434] rounded-xl px-4 text-[#fcfcfc] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      placeholder="500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveVehicleInfo}
                  disabled={saving}
                  className="bg-[#f2fd7d] text-black hover:bg-[#e8f171] font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Vehicle'
                  )}
                </button>
              </div>
            )}

            {/* Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-[#f2fd7d]" />
                    <h3 className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
                      Documents
                    </h3>
                  </div>
                  <button className="bg-[#f2fd7d] text-black hover:bg-[#e8f171] font-semibold py-2 px-6 rounded-xl transition-all inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>
                </div>

                <div className="space-y-4">
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-[#141414] border border-[#343434] rounded-xl p-6 flex items-center justify-between hover:border-[#f2fd7d]/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-[#f2fd7d]/10 rounded-xl flex items-center justify-center">
                            <FileText className="w-7 h-7 text-[#f2fd7d]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#fcfcfc] text-lg mb-1">{doc.name}</p>
                            <p className="text-sm text-[#b2beb5]">
                              Uploaded: {new Date(doc.uploaded_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(doc.status)}`}>
                            {doc.status === 'verified' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                          <button className="border border-[#343434] text-[#fcfcfc] hover:bg-[#141414] hover:border-[#f2fd7d] py-2 px-4 rounded-xl font-medium transition-all">
                            View
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <FileText className="w-16 h-16 text-[#343434] mx-auto mb-4" />
                      <p className="text-[#b2beb5] mb-4">No documents uploaded yet</p>
                      <button className="bg-[#f2fd7d] text-black hover:bg-[#e8f171] font-semibold py-3 px-6 rounded-xl transition-all inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Your First Document
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