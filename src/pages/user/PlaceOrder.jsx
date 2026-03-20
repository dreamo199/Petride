import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { orderService } from '../../services/order';
import { AddressMapInput } from '../../components/Address';
import { Flame, Droplets, MapPin, ChevronRight, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const stepLabels = ['Fuel Type', 'Quantity', 'Delivery'];

function PlaceOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fuelTypes, setFuelTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState({
    fuel_type: 0,
    quantity_liters: 1,
    delivery_address: '',
    delivery_latitude: null,
    delivery_longitude: null,
    notes: '',
  });

  const handleAddressChange = (addressData) => {
    setOrderData(prev => ({
      ...prev,
      delivery_address: addressData.address,
      delivery_latitude: addressData.latitude,
      delivery_longitude: addressData.longitude,
    }));
  };

  useEffect(() => {
    loadFuelTypes();
  }, []);

  const loadFuelTypes = async () => {
    try{
      const data = await orderService.getFuelTypes();
      setFuelTypes(data?.results);
    } catch (error){
      toast.error('Failed to load fuel types')
    }
  };

  const selectedFuel = fuelTypes.find(
  (f) => f.id === Number(orderData.fuel_type)
);

  const calculateTotal = () => {
    if (!selectedFuel) return { fuelCost: 0, deliveryFee: 0, serviceCharge: 0, total: 0 };
    const fuelCost = Number(selectedFuel.price_per_liter) * orderData.quantity_liters;
    const deliveryFee = 0;
    const serviceCharge = 0;
    return { fuelCost, deliveryFee, serviceCharge, total: fuelCost + deliveryFee + serviceCharge };
  };

  const pricing = calculateTotal();

  const adjustQuantity = (delta) => {
    setOrderData((prev) => ({
      ...prev,
      quantity_liters: Math.min(50, Math.max(0, prev.quantity_liters + delta)),
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    setLoading(true);

    try{
      await orderService.createOrder(orderData);
      toast.success('Order placed successfully!');
      navigate(`/customer/orders/`)
    } catch (error) {
      console.log(error.response?.data);
      toast.error(JSON.stringify(error.response?.data) || 'Failed to place order')
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-['Inter',sans-serif] font-bold text-2xl text-[#fcfcfc]">
            Place New Order
          </h1>
          <p className="text-[#555] text-sm mt-0.5">
            Order fuel delivered to your doorstep
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-6">
          <div className="flex items-center gap-0 max-w-md">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                {/* Circle */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      transition-all duration-300 z-10 relative
                      ${step > s
                        ? 'bg-[#f2fd7d] text-black'
                        : step === s
                          ? 'bg-[#f2fd7d] text-black ring-4 ring-[#f2fd7d]/20'
                          : 'bg-[#1f1f1f] text-[#555]'
                      }
                    `}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  <span
                    className={`
                      absolute -bottom-5 text-xs whitespace-nowrap
                      ${step >= s ? 'text-[#888]' : 'text-[#444]'}
                    `}
                  >
                    {stepLabels[s - 1]}
                  </span>
                </div>

                {/* Connector line */}
                {s < 3 && (
                  <div className="flex-1 h-0.5 mx-1 mb-5 rounded-full bg-[#1f1f1f] overflow-hidden">
                    <div
                      className="h-full bg-[#f2fd7d] transition-all duration-500"
                      style={{ width: step > s ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="grid lg:grid-cols-3 gap-5 mt-8">

          {/* ── MAIN FORM ── */}
          <div className="lg:col-span-2">

            {/* Step 1 */}
            {step === 1 && (
              <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
                <h2 className="text-[#fcfcfc] font-semibold text-base mb-1">Select Fuel Type</h2>
                <p className="text-[#555] text-xs mb-5">Choose the type of fuel you need</p>

                <div className="grid grid-cols-2 gap-3">
                  {fuelTypes.map((fuel) => {
                    const isSelected = orderData.fuel_type === fuel.id;
                    return (
                      <button
                        key={fuel.id}
                        disabled={!fuel.is_available}
                        onClick={() => setOrderData((prev) => ({ ...prev, fuel_type: fuel.id }))}
                        className={`
                          relative p-5 rounded-xl border text-left
                          transition-all duration-200
                          ${isSelected
                            ? 'border-[#f2fd7d] bg-[#f2fd7d]/5'
                            : fuel.is_available
                              ? 'border-[#1f1f1f] hover:border-[#343434] bg-[#0f0f0f]'
                              : 'border-[#1f1f1f] opacity-40 cursor-not-allowed'
                          }
                        `}
                      >
                        {/* Selected tick */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#f2fd7d] flex items-center justify-center">
                            <span className="text-black text-xs font-bold">✓</span>
                          </div>
                        )}

                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isSelected ? 'bg-[#f2fd7d]/15' : 'bg-[#141414]'}`}>
                          {fuel.name === 'petrol'
                            ? <Flame size={20} className={isSelected ? 'text-[#f2fd7d]' : 'text-[#666]'} />
                            : <Droplets size={20} className={isSelected ? 'text-[#f2fd7d]' : 'text-[#666]'} />
                          }
                        </div>

                        <h3 className="text-[#fcfcfc] font-semibold text-sm">{fuel.name}</h3>
                        <p className="text-[#555] text-xs mt-0.5 mb-3">{fuel.description || 'Standard grade'}</p>
                        <p className="text-[#f2fd7d] font-bold text-sm">
                          ₦{fuel.price_per_liter.toLocaleString()}<span className="text-[#555] font-normal">/L</span>
                        </p>

                        {!fuel.is_available && (
                          <span className="absolute bottom-3 right-3 text-xs text-red-400 font-medium">Unavailable</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!orderData.fuel_type}
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                      transition-all duration-200
                      ${orderData.fuel_type
                        ? 'bg-[#f2fd7d] text-black hover:opacity-90'
                        : 'bg-[#1f1f1f] text-[#444] cursor-not-allowed'
                      }
                    `}
                  >
                    Continue <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6">
                <h2 className="text-[#fcfcfc] font-semibold text-base mb-1">Select Quantity</h2>
                <p className="text-[#555] text-xs mb-6">Choose how many liters you need (10L – 500L)</p>

                {/* Big quantity display + +/- */}
                <div className="flex items-center justify-center gap-6 py-6">
                  <button
                    onClick={() => adjustQuantity(-10)}
                    className="w-12 h-12 rounded-full border border-[#343434] bg-[#0f0f0f] hover:border-[#555] flex items-center justify-center transition-colors"
                  >
                    <Minus size={18} className="text-[#888]" />
                  </button>

                  <div className="text-center">
                    <input
                      type="number"
                      value={orderData.quantity_liters}
                      onChange={(e) => {
                        const v = Math.min(50, Math.max(1, parseInt(e.target.value) || 10));
                        setOrderData((prev) => ({ ...prev, quantity_liters: v }));
                      }}
                      className="
                        w-28 text-center text-5xl font-bold text-[#fcfcfc]
                        bg-transparent outline-none
                        [&::-webkit-outer-spin-button]:appearance-none
                        [&::-webkit-inner-spin-button]:appearance-none
                      "
                    />
                    <p className="text-[#555] text-sm -mt-1">liters</p>
                  </div>

                  <button
                    onClick={() => adjustQuantity(10)}
                    className="w-12 h-12 rounded-full border border-[#343434] bg-[#0f0f0f] hover:border-[#555] flex items-center justify-center transition-colors"
                  >
                    <Plus size={18} className="text-[#888]" />
                  </button>
                </div>

                {/* Quick presets */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  {[10, 20, 30, 50].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setOrderData((prev) => ({ ...prev, quantity_liters: preset }))}
                      className={`
                        px-3.5 py-1 rounded-full text-xs font-medium border
                        transition-all duration-150
                        ${orderData.quantity_liters === preset
                          ? 'border-[#f2fd7d] bg-[#f2fd7d]/10 text-[#f2fd7d]'
                          : 'border-[#1f1f1f] text-[#555] hover:border-[#343434] hover:text-[#888]'
                        }
                      `}
                    >
                      {preset}L
                    </button>
                  ))}
                </div>

                {/* Nav */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-[#555] hover:text-white text-sm transition-colors"
                  >
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 bg-[#f2fd7d] text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Continue <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-[#fcfcfc] font-semibold text-base mb-0.5">Delivery Details</h2>
                  <p className="text-[#555] text-xs">Tell us where and when to deliver</p>
                </div>

                {/* Address */}
                <div>
                  <label className="text-[#888] text-xs font-medium flex items-center gap-1.5 mb-2">
                    <MapPin size={13} /> Delivery Address
                  </label>
                  <AddressMapInput onAddressChange={handleAddressChange} initialAddress={orderData.delivery_address} />
                  <Input
                    value={orderData.delivery_address}
                    onChange={(e) => setOrderData((prev) => ({ ...prev, delivery_address: e.target.value }))}
                    className="bg-[#111] border-[#1f1f1f] text-[#fcfcfc] focus:border-[#555]"
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="text-[#888] text-xs font-medium mb-2 block">
                    Special Instructions <span className="text-[#444] font-normal">(optional)</span>
                  </label>
                  <Textarea
                    value={orderData.notes}
                    onChange={(e) => setOrderData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g., Gate code, parking instructions..."
                    className="bg-[#111] border-[#1f1f1f] text-[#fcfcfc] placeholder-[#444] min-h-[90px] focus:border-[#555]"
                  />
                </div>

                {/* Nav */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-[#555] hover:text-white text-sm transition-colors"
                  >
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="bg-[#f2fd7d] text-black px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Placing order...' : 'Place Order →'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a0a0a] border border-[#343434] rounded-2xl p-5 sticky top-6">
              <h3 className="text-[#fcfcfc] font-semibold text-base mb-4">Order Summary</h3>

              {!orderData.fuel_type ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#1f1f1f] flex items-center justify-center">
                    <Droplets size={18} className="text-[#444]" />
                  </div>
                  <p className="text-[#555] text-xs text-center">Select a fuel type to see your pricing</p>
                </div>
              ) : (
                <div className="space-y-4">

                  {/* Item preview */}
                  <div className="flex items-center gap-3 bg-[#111] rounded-xl p-3">
                    <div className="w-9 h-9 rounded-lg bg-[#f2fd7d]/10 flex items-center justify-center">
                      {selectedFuel.name === 'petrol'
                        ? <Flame size={18} className="text-[#f2fd7d]" />
                        : <Droplets size={18} className="text-[#f2fd7d]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#fcfcfc] text-sm font-semibold">{selectedFuel.name}</p>
                      <p className="text-[#555] text-xs">{orderData.quantity_liters}L × ₦{selectedFuel.price_per_liter.toLocaleString()}</p>
                    </div>
                    <p className="text-[#fcfcfc] font-semibold text-sm">₦{pricing.fuelCost.toLocaleString()}</p>
                  </div>

                  {/* Fee rows */}
                  <div className="space-y-2.5 px-1">
                    {[
                      { label: 'Delivery Fee', value: pricing.deliveryFee },
                      { label: 'Service Charge', value: pricing.serviceCharge },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-[#555] text-sm">{label}</span>
                        <span className="text-[#888] text-sm">₦{value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-[#1f1f1f] pt-4 mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#fcfcfc] font-semibold text-sm">Total</span>
                      <span className="text-[#f2fd7d] font-bold text-xl">₦{pricing.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Delivery address preview on step 3 */}
                  {step === 3 && orderData.delivery_address && (
                    <div className="border-t border-[#1f1f1f] pt-4 mt-1">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-[#555] mt-0.5 shrink-0" />
                        <p className="text-[#555] text-xs leading-relaxed">{orderData.delivery_address}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;