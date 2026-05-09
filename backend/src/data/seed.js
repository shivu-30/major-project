const now = new Date().toISOString();

module.exports = {
  users: [
    {
      id: 'admin-1',
      name: 'System Admin',
      email: 'admin@smartlocal.test',
      phone: '+91-9000000000',
      role: 'admin',
      passwordHash: 'demo',
      createdAt: now
    },
    {
      id: 'customer-1',
      name: 'Demo Customer',
      email: 'customer@smartlocal.test',
      phone: '+91-9000000001',
      role: 'customer',
      passwordHash: 'demo',
      createdAt: now
    }
  ],
  categories: [
    { id: 'electrician', name: 'Electrician', icon: '⚡' },
    { id: 'plumber', name: 'Plumber', icon: '🔧' },
    { id: 'cleaner', name: 'Cleaner', icon: '🧹' },
    { id: 'carpenter', name: 'Carpenter', icon: '🪚' },
    { id: 'ac-repair', name: 'AC Repair', icon: '❄️' }
  ],
  providers: [
    {
      id: 'provider-1',
      name: 'Ravi Electricals',
      ownerName: 'Ravi Kumar',
      category: 'electrician',
      location: 'Bengaluru',
      latitude: 12.9716,
      longitude: 77.5946,
      rating: 4.8,
      reviewCount: 126,
      verified: true,
      emergencyAvailable: true,
      priceFrom: 299,
      services: ['Wiring', 'Fan installation', 'Switchboard repair'],
      bio: 'Licensed electrician for home and shop repairs.',
      availability: '09:00-21:00',
      createdAt: now
    },
    {
      id: 'provider-2',
      name: 'QuickFix Plumbing',
      ownerName: 'Meena S',
      category: 'plumber',
      location: 'Bengaluru',
      latitude: 12.9352,
      longitude: 77.6245,
      rating: 4.6,
      reviewCount: 89,
      verified: true,
      emergencyAvailable: true,
      priceFrom: 249,
      services: ['Leak repair', 'Tap fitting', 'Bathroom plumbing'],
      bio: 'Fast plumbing support with emergency service.',
      availability: '08:00-22:00',
      createdAt: now
    },
    {
      id: 'provider-3',
      name: 'Shine Home Cleaning',
      ownerName: 'Anita P',
      category: 'cleaner',
      location: 'Mysuru',
      latitude: 12.2958,
      longitude: 76.6394,
      rating: 4.4,
      reviewCount: 52,
      verified: false,
      emergencyAvailable: false,
      priceFrom: 499,
      services: ['Deep cleaning', 'Kitchen cleaning', 'Move-in cleaning'],
      bio: 'Professional home cleaning packages.',
      availability: '10:00-18:00',
      createdAt: now
    }
  ],
  bookings: [],
  reviews: [],
  payments: [],
  notifications: []
};
