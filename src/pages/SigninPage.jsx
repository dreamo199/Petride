import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Truck, Loader2, Eye, EyeOff, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

function SigninPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userRole, setUserRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const response = await login(formData.username, formData.password);
      toast.success('Welcome back!');
      const role = response?.user?.role || response?.role || userRole;
      navigate(role === 'customer' ? '/customer' : role === 'driver' ? '/driver' : '/customer', { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Login failed. Please check your credentials.'
      );
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex"
      style={{
        backgroundColor: '#000',
        backgroundImage: 'radial-gradient(circle, #181818 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}>

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12 relative overflow-hidden"
        style={{ background: '#080808', borderRight: '1px solid #111' }}>

        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(242,253,125,0.4), transparent)' }} />

        {/* Radial accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(242,253,125,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-[#f2fd7d] rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-technor font-bold text-xl text-white">PetRide</span>
          </div>

          <div>
            <span className="font-switzer text-[#f2fd7d] text-xs tracking-[0.2em] uppercase font-semibold block mb-4">
              Welcome back
            </span>
            <h2 className="font-technor font-black text-5xl text-white leading-none mb-6">
              FUEL<br />
              <span style={{ WebkitTextStroke: '1px #333', color: 'transparent' }}>AWAITS</span>
            </h2>
            <p className="font-switzer text-[#444] text-sm leading-relaxed">
              Sign in to order fuel, track deliveries, and manage your account.
            </p>
          </div>
        </div>

        {/* Bottom stat */}
        <div className="relative z-10 flex items-center gap-6 pt-8" style={{ borderTop: '1px solid #111' }}>
          {[
            { value: '1,200+', label: 'Customers' },
            { value: '350+', label: 'Drivers' },
            { value: '99.8%', label: 'Success rate' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-technor font-bold text-lg text-white">{value}</p>
              <p className="font-switzer text-[#333] text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px]">

          {/* Back */}
          <Link to="/"
            className="font-switzer inline-flex items-center gap-2 text-[#444] hover:text-white mb-10 transition-colors group text-sm">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#f2fd7d] rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-technor font-bold text-lg text-white">PetRide</span>
          </div>

          <div className="mb-8">
            <h1 className="font-technor font-black text-3xl text-white mb-2">Sign in</h1>
            <p className="font-switzer text-[#444] text-sm">Enter your credentials to continue</p>
          </div>

          {/* Role toggle */}
          <div className="mb-6">
            <p className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-3">Sign in as</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: 'customer', label: 'Customer', icon: User },
                { role: 'driver', label: 'Driver', icon: Truck },
              ].map(({ role, label, icon: Icon }) => (
                <button key={role} type="button" onClick={() => setUserRole(role)}
                  className="h-12 rounded-xl flex items-center justify-center gap-2.5 font-switzer text-sm font-medium transition-all"
                  style={{
                    background: userRole === role ? 'rgba(242,253,125,0.08)' : '#0d0d0d',
                    border: `1px solid ${userRole === role ? '#f2fd7d' : '#1a1a1a'}`,
                    color: userRole === role ? '#fff' : '#444',
                  }}>
                  <Icon size={16} style={{ color: userRole === role ? '#f2fd7d' : '#444' }} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium mb-2 block">
                Username
              </label>
              <input
                type="text" name="username" placeholder="Enter your username"
                value={formData.username} onChange={handleChange}
                required disabled={loading}
                className="font-switzer w-full h-11 rounded-xl px-4 text-white placeholder-[#333] outline-none transition-all disabled:opacity-50"
                style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}
                onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                onBlur={e => e.target.style.borderColor = '#1a1a1a'}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-switzer text-[#444] text-xs uppercase tracking-wider font-medium">
                  Password
                </label>
                <button type="button"
                  className="font-switzer text-[#f2fd7d] text-xs hover:underline"
                  onClick={() => toast.info('Password reset coming soon!')}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" placeholder="Enter your password"
                  value={formData.password} onChange={handleChange}
                  required disabled={loading}
                  className="font-switzer w-full h-11 rounded-xl px-4 pr-12 text-white placeholder-[#333] outline-none transition-all disabled:opacity-50"
                  style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}
                  onFocus={e => e.target.style.borderColor = '#f2fd7d'}
                  onBlur={e => e.target.style.borderColor = '#1a1a1a'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="font-switzer w-full h-12 bg-[#f2fd7d] text-black rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: '#111' }} />
            <span className="font-switzer text-[#333] text-xs">or</span>
            <div className="flex-1 h-px" style={{ background: '#111' }} />
          </div>

          <p className="font-switzer text-[#444] text-sm text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#f2fd7d] font-semibold hover:underline">
              Sign up free
            </Link>
          </p>

          <p className="font-switzer text-center text-[#2a2a2a] text-xs mt-8">
            By signing in you agree to our{' '}
            <button className="text-[#333] hover:text-white transition-colors">Terms</button>
            {' '}and{' '}
            <button className="text-[#333] hover:text-white transition-colors">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SigninPage;