import { http } from '../shared/http';

export function login(body) {
  return http.post('/auth/login', body, { auth: false });
}

export function getProfile() {
  return http.get('/profile');
}

export function updateProfile(body) {
  return http.patch('/profile', body);
}

export function getSlots(query) {
  return http.get('/slots', { query });
}

export function getSlotById(slotId) {
  return http.get(`/slots/${slotId}`);
}

export function getChef(chefId) {
  return http.get(`/chefs/${chefId}`);
}

export function getChefSlots(chefId) {
  return http.get(`/chefs/${chefId}/slots`);
}

export function createBooking(body) {
  return http.post('/bookings', body);
}

export function getMyBookings() {
  return http.get('/bookings');
}

export function getBookingHistory() {
  return http.get('/bookings/history');
}

export function getBookingById(bookingId) {
  return http.get(`/bookings/${bookingId}`);
}

export function cancelBooking(bookingId) {
  return http.post(`/bookings/${bookingId}/cancel`);
}

export function createRating(bookingId, body) {
  return http.post(`/bookings/${bookingId}/rating`, body);
}

export function getNotifications() {
  return http.get('/notifications');
}
