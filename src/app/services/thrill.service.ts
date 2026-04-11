import { inject, Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root'
})
export class ThrillService {

  private webSrv = inject(WebService);
  private storageUrl = 'https://nodejs-production-8434.up.railway.app/api';

  constructor() { }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/placeholder.jpg';
    if (imagePath.startsWith('blob:')) return imagePath;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return this.storageUrl + imagePath;
    return imagePath;
  }

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

  addPark(formData: FormData) {
    return this.webSrv.postForm('park/add-park', formData);
  }

  deletePark(id: string) {
    return this.webSrv.post('park/delete-park', { id });
  }

  updatePark(id: string, formData: FormData) {
    formData.append('id', id);
    return this.webSrv.postForm('park/update-park', formData);
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
