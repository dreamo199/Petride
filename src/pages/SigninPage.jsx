import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Truck, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

function SigninPage({ onBack }) {
  const navigate = useNavigate();
  const { login } = useAuth()
  const [userRole, setUserRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    const { username, password } = formData;

    try {
      const response = await login(username, password);
      
      toast.success('Login successful!');
      
      const actualRole = response?.user?.role || response?.role || userRole;
      
      if (actualRole === 'customer') {
        navigate('/customer', { replace: true });
      } else if (actualRole === 'driver') {
        navigate('/driver', { replace: true });
      } else {
        navigate(userRole === 'customer' ? '/customer' : '/driver', { replace: true });
      }
      
    } catch (error) {
      console.error('Login error:', error?.response?.data);
      
      const errorMessage = 
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Login failed. Please check your credentials.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        
        {/* Back Button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-[#888] hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to home</span>
        </Link>

        {/* Main Card */}
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#f2fd7d]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-[#f2fd7d] rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-black">PR</span>
              </div>
            </div>
            <h1 className="font-['Inter',sans-serif] text-3xl font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-[#888] text-sm">
              Sign in to continue to PetRide
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="text-[#888] text-xs font-medium mb-3 block">
              Sign in as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserRole("customer")}
                className={`
                  h-14 rounded-xl flex items-center justify-center gap-2.5 border transition-all
                  ${userRole === "customer" 
                    ? "bg-[#f2fd7d]/10 border-[#f2fd7d] text-white" 
                    : "border-[#1f1f1f] text-[#555] hover:border-[#343434] hover:text-[#888]"
                  }
                `}
              >
                <User size={18} className={userRole === "customer" ? "text-[#f2fd7d]" : ""} />
                <span className="font-medium">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setUserRole("driver")}
                className={`
                  h-14 rounded-xl flex items-center justify-center gap-2.5 border transition-all
                  ${userRole === "driver" 
                    ? "bg-[#f2fd7d]/10 border-[#f2fd7d] text-white" 
                    : "border-[#1f1f1f] text-[#555] hover:border-[#343434] hover:text-[#888]"
                  }
                `}
              >
                <Truck size={18} className={userRole === "driver" ? "text-[#f2fd7d]" : ""} />
                <span className="font-medium">Driver</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="text-[#888] text-xs font-medium mb-2 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-12 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[#888] text-xs font-medium mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 pr-12 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[#f2fd7d] text-xs hover:underline"
                onClick={() => toast.info('Password reset coming soon!')}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#f2fd7d] text-black rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Sign Up Link */}
            <div className="pt-4 border-t border-[#1f1f1f]">
              <p className="text-[#888] text-sm text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#f2fd7d] font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[#555] text-xs mt-6">
          By signing in, you agree to our{" "}
          <button className="text-[#888] hover:text-white transition-colors">
            Terms
          </button>
          {" "}and{" "}
          <button className="text-[#888] hover:text-white transition-colors">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}

export default SigninPage;
