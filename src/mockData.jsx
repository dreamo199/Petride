// Mock data for the application

export const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerId: 'user1',
    customerName: 'John Doe',
    customerPhone: '+234 801 234 5678',
    driverId: 'driver1',
    driverName: 'Michael Johnson',
    driverPhone: '+234 802 345 6789',
    date: '2026-01-30',
    time: '14:30',
    fuelType: 'Petrol',
    quantity: 50,
    pricePerLiter: 900,
    deliveryFee: 2000,
    serviceCharge: 1500,
    total: 48500,
    status: 'Delivered',
    deliveryAddress: '123 Main Street, Ikeja, Lagos',
    specialInstructions: 'Please call when you arrive',
    rating: 5,
    timeline: [
      { status: 'Order Placed', timestamp: '2026-01-30 14:30', completed: true },
      { status: 'Driver Assigned', timestamp: '2026-01-30 14:35', completed: true },
      { status: 'In Transit', timestamp: '2026-01-30 14:50', completed: true },
      { status: 'Delivered', timestamp: '2026-01-30 15:15', completed: true },
    ],
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerId: 'user1',
    customerName: 'John Doe',
    customerPhone: '+234 801 234 5678',
    driverId: 'driver2',
    driverName: 'Sarah Williams',
    driverPhone: '+234 803 456 7890',
    date: '2026-01-28',
    time: '10:15',
    fuelType: 'Diesel',
    quantity: 100,
    pricePerLiter: 850,
    deliveryFee: 2000,
    serviceCharge: 2500,
    total: 89500,
    status: 'Delivered',
    deliveryAddress: '123 Main Street, Ikeja, Lagos',
    specialInstructions: '',
    rating: 4,
    timeline: [
      { status: 'Order Placed', timestamp: '2026-01-28 10:15', completed: true },
      { status: 'Driver Assigned', timestamp: '2026-01-28 10:20', completed: true },
      { status: 'In Transit', timestamp: '2026-01-28 10:35', completed: true },
      { status: 'Delivered', timestamp: '2026-01-28 11:00', completed: true },
    ],
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerId: 'user2',
    customerName: 'Jane Smith',
    customerPhone: '+234 804 567 8901',
    driverId: 'driver1',
    driverName: 'Michael Johnson',
    driverPhone: '+234 802 345 6789',
    date: '2026-01-31',
    time: '09:00',
    fuelType: 'Petrol',
    quantity: 75,
    pricePerLiter: 900,
    deliveryFee: 2000,
    serviceCharge: 2000,
    total: 71500,
    status: 'In Transit',
    deliveryAddress: '456 Victoria Island, Lagos',
    specialInstructions: 'Gate code: 1234',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-01-31 09:00', completed: true },
      { status: 'Driver Assigned', timestamp: '2026-01-31 09:05', completed: true },
      { status: 'In Transit', timestamp: '2026-01-31 09:20', completed: true },
      { status: 'Delivered', timestamp: '', completed: false },
    ],
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerId: 'user3',
    customerName: 'David Brown',
    customerPhone: '+234 805 678 9012',
    date: '2026-01-31',
    time: '11:45',
    fuelType: 'Diesel',
    quantity: 150,
    pricePerLiter: 850,
    deliveryFee: 2500,
    serviceCharge: 3500,
    total: 133500,
    status: 'Pending',
    deliveryAddress: '789 Lekki Phase 1, Lagos',
    specialInstructions: '',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-01-31 11:45', completed: true },
      { status: 'Driver Assigned', timestamp: '', completed: false },
      { status: 'In Transit', timestamp: '', completed: false },
      { status: 'Delivered', timestamp: '', completed: false },
    ],
  },
];

export const mockCustomers = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 801 234 5678',
    memberSince: '2025-06-15',
    totalOrders: 24,
    totalSpent: 340000,
    status: 'Active',
    addresses: [
      { id: '1', label: 'Home', address: '123 Main Street, Ikeja, Lagos', isDefault: true },
      { id: '2', label: 'Work', address: '456 Business District, VI, Lagos', isDefault: false },
    ],
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+234 804 567 8901',
    memberSince: '2025-08-20',
    totalOrders: 18,
    totalSpent: 275000,
    status: 'Active',
    addresses: [
      { id: '1', label: 'Home', address: '456 Victoria Island, Lagos', isDefault: true },
    ],
  },
  {
    id: 'user3',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+234 805 678 9012',
    memberSince: '2025-11-10',
    totalOrders: 8,
    totalSpent: 125000,
    status: 'Active',
    addresses: [
      { id: '1', label: 'Home', address: '789 Lekki Phase 1, Lagos', isDefault: true },
    ],
  },
];

export const mockDrivers = [
  {
    id: 'driver1',
    name: 'Michael Johnson',
    email: 'michael@ariver.com',
    phone: '+234 802 345 6789',
    rating: 4.8,
    totalDeliveries: 156,
    totalEarnings: 780000,
    status: 'Approved',
    availability: 'Available',
    vehicle: {
      type: 'Fuel Truck',
      number: 'LAG 234 XY',
      capacity: 500,
    },
    license: {
      number: 'DRV-123456',
      expiry: '2027-12-31',
      verified: true,
    },
    joinedDate: '2025-03-15',
  },
  {
    id: 'driver2',
    name: 'Sarah Williams',
    email: 'sarah@ariver.com',
    phone: '+234 803 456 7890',
    rating: 4.9,
    totalDeliveries: 203,
    totalEarnings: 1015000,
    status: 'Approved',
    availability: 'On Delivery',
    vehicle: {
      type: 'Fuel Truck',
      number: 'LAG 567 AB',
      capacity: 500,
    },
    license: {
      number: 'DRV-789012',
      expiry: '2028-06-30',
      verified: true,
    },
    joinedDate: '2025-01-10',
  },
  {
    id: 'driver3',
    name: 'Robert Taylor',
    email: 'robert@ariver.com',
    phone: '+234 806 789 0123',
    rating: 4.7,
    totalDeliveries: 98,
    totalEarnings: 490000,
    status: 'Pending',
    availability: 'Offline',
    vehicle: {
      type: 'Fuel Truck',
      number: 'LAG 890 CD',
      capacity: 500,
    },
    license: {
      number: 'DRV-345678',
      expiry: '2027-09-15',
      verified: false,
    },
    joinedDate: '2025-12-01',
  },
];

export const fuelTypes = [
  {
    id: 'petrol',
    name: 'Petrol (PMS)',
    pricePerLiter: 900,
    available: true,
    icon: '⛽',
  },
  {
    id: 'diesel',
    name: 'Diesel (AGO)',
    pricePerLiter: 850,
    available: true,
    icon: '🚛',
  },
];

export const getOrderById = (id) => mockOrders.find(order => order.id === id);
export const getCustomerById = (id) => mockCustomers.find(customer => customer.id === id);
export const getDriverById = (id) => mockDrivers.find(driver => driver.id === id);

export const getOrdersForCustomer = (customerId) => 
  mockOrders.filter(order => order.customerId === customerId);

export const getOrdersForDriver = (driverId) => 
  mockOrders.filter(order => order.driverId === driverId);

export const getAvailableOrders = () => 
  mockOrders.filter(order => order.status === 'Pending');