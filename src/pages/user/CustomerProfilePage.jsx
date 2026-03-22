import { useState, useEffect } from 'react';
import { User, MapPin, Bell, Lock, Eye, EyeOff, Loader2, } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../services/auth';

function CustomerProfilePage() {
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

  // Replace the return block with:
return (
  <div className="p-4 sm:p-6 pb-24 lg:pb-6">
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="font-technor font-black text-2xl sm:text-3xl text-white mb-1">Profile Settings</h1>
        <p className="font-switzer text-[#444] text-sm">Manage your account information and preferences</p>
      </div>

      {/* Tab + Content Card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid #111' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`font-switzer flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all ${
                activeTab === id
                  ? 'text-[#f2fd7d] border-b-2 border-[#f2fd7d]'
                  : 'text-[#444] hover:text-[#888]'
              }`}
              style={{ marginBottom: activeTab === id ? '-1px' : '0' }}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* Personal Info */}
          {activeTab === 'personal' && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', field: 'first_name', placeholder: 'John', required: true },
                  { label: 'Last Name', field: 'last_name', placeholder: 'Doe', required: true },
                ].map(({ label, field, placeholder, required }) => (
                  <div key={field}>
                    <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
                      {label} {required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      value={formData[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={placeholder}
                      disabled={savingProfile}
                      className="font-switzer w-full h-11 rounded-xl px-4 text-white placeholder-[#333] outline-none transition-all disabled:opacity-50"
                      style={{ background: '#111', border: '1px solid #1a1a1a' }}
                      onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                      onBlur={e => e.target.style.borderColor = '#1a1a1a'}
                    />
                  </div>
                ))}

                <div>
                  <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">Username</label>
                  <input value={formData.username} disabled
                    className="font-switzer w-full h-11 rounded-xl px-4 text-[#333] cursor-not-allowed"
                    style={{ background: '#0d0d0d', border: '1px solid #111' }} />
                  <p className="font-switzer text-[#333] text-xs mt-1">Username cannot be changed</p>
                </div>

                <div>
                  <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input type="email" value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={savingProfile}
                    className="font-switzer w-full h-11 rounded-xl px-4 text-white placeholder-[#333] outline-none transition-all disabled:opacity-50"
                    style={{ background: '#111', border: '1px solid #1a1a1a' }}
                    onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                    onBlur={e => e.target.style.borderColor = '#1a1a1a'}
                  />
                </div>

                <div>
                  <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">Phone</label>
                  <input type="tel" value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+234 800 123 4567" disabled={savingProfile}
                    className="font-switzer w-full h-11 rounded-xl px-4 text-white placeholder-[#333] outline-none transition-all disabled:opacity-50"
                    style={{ background: '#111', border: '1px solid #1a1a1a' }}
                    onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                    onBlur={e => e.target.style.borderColor = '#1a1a1a'}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">Home Address</label>
                  <input value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main St, Lagos, Nigeria" disabled={savingProfile}
                    className="font-switzer w-full h-11 rounded-xl px-4 text-white placeholder-[#333] outline-none transition-all disabled:opacity-50"
                    style={{ background: '#111', border: '1px solid #1a1a1a' }}
                    onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                    onBlur={e => e.target.style.borderColor = '#1a1a1a'}
                  />
                </div>
              </div>

              <button onClick={handleSaveProfile} disabled={savingProfile}
                className="font-switzer bg-[#f2fd7d] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-2">
                {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h3 className="font-satoshi font-bold text-white">Notification Preferences</h3>
              <div className="space-y-1">
                {[
                  { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'smsNotifications', title: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                  { key: 'orderUpdates', title: 'Order Updates', desc: 'Get notified about your order status' },
                  { key: 'promotions', title: 'Promotions & Offers', desc: 'Receive promotional offers and deals' },
                ].map((item) => (
                  <div key={item.key}
                    className="flex items-center justify-between py-4 transition-colors"
                    style={{ borderBottom: '1px solid #111' }}
                  >
                    <div>
                      <p className="font-satoshi font-semibold text-white text-sm mb-0.5">{item.title}</p>
                      <p className="font-switzer text-[#444] text-xs">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" checked={notifications[item.key]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="sr-only peer" disabled={savingNotifications} />
                      <div className="w-11 h-6 bg-[#1a1a1a] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f2fd7d]" />
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={handleSaveNotifications} disabled={savingNotifications}
                className="font-switzer bg-[#f2fd7d] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-2">
                {savingNotifications && <Loader2 className="w-4 h-4 animate-spin" />}
                {savingNotifications ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="font-satoshi font-bold text-white">Change Password</h3>
              <div className="space-y-4">
                {[
                  { key: 'current', label: 'Current Password', name: 'current_password' },
                  { key: 'new', label: 'New Password', name: 'new_password' },
                  { key: 'confirm', label: 'Confirm New Password', name: 'confirm_password' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
                      {field.label} <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords[field.key] ? 'text' : 'password'}
                        value={passwordData[field.name]}
                        onChange={(e) => setPasswordData({ ...passwordData, [field.name]: e.target.value })}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        disabled={savingPassword}
                        className="font-switzer w-full h-11 rounded-xl px-4 pr-12 text-white placeholder-[#333] outline-none transition-all disabled:opacity-50"
                        style={{ background: '#111', border: '1px solid #1a1a1a' }}
                        onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                        onBlur={e => e.target.style.borderColor = '#1a1a1a'}
                      />
                      <button type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, [field.key]: !showPasswords[field.key] })}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors">
                        {showPasswords[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4" style={{ background: '#0d0d0d', border: '1px solid #111' }}>
                <p className="font-satoshi text-sm text-white font-semibold mb-2">Requirements</p>
                <ul className="font-switzer text-xs text-[#444] space-y-1">
                  <li>· At least 8 characters long</li>
                  <li>· Different from your current password</li>
                </ul>
              </div>

              <button onClick={handleUpdatePassword} disabled={savingPassword}
                className="font-switzer bg-[#f2fd7d] text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 inline-flex items-center gap-2">
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