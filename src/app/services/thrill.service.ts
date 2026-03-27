import { inject, Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root'
})
export class ThrillService {

  private webSrv = inject(WebService);

  constructor() { }

  signup(data: any) {
    return this.webSrv.post('auth/signup', data);
  }

  loginEmail(data: any) {
    return this.webSrv.post('auth/login-email', data);
  }

  loginGoogle(email: string) {
    return this.webSrv.post('auth/login-google', { email });
  }

  adminLogin(unm: string, password: string) {
    return this.webSrv.post('auth/login-admin', { unm, password });
  }

  getAdmins() {
    return this.webSrv.post('admin/admins', {});
  }

  addAdmin(unm: string, password: string) {
    return this.webSrv.post('admin/add-admin', { unm, password });
  }

  deleteAdmin(unm: string) {
    return this.webSrv.post('admin/delete-admin', { unm });
  }

  updateAdmin(id: string, unm: string, password: string) {
    return this.webSrv.post('admin/update-admin', { id, unm, password });
  }

  getUsers() {
    return this.webSrv.post('user/users', {});
  }

  getUserBookings(userId: string) {
    return this.webSrv.post('user/bookings', { userId });
  }

  getParks() {
    return this.webSrv.post('park/parks', {});
  }

  searchParks(query: string) {
    return this.webSrv.post('park/search', { query });
  }

  addPark(data: any) {
    return this.webSrv.post('park/add-park', data);
  }

  deletePark(id: string) {
    return this.webSrv.post('park/delete-park', { id });
  }

  updatePark(id: string, data: any) {
    return this.webSrv.post('park/update-park', { id, ...data });
  }

  getAllBookings() {
    return this.webSrv.post('booking/bookings', {});
  }

  addBooking(data: any) {
    return this.webSrv.post('booking/add-booking', data);
  }

  deleteBooking(id: string) {
    return this.webSrv.post('booking/delete-booking', { id });
  }

  updateBooking(id: string, data: any) {
    return this.webSrv.post('booking/update-booking', { id, ...data });
  }
}