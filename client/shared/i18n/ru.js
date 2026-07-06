export const ru = {
  appName: 'Кулинарная студия',

  auth: {
    title: 'Вход в приложение',
    loginLabel: 'Логин',
    loginPlaceholder: 'ivanov@example.com',
    passwordLabel: 'Пароль',
    submit: 'Войти',
    submitting: 'Входим…',
    invalidCredentials: 'Неверный логин или пароль',
    loginRequired: 'Введите логин',
    passwordRequired: 'Введите пароль',
  },

  nav: {
    schedule: 'Расписание',
    myBookings: 'Мои брони',
    history: 'История',
    profile: 'Профиль',
  },

  schedule: {
    title: 'Расписание классов',
    days7: '7 дней',
    days14: '14 дней',
    days30: '30 дней',
    empty: 'Пока нет доступных классов',
    seats: {
      available: (n) => `Свободно мест: ${n}`,
      none: 'Мест нет',
    },
    cancelledBadge: 'Отменён',
  },

  slot: {
    book: 'Записаться',
    unavailable: {
      cancelledByStudio: 'Класс отменён студией',
      completed: 'Класс уже прошёл',
      inProgress: 'Класс идёт',
      noSeats: 'Свободных мест нет',
      soon: 'До начала класса менее 10 минут, запись закрыта',
      closed: 'Запись на этот класс закрыта',
    },
    notFound: 'Класс не найден',
    notFoundHint: 'Возможно, класс был удалён или ссылка устарела.',
    duration: 'Длительность',
    price: 'Стоимость участия',
    program: 'Программа',
    chef: 'Шеф',
    rating: 'Рейтинг',
    rental: {
      available: 'Прокатная экипировка доступна',
      exhausted: 'Прокатный фонд исчерпан',
    },
  },

  chef: {
    title: 'Шеф',
    reviews: 'Отзывы',
    noReviews: 'Отзывов пока нет',
    otherClasses: 'Другие классы этого шефа',
    notFound: 'Шеф не найден',
    anonymous: 'Аноним',
  },

  bookingSetup: {
    title: 'Оформление брони',
    equipment: {
      title: 'Экипировка',
      own: 'Своя экипировка',
      ownHint: 'Я принесу свою экипировку',
      rental: 'Прокатная экипировка',
      rentalHint: 'Возьму комплект в студии',
      rentalExhausted: 'Прокатный фонд на этот класс исчерпан',
      choosePrompt: 'Выберите вариант экипировки, чтобы продолжить',
    },
    summary: {
      title: 'Итоговая стоимость',
      classPrice: 'Класс',
      rental: 'Прокатная экипировка',
      total: 'Итого',
      pending: '—',
    },
    allergies: {
      title: 'Ваши аллергии',
      empty: 'Аллергии не указаны',
      hint: 'Подставляются автоматически из профиля',
      edit: 'Изменить в профиле',
    },
    submit: 'Продолжить к оплате',
  },

  payment: {
    title: 'Оплата',
    amount: 'К оплате',
    cardNumber: 'Номер карты',
    cardExpiry: 'Срок (ММ/ГГ)',
    cardCvc: 'CVC',
    cardHolder: 'Владелец карты',
    pay: 'Оплатить',
    paying: 'Оплачиваем…',
    secureNote: 'Платёж проходит через защищённый платёжный провайдер',
    invalidCard: 'Проверьте данные карты',
  },

  result: {
    success: {
      title: 'Вы записаны!',
      subtitle: 'Бронь подтверждена, оплата прошла.',
      paid: 'Оплачено',
      toBookings: 'На мои брони',
      toSchedule: 'В расписание',
    },
    noCapacity: {
      title: 'Место уже занято',
      subtitle: 'Кто-то успел записаться на секунду раньше. Если оплата прошла — деньги вернутся автоматически.',
      another: 'Выбрать другой класс',
    },
    slotUnavailable: {
      title: 'Запись закрыта',
      subtitle: 'Этот класс больше недоступен для записи.',
      toSchedule: 'Вернуться к расписанию',
    },
    notFound: {
      title: 'Класс не найден',
      subtitle: 'Не удалось найти этот класс.',
      toSchedule: 'Вернуться к расписанию',
    },
    paymentFailed: {
      title: 'Не удалось оплатить',
      subtitle: 'Оплата не прошла. Деньги не списаны — можно попробовать ещё раз.',
      retry: 'Повторить оплату',
      toSchedule: 'Отказаться и вернуться к расписанию',
    },
  },

  myBookings: {
    title: 'Мои брони',
    empty: 'У вас нет предстоящих классов',
    paid: 'Оплачено',
    refunded: 'Возврат средств',
    equipment: { own: 'Своя экипировка', rental: 'Прокатная экипировка' },
  },

  bookingDetails: {
    title: 'Детали брони',
    status: {
      active: 'Подтверждена',
      cancelled_by_client: 'Отменена вами',
      cancelled_by_studio: 'Отменена студией',
    },
    cancel: 'Отменить бронь',
    cancelConfirmTitle: 'Отменить бронь?',
    cancelConfirmMessage: 'Действие необратимо. Деньги вернутся автоматически.',
    cancelConfirm: 'Да, отменить бронь',
    cancelDecline: 'Не отменять',
    cancellationHint: 'Отмена доступна не позднее чем за 10 минут до начала класса',
    cancelledReason: 'Причина',
    studioCancelledReason: 'Класс отменён студией, средства возвращены',
    paymentPaid: 'Оплачено',
    paymentRefunded: 'Возврат средств',
    cancelling: 'Отменяем…',
    cancelSuccess: 'Бронь отменена. Деньги вернутся автоматически.',
    cancelNotFound: 'Бронь не найдена',
    allergies: 'Аллергии',
    noAllergies: 'Аллергии не указаны',
  },

  history: {
    title: 'История классов',
    empty: 'История пуста',
    completed: 'Завершён',
    cancelled: 'Отменён',
    rate: 'Оценить',
    rated: 'Отзыв оставлен',
  },

  rating: {
    title: 'Оценка класса',
    ratePrompt: 'Оцените класс звёздами',
    commentLabel: 'Отзыв (необязательно)',
    commentPlaceholder: 'Поделитесь впечатлениями',
    warning:
      'Отзыв публикуется сразу и публично. Изменить или удалить его будет нельзя.',
    submit: 'Отправить',
    submitting: 'Отправляем…',
    chooseRate: 'Выберите оценку',
    success: 'Спасибо за отзыв!',
    alreadyRated: 'Вы уже оставили отзыв по этому классу',
    notFound: 'Класс ещё не завершён или не найден',
  },

  profile: {
    title: 'Профиль',
    login: 'Логин',
    allergies: 'Аллергии',
    editAllergies: 'Редактировать аллергии',
    save: 'Сохранить',
    saving: 'Сохраняем…',
    saved: 'Сохранено',
    allergyOptions: ['Орехи', 'Глютен', 'Лактоза', 'Морепродукты', 'Яйца', 'Соя'],
    logout: 'Выйти из аккаунта',
    logoutConfirmTitle: 'Выйти из аккаунта?',
    logoutConfirmMessage: 'Потребуется войти снова по логину и паролю.',
    logoutConfirm: 'Выйти',
    logoutDecline: 'Остаться',
    noAllergies: 'Аллергии не указаны',
  },

  states: {
    loading: 'Загрузка…',
    errorTitle: 'Что-то пошло не так',
    retry: 'Повторить',
    refresh: 'Обновить',
    noNetwork: 'Нет соединения. Проверьте подключение к интернету',
    serverError: 'Произошла ошибка. Попробуйте позже',
  },

  errors: {
    invalid_credentials: 'Неверный логин или пароль',
    unauthorized: 'Требуется авторизация',
    slot_not_found: 'Класс не найден',
    slot_unavailable: 'Запись на этот класс закрыта',
    no_capacity: 'Место уже занято, выберите другой слот',
    payment_failed: 'Ошибка оплаты, попробуйте снова',
    cancellation_not_allowed: 'Отмена брони доступна не позднее чем за 10 минут до начала класса',
    booking_not_found: 'Бронь не найдена',
    rating_already_exists: 'Отзыв уже оставлен',
    rating_not_allowed: 'Оценка недоступна для этого класса',
    unknown: 'Произошла ошибка. Попробуйте позже',
  },
};

export default ru;
