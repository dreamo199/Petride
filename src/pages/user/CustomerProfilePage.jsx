import { useState, useEffect } from 'react';
import { User, MapPin, Bell, Lock, Eye, EyeOff, Loader2, } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../services/auth';

export function CustomerProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
    address: '',
    customer_id: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getUserProfile();
        console.log('Fetched user profile:', currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        toast.error('Failed to load user profile');
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const userData = {
        first_name: user.user?.first_name || '',
        last_name: user.user?.last_name || '',
        email: user.user?.email || '',
        phone: user.user?.phone || '',
        username: user.user?.username || '',
        address: user.address || '',
        customer_id: user.customer_id || '',
      };
      
      setFormData(userData);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSavingProfile(true);
    try {
      console.log('Sending updated fields:', formData);
      await authService.updateCurrentUser(formData);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Validation
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (passwordData.new_password === passwordData.current_password) {
      toast.error('New password must be different from current password');
      return;
    }

    setSavingPassword(true);
    try {
      const payload = {
        old_password: passwordData.current_password,
        new_password: passwordData.new_password,
      };

      console.log('Updating password...');
      
      // TODO: Replace with actual API call
      // await authService.updatePassword(payload);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password updated successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (error) {
      console.error('Failed to update password:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          'Failed to update password. Please check your current password.';
      toast.error(errorMessage);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      console.log('Saving notification preferences:', notifications);
      
      // TODO: Replace with actual API call
      // await userService.updateNotificationPreferences(notifications);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Notification preferences saved!');
    } catch (error) {
      console.error('Failed to save notifications:', error);
      toast.error('Failed to save notification preferences');
    } finally {
      setSavingNotifications(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-['Inter',sans-serif] font-bold text-2xl sm:text-3xl text-[#fcfcfc] mb-2">
            Profile Settings
          </h1>
          <p className="text-[#888]">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-[#f2fd7d]/10 to-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#f2fd7d] to-[#d4e157] rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-black">
                {formData.first_name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc] mb-1">
                {formData.first_name} {formData.last_name}
              </h2>
              <p className="text-[#888]">{formData.email}</p> <p className="text-[#888]">{formData.customer_id}</p>
              <p className="text-[#555] text-sm mt-1">
                @{formData.username} • Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#1f1f1f] overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-[#f2fd7d] border-b-2 border-[#f2fd7d] bg-[#f2fd7d]/5'
                    : 'text-[#888] hover:text-[#fcfcfc] hover:bg-[#111]'
                  }
                `}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc]">
                  Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#888] text-xs font-medium mb-2 block">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      disabled={savingProfile}
                    />
                  </div>

                  <div>
                    <label className="text-[#888] text-xs font-medium mb-2 block">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      disabled={savingProfile}
                    />
                  </div>

                  <div>
                    <label className="text-[#888] text-xs font-medium mb-2 block">
                      Username
                    </label>
                    <input
                      value={formData.username}
                      disabled
                      className="w-full h-11 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 text-[#555] cursor-not-allowed"
                    />
                    <p className="text-[#555] text-xs mt-1">Username cannot be changed</p>
                  </div>

                  <div>
                    <label className="text-[#888] text-xs font-medium mb-2 block">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      disabled={savingProfile}
                    />
                  </div>

                  <div>
                    <label className="text-[#888] text-xs font-medium mb-2 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+234 800 123 4567"
                      className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      disabled={savingProfile}
                    />
                  </div>

                  <div>
                    <label className="text-[#888] text-xs font-medium mb-2 block">
                      Home Address
                    </label>
                    <input
                      type="tel"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main St, Lagos, Nigeria"
                      className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                      disabled={savingProfile}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="bg-[#f2fd7d] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc]">
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'smsNotifications', title: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                    { key: 'orderUpdates', title: 'Order Updates', desc: 'Get notified about your order status' },
                    { key: 'promotions', title: 'Promotions & Offers', desc: 'Receive promotional offers and deals' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-4 border-b border-[#1f1f1f] last:border-0"
                    >
                      <div>
                        <p className="font-medium text-[#fcfcfc] mb-1">{item.title}</p>
                        <p className="text-sm text-[#888]">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                          disabled={savingNotifications}
                        />
                        <div className="w-11 h-6 bg-[#1f1f1f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2fd7d]"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveNotifications}
                  disabled={savingNotifications}
                  className="bg-[#f2fd7d] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {savingNotifications && <Loader2 className="w-4 h-4 animate-spin" />}
                  {savingNotifications ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="font-['Inter',sans-serif] font-bold text-xl text-[#fcfcfc]">
                  Change Password
                </h3>

                <div className="space-y-4">
                  {[
                    { key: 'current', label: 'Current Password', name: 'current_password' },
                    { key: 'new', label: 'New Password', name: 'new_password' },
                    { key: 'confirm', label: 'Confirm New Password', name: 'confirm_password' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-[#888] text-xs font-medium mb-2 block">
                        {field.label} <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords[field.key] ? 'text' : 'password'}
                          value={passwordData[field.name]}
                          onChange={(e) => setPasswordData({ ...passwordData, [field.name]: e.target.value })}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 pr-12 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                          disabled={savingPassword}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, [field.key]: !showPasswords[field.key] })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
                          disabled={savingPassword}
                        >
                          {showPasswords[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
                  <p className="text-sm text-[#888]">
                    <strong className="text-[#fcfcfc]">Password requirements:</strong>
                  </p>
                  <ul className="text-sm text-[#888] mt-2 space-y-1 list-disc list-inside">
                    <li>At least 8 characters long</li>
                    <li>Different from your current password</li>
                  </ul>
                </div>

                <button
                  onClick={handleUpdatePassword}
                  disabled={savingPassword}
                  className="bg-[#f2fd7d] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfilePage;