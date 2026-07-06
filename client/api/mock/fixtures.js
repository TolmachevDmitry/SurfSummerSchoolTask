export const DEMO_CREDENTIALS = {
  login: 'ivanov@example.com',
  password: 'secret123',
};

export const DEMO_PROFILE = {
  id: 'c1a1a1a1-1111-1111-1111-111111111111',
  login: 'ivanov@example.com',
  allergies: ['Глютен', 'Лактоза'],
};

export const CHEFS = {
  '2b2b2b2b-2222-2222-2222-222222222222': {
    id: '2b2b2b2b-2222-2222-2222-222222222222',
    name: 'Анна Севостьянова',
    photoUrl: '',
    rating: 4.8,
    reviews: [
      {
        id: '7a7a7a7a-7777-7777-7777-777777777771',
        rating: 5,
        comment: 'Прекрасный класс, всё понятно и вкусно!',
        createdAt: '2026-06-10T18:30:00.000Z',
        clientName: 'Мария',
      },
      {
        id: '7a7a7a7a-7777-7777-7777-777777777772',
        rating: 4,
        comment: 'Очень душевно, немного не хватило времени.',
        createdAt: '2026-06-01T12:00:00.000Z',
        clientName: 'Игорь',
      },
    ],
  },
  '3c3c3c3c-3333-3333-3333-333333333333': {
    id: '3c3c3c3c-3333-3333-3333-333333333333',
    name: 'Дмитрий Кравцов',
    photoUrl: '',
    rating: 4.6,
    reviews: [
      {
        id: '8b8b8b8b-8888-8888-8888-888888888881',
        rating: 5,
        comment: 'Шеф огонь, рекомендую.',
        createdAt: '2026-05-20T19:00:00.000Z',
        clientName: 'Ольга',
      },
    ],
  },
};

export const PROGRAMS = {
  pasta: {
    id: '4d4d4d4d-4444-4444-4444-444444444441',
    name: 'Свежая паста руками',
    description:
      'Готовим итальянскую пасту с нуля: тесто, раскатка, соус из сезонных томатов. Подойдёт и новичкам.',
    requiresOven: false,
  },
  bread: {
    id: '4d4d4d4d-4444-4444-4444-444444444442',
    name: 'Хлеб и закваска',
    description:
      'Разбираем основы ремесленного хлеба на закваске: уход за стартером, замес, формовка и выпечка.',
    requiresOven: true,
  },
  desserts: {
    id: '4d4d4d4d-4444-4444-4444-444444444443',
    name: 'Французские десерты',
    description: 'Тарт, кремё и профитроли: тонкая работа с тестом и кремами в небольшой группе.',
    requiresOven: true,
  },
  asia: {
    id: '4d4d4d4d-4444-4444-4444-444444444444',
    name: 'Азиатские пельмени',
    description: 'Лепим димсамы и гёдза, готовим на пару и в воке. Бонус — острые соусы.',
    requiresOven: false,
  },
};

export function buildSlotTemplates() {
  const chef1 = CHEFS['2b2b2b2b-2222-2222-2222-222222222222'];
  const chef2 = CHEFS['3c3c3c3c-3333-3333-3333-333333333333'];

  return [
    {
      program: PROGRAMS.pasta,
      chef: chef1,
      offsetHours: 3,
      durationMinutes: 150,
      maxSeats: 12,
      availableSeats: 5,
      status: 'scheduled',
      price: 3500,
      availableRentalKits: 4,
    },
    {
      program: PROGRAMS.bread,
      chef: chef2,
      offsetHours: 28,
      durationMinutes: 180,
      maxSeats: 8,
      availableSeats: 0,
      status: 'scheduled',
      price: 4200,
      availableRentalKits: 0,
    },
    {
      program: PROGRAMS.desserts,
      chef: chef1,
      offsetHours: 52,
      durationMinutes: 150,
      maxSeats: 8,
      availableSeats: 8,
      status: 'scheduled',
      price: 4800,
      availableRentalKits: 6,
    },
    {
      program: PROGRAMS.asia,
      chef: chef2,
      offsetHours: 76,
      durationMinutes: 120,
      maxSeats: 12,
      availableSeats: 3,
      status: 'scheduled',
      price: 3900,
      availableRentalKits: 2,
    },
    {
      program: PROGRAMS.pasta,
      chef: chef1,
      offsetHours: 128,
      durationMinutes: 150,
      maxSeats: 12,
      availableSeats: 10,
      status: 'scheduled',
      price: 3500,
      availableRentalKits: 8,
    },
    {
      program: PROGRAMS.bread,
      chef: chef2,
      offsetHours: 200,
      durationMinutes: 180,
      maxSeats: 8,
      availableSeats: 6,
      status: 'scheduled',
      price: 4200,
      availableRentalKits: 5,
    },
    {
      program: PROGRAMS.desserts,
      chef: chef1,
      offsetHours: 248,
      durationMinutes: 150,
      maxSeats: 8,
      availableSeats: 4,
      status: 'cancelled_by_studio',
      price: 4800,
      availableRentalKits: 6,
    },
    {
      program: PROGRAMS.asia,
      chef: chef2,
      offsetHours: 0.08,
      durationMinutes: 120,
      maxSeats: 12,
      availableSeats: 7,
      status: 'scheduled',
      price: 3900,
      availableRentalKits: 3,
    },
  ];
}

export const DEMO_BOOKINGS = [
  {
    id: '5e5e5e5e-5555-5555-5555-555555555551',
    slotTemplateIndex: 3,
    status: 'active',
    equipmentChoice: 'rental',
    allergies: ['Глютен', 'Лактоза'],
  },
  {
    id: '5e5e5e5e-5555-5555-5555-555555555552',
    slotTemplateIndex: 0,
    status: 'completed',
    equipmentChoice: 'own',
    allergies: ['Глютен'],
  },
  {
    id: '5e5e5e5e-5555-5555-5555-555555555553',
    slotTemplateIndex: 1,
    status: 'cancelled_by_client',
    equipmentChoice: 'rental',
    allergies: [],
  },
];
