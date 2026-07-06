export const Routes = {
  // App tabs
  ScheduleTab: 'ScheduleTab',
  MyBookingsTab: 'MyBookingsTab',
  HistoryTab: 'HistoryTab',
  ProfileTab: 'ProfileTab',
  // Pushed screens (over tabs)
  Slot: 'Slot',
  Chef: 'Chef',
  BookingSetup: 'BookingSetup',
  Payment: 'Payment',
  PaymentResult: 'PaymentResult',
  BookingDetails: 'BookingDetails',
  Rating: 'Rating',
  EditProfile: 'EditProfile',
};

export const linking = {
  prefixes: ['kulinarystudio://', 'https://studio.example.com'],
  config: {
    screens: {
      BookingDetails: 'booking/:bookingId',
    },
  },
};
