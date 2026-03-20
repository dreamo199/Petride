import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Truck, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/auth";

function SignupPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    address: "",
    license_number: "",
    vehicle_number: "",
    vehicle_type: '',
    vehicle_capacity: '',
  });
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!agreed) {
      toast.error('Please agree to terms & conditions');
      return false;
    }

    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const payload =
      userType === "driver"
        ? formData
        : {
            username: formData.username,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            password: formData.password,
            password2: formData.password2,
          };

    try {
      if (userType === "customer") {
        await authService.registerCustomer(payload);
      } else {
        await authService.registerDriver(payload);
      }
      
      toast.success('Account created successfully!');
      navigate('/signin', { replace: true });
      
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      
      // Better error handling
      const errorData = error.response?.data;
      let errorMessage = 'Registration failed. Please try again.';
      
      if (typeof errorData === 'object') {
        // Handle field-specific errors
        const firstError = Object.values(errorData)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        } else if (typeof firstError === 'string') {
          errorMessage = firstError;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[520px]">
        
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
                <span className="text-xl font-bold text-black">P</span>
              </div>
            </div>
            <h1 className="font-['Inter',sans-serif] text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-[#888] text-sm">
              Join PetRide and start ordering fuel today
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="text-[#888] text-xs font-medium mb-3 block">
              I want to sign up as
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("customer")}
                className={`
                  h-14 rounded-xl flex items-center justify-center gap-2.5 border transition-all
                  ${userType === "customer" 
                    ? "bg-[#f2fd7d]/10 border-[#f2fd7d] text-white" 
                    : "border-[#1f1f1f] text-[#555] hover:border-[#343434] hover:text-[#888]"
                  }
                `}
              >
                <User size={18} className={userType === "customer" ? "text-[#f2fd7d]" : ""} />
                <span className="font-medium">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setUserType("driver")}
                className={`
                  h-14 rounded-xl flex items-center justify-center gap-2.5 border transition-all
                  ${userType === "driver" 
                    ? "bg-[#f2fd7d]/10 border-[#f2fd7d] text-white" 
                    : "border-[#1f1f1f] text-[#555] hover:border-[#343434] hover:text-[#888]"
                  }
                `}
              >
                <Truck size={18} className={userType === "driver" ? "text-[#f2fd7d]" : ""} />
                <span className="font-medium">Driver</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#888] text-xs font-medium mb-2 block">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-[#888] text-xs font-medium mb-2 block">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-[#888] text-xs font-medium mb-2 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="johndoe123"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[#888] text-xs font-medium mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                required
                disabled={loading}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-[#888] text-xs font-medium mb-2 block">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+234 800 123 4567"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                required
                disabled={loading}
              />
            </div>

            {/* Driver-specific fields */}
            {userType === 'driver' && (
              <div className="space-y-4 pt-4 border-t border-[#1f1f1f]">
                <p className="text-[#888] text-xs font-medium">Driver Information</p>
                
                <div>
                  <label className="text-[#888] text-xs font-medium mb-2 block">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    placeholder="ABC123456"
                    value={formData.license_number}
                    onChange={handleChange}
                    className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#888] text-xs font-medium mb-2 block">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicle_number"
                      placeholder="LAG 123 XY"
                      value={formData.vehicle_number}
                      onChange={handleChange}
                      className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-[#888] text-xs font-medium mb-2 block">
                      Vehicle Type
                    </label>
                    <input
                      type="text"
                      name="vehicle_type"
                      placeholder="Truck"
                      value={formData.vehicle_type}
                      onChange={handleChange}
                      className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#888] text-xs font-medium mb-2 block">
                    Vehicle Capacity (Liters)
                  </label>
                  <input
                    type="number"
                    name="vehicle_capacity"
                    placeholder="1000"
                    value={formData.vehicle_capacity}
                    onChange={handleChange}
                    className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Customer-specific fields */}
            {userType === 'customer' && (
              <div>
                <label className="text-[#888] text-xs font-medium mb-2 block">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main Street, Lagos"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                  required
                  disabled={loading}
                />
              </div>
            )}

            {/* Password Fields */}
            <div className="pt-4 border-t border-[#1f1f1f] space-y-4">
              <div>
                <label className="text-[#888] text-xs font-medium mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password (min. 8 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 pr-12 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#888] text-xs font-medium mb-2 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="password2"
                    placeholder="Re-enter password"
                    value={formData.password2}
                    onChange={handleChange}
                    className="w-full h-11 bg-[#111] border border-[#1f1f1f] rounded-lg px-4 pr-12 text-white placeholder-[#444] focus:outline-none focus:border-[#f2fd7d] transition-colors text-sm"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
                    disabled={loading}
                  >
                    {showPassword2 ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3 text-sm text-[#888] cursor-pointer hover:text-[#aaa] transition-colors pt-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-[#f2fd7d] cursor-pointer"
                required
                disabled={loading}
              />
              <span>
                I agree to the{" "}
                <button type="button" className="text-[#f2fd7d] hover:underline">
                  Terms & Conditions
                </button>
                {" "}and{" "}
                <button type="button" className="text-[#f2fd7d] hover:underline">
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full h-12 bg-[#f2fd7d] text-black rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Sign In Link */}
            <div className="pt-4 border-t border-[#1f1f1f]">
              <p className="text-[#888] text-sm text-center">
                Already have an account?{" "}
                <Link to="/signin" className="text-[#f2fd7d] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[#555] text-xs mt-6">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
}

export default SignupPage;