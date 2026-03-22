import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, User, Truck, Eye, EyeOff, Loader2, CheckCircle2, Car, FileText } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/auth";

const inputClass = "font-switzer w-full h-11 rounded-xl px-4 text-white placeholder-[#333] outline-none transition-all disabled:opacity-50 text-sm";
const inputStyle = { background: '#0d0d0d', border: '1px solid #1a1a1a' };

function Input({ label, required, ...props }) {
  return (
    <div>
      {label && (
        <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        {...props}
        required={required}
        className={inputClass}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = '#f2fd7d'}
        onBlur={e => e.target.style.borderColor = '#1a1a1a'}
      />
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    username: "", first_name: "", last_name: "",
    email: "", phone: "", password: "", password2: "",
    address: "", license_number: "", vehicle_number: "",
    vehicle_type: "", vehicle_capacity: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // For drivers: step 1 = personal, step 2 = vehicle
  // For customers: single step
  const totalSteps = userType === 'driver' ? 2 : 1;

  const validateStep1 = () => {
    if (!formData.first_name || !formData.last_name || !formData.username || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields'); return false;
    }
    if (!formData.email.includes('@')) { toast.error('Please enter a valid email'); return false; }
    if (!formData.password || formData.password.length < 8) { toast.error('Password must be at least 8 characters'); return false; }
    if (formData.password !== formData.password2) { toast.error('Passwords do not match'); return false; }
    if (userType === 'customer' && !formData.address) { toast.error('Please enter your address'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.license_number || !formData.vehicle_number || !formData.vehicle_type || !formData.vehicle_capacity) {
      toast.error('Please fill in all vehicle information'); return false;
    }
    if (!agreed) { toast.error('Please agree to the terms & conditions'); return false; }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userType === 'driver') {
      if (!validateStep2()) return;
    } else {
      if (!validateStep1()) return;
      if (!agreed) { toast.error('Please agree to the terms & conditions'); return; }
    }

    setLoading(true);

    const payload = userType === 'driver' ? formData : {
      username: formData.username, first_name: formData.first_name,
      last_name: formData.last_name, email: formData.email,
      phone: formData.phone, address: formData.address,
      password: formData.password, password2: formData.password2,
    };

    try {
      if (userType === 'customer') {
        await authService.registerCustomer(payload);
      } else {
        await authService.registerDriver(payload);
      }
      toast.success('Account created successfully!');
      navigate('/signin', { replace: true });
    } catch (error) {
      const errorData = error.response?.data;
      let msg = 'Registration failed. Please try again.';
      if (typeof errorData === 'object') {
        const first = Object.values(errorData)[0];
        if (Array.isArray(first)) msg = first[0];
        else if (typeof first === 'string') msg = first;
        else if (errorData.detail) msg = errorData.detail;
        else if (errorData.message) msg = errorData.message;
      } else if (typeof errorData === 'string') msg = errorData;
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const stepLabels = ['Personal Info', 'Vehicle Info'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12"
      style={{
        backgroundColor: '#000',
        backgroundImage: 'radial-gradient(circle, #181818 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}>
      <div className="w-full max-w-[520px]">

        {/* Back */}
        <Link to="/"
          className="font-switzer inline-flex items-center gap-2 text-[#444] hover:text-white mb-8 transition-colors group text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>

          {/* Top glow */}
          <div className="h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(242,253,125,0.3), transparent)' }} />

          <div className="p-7 sm:p-8">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-[#f2fd7d] rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-black" strokeWidth={2.5} />
                </div>
                <span className="font-technor font-bold text-lg text-white">PetRide</span>
              </div>
              <h1 className="font-technor font-black text-3xl text-white mb-1">Create Account</h1>
              <p className="font-switzer text-[#444] text-sm">Join PetRide and start ordering fuel today</p>
            </div>

            {/* Role toggle — only on step 1 */}
            {step === 1 && (
              <div className="mb-6">
                <p className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-3">
                  I want to sign up as
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'customer', label: 'Customer', icon: User },
                    { type: 'driver', label: 'Driver', icon: Truck },
                  ].map(({ type, label, icon: Icon }) => (
                    <button key={type} type="button"
                      onClick={() => { setUserType(type); setStep(1); }}
                      className="h-12 rounded-xl flex items-center justify-center gap-2.5 font-switzer text-sm font-medium transition-all"
                      style={{
                        background: userType === type ? 'rgba(242,253,125,0.08)' : '#0d0d0d',
                        border: `1px solid ${userType === type ? '#f2fd7d' : '#1a1a1a'}`,
                        color: userType === type ? '#fff' : '#444',
                      }}>
                      <Icon size={16} style={{ color: userType === type ? '#f2fd7d' : '#444' }} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stepper — drivers only */}
            {userType === 'driver' && (
              <div className="mb-7">
                <div className="flex items-center gap-0 max-w-xs">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 relative ${
                          step > s ? 'bg-[#f2fd7d] text-black' :
                          step === s ? 'bg-[#f2fd7d] text-black ring-4 ring-[#f2fd7d]/20' :
                          'text-[#555]'
                        }`}
                        style={step <= s && step !== s ? { background: '#111', border: '1px solid #222' } : {}}>
                          {step > s ? <CheckCircle2 size={14} /> : s}
                        </div>
                        <span className={`absolute -bottom-5 text-[10px] whitespace-nowrap font-switzer ${step >= s ? 'text-[#888]' : 'text-[#333]'}`}>
                          {stepLabels[s - 1]}
                        </span>
                      </div>
                      {s < 2 && (
                        <div className="flex-1 h-px mx-2 mb-5 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
                          <div className="h-full bg-[#f2fd7d] transition-all duration-500"
                            style={{ width: step > s ? '100%' : '0%' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <form onSubmit={userType === 'customer' ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}
                className="space-y-4 mt-8">

                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" name="first_name" placeholder="John"
                    value={formData.first_name} onChange={handleChange} required disabled={loading} />
                  <Input label="Last Name" name="last_name" placeholder="Doe"
                    value={formData.last_name} onChange={handleChange} required disabled={loading} />
                </div>

                <Input label="Username" name="username" placeholder="johndoe"
                  value={formData.username} onChange={handleChange} required disabled={loading} />

                <Input label="Email" type="email" name="email" placeholder="john@email.com"
                  value={formData.email} onChange={handleChange} required disabled={loading} />

                <Input label="Phone" type="tel" name="phone" placeholder="+234 800 123 4567"
                  value={formData.phone} onChange={handleChange} required disabled={loading} />

                {userType === 'customer' && (
                  <Input label="Home Address" name="address" placeholder="123 Main Street, Lagos"
                    value={formData.address} onChange={handleChange} required disabled={loading} />
                )}

                {/* Password */}
                <div className="pt-3 space-y-4" style={{ borderTop: '1px solid #111' }}>
                  <div>
                    <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password"
                        placeholder="Min. 8 characters" value={formData.password}
                        onChange={handleChange} required disabled={loading}
                        className={inputClass} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                        onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors">
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
                      Confirm Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input type={showPassword2 ? "text" : "password"} name="password2"
                        placeholder="Re-enter password" value={formData.password2}
                        onChange={handleChange} required disabled={loading}
                        className={inputClass} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                        onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
                      <button type="button" onClick={() => setShowPassword2(!showPassword2)} disabled={loading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors">
                        {showPassword2 ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms — customers only on step 1 */}
                {userType === 'customer' && (
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <input type="checkbox" checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 accent-[#f2fd7d] cursor-pointer shrink-0" disabled={loading} />
                    <span className="font-switzer text-[#444] text-sm">
                      I agree to the{' '}
                      <button type="button" className="text-[#f2fd7d] hover:underline">Terms</button>
                      {' '}and{' '}
                      <button type="button" className="text-[#f2fd7d] hover:underline">Privacy Policy</button>
                    </span>
                  </label>
                )}

                <button type="submit" disabled={loading || (userType === 'customer' && !agreed)}
                  className="font-switzer w-full h-12 bg-[#f2fd7d] text-black rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
                  {loading && userType === 'customer' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {userType === 'driver' ? (
                    <><span>Continue</span><ArrowRight size={16} /></>
                  ) : (
                    loading ? 'Creating Account...' : 'Create Account'
                  )}
                </button>

                <div className="pt-4" style={{ borderTop: '1px solid #111' }}>
                  <p className="font-switzer text-[#444] text-sm text-center">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-[#f2fd7d] font-semibold hover:underline">Sign in</Link>
                  </p>
                </div>
              </form>
            )}

            {/* ── STEP 2: Driver / Vehicle Info ── */}
            {step === 2 && userType === 'driver' && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-8">

                {/* Section label */}
                <div className="flex items-center gap-3 mb-2 pb-4" style={{ borderBottom: '1px solid #111' }}>
                  <div className="w-9 h-9 rounded-xl bg-[#f2fd7d]/10 flex items-center justify-center">
                    <Car size={18} className="text-[#f2fd7d]" />
                  </div>
                  <div>
                    <p className="font-satoshi font-bold text-white text-sm">Vehicle Information</p>
                    <p className="font-switzer text-[#444] text-xs">Tell us about your delivery vehicle</p>
                  </div>
                </div>

                <Input label="License Number" name="license_number" placeholder="ABC123456"
                  value={formData.license_number} onChange={handleChange} required disabled={loading} />

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Vehicle Type" name="vehicle_type" placeholder="e.g. Fuel Truck"
                    value={formData.vehicle_type} onChange={handleChange} required disabled={loading} />
                  <Input label="Vehicle Number" name="vehicle_number" placeholder="LAG 123 XY"
                    value={formData.vehicle_number} onChange={handleChange} required disabled={loading} />
                </div>

                <div>
                  <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
                    Capacity (Liters) <span className="text-red-400">*</span>
                  </label>
                  <input type="number" name="vehicle_capacity" placeholder="1000"
                    value={formData.vehicle_capacity} onChange={handleChange}
                    required disabled={loading}
                    className={inputClass} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                    onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input type="checkbox" checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-[#f2fd7d] cursor-pointer shrink-0" disabled={loading} />
                  <span className="font-switzer text-[#444] text-sm">
                    I agree to the{' '}
                    <button type="button" className="text-[#f2fd7d] hover:underline">Terms</button>
                    {' '}and{' '}
                    <button type="button" className="text-[#f2fd7d] hover:underline">Privacy Policy</button>
                  </span>
                </label>

                {/* Actions */}
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="font-switzer flex items-center gap-2 px-5 h-12 rounded-xl text-sm font-medium text-[#555] hover:text-white transition-all"
                    style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button type="submit" disabled={loading || !agreed}
                    className="font-switzer flex-1 h-12 bg-[#f2fd7d] text-black rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : 'Create Account'}
                  </button>
                </div>

                <div className="pt-4" style={{ borderTop: '1px solid #111' }}>
                  <p className="font-switzer text-[#444] text-sm text-center">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-[#f2fd7d] font-semibold hover:underline">Sign in</Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="font-switzer text-center text-[#2a2a2a] text-xs mt-6">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
}

export default SignupPage;