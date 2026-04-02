import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThrillService } from '../../services/thrill.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  private thrillSrv = inject(ThrillService);
  private toastSrv = inject(ToastService);
  private router = inject(Router);

  bookings: any[] = [];
  isEditModalOpen: boolean = false;
  selectedBooking: any = null;
  minDate: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  ngOnInit() {
    this.loadUserBookings();
  }

  loadUserBookings() {
    const uid = sessionStorage.getItem('uid');
    if (!uid) {
      this.toastSrv.show('Session expired, please login!', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.thrillSrv.getUserBookings(uid).subscribe((res: any) => {
      this.bookings = res;
    });
  }

  getImageUrl(path: string) {
    return this.thrillSrv.getImageUrl(path);
  }

  getStatus(dateStr: string): 'Pending' | 'Completed' {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(dateStr);
    return bookingDate < today ? 'Completed' : 'Pending';
  }

  deleteBooking(booking: any) {
    if (this.getStatus(booking.bookingDate) === 'Completed') {
      this.toastSrv.show('Completed bookings cannot be cancelled!', 'error');
      return;
    }
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.thrillSrv.deleteBooking(booking._id).subscribe(() => {
        this.toastSrv.show('Booking cancelled successfully', 'info');
        this.loadUserBookings();
      });
    }
  }

  addonsList = [
    { id: 'express', name: 'Express Pass', price: 250, icon: 'assets/images/express.png', desc: 'Skip regular lines at select rides and attractions.' },
    { id: 'meal', name: 'Meal Pass', price: 180, icon: 'assets/images/meal.png', desc: 'Enjoy hassle-free dining with prepaid meals.' },
    { id: 'locker', name: 'Locker Pass', price: 100, icon: 'assets/images/locker.png', desc: 'Store your valuables safely while enjoying the park.' }
  ];

  openEdit(booking: any) {
    if (this.getStatus(booking.bookingDate) === 'Completed') {
      this.toastSrv.show('Past bookings cannot be edited!', 'error');
      return;
    }
    this.selectedBooking = JSON.parse(JSON.stringify(booking));

    if (!this.selectedBooking.parkPrice) {
      let addonTotal = 0;
      this.selectedBooking.addons.forEach((id: string) => {
        const addon = this.addonsList.find(a => a.id === id);
        if (addon) addonTotal += addon.price;
      });
      const currentPersons = Number(this.selectedBooking.persons) || 1;
      this.selectedBooking.parkPrice = (Number(this.selectedBooking.totalAmount) - (addonTotal * currentPersons)) / currentPersons;
    }

    this.isEditModalOpen = true;
  }

  toggleEditAddon(id: string) {
    const idx = this.selectedBooking.addons.indexOf(id);
    if (idx > -1) {
      this.selectedBooking.addons.splice(idx, 1);
    } else {
      this.selectedBooking.addons.push(id);
    }
    this.recalculateEditTotal();
  }

  recalculateEditTotal() {
    const basePrice = Number(this.selectedBooking.parkPrice) || 800;
    const persons = Number(this.selectedBooking.persons) > 0 ? Number(this.selectedBooking.persons) : 1;
    let total = basePrice * persons;
    this.selectedBooking.addons.forEach((id: string) => {
      const addon = this.addonsList.find(a => a.id === id);
      if (addon) total += addon.price * persons;
    });
    this.selectedBooking.totalAmount = total;
  }

  updateBooking() {
    this.selectedBooking.persons = Number(this.selectedBooking.persons) > 0 ? Number(this.selectedBooking.persons) : 1;
    this.recalculateEditTotal();
    this.thrillSrv.updateBooking(this.selectedBooking._id, this.selectedBooking).subscribe({
      next: () => {
        this.toastSrv.show('Booking details updated successfully', 'success');
        this.isEditModalOpen = false;
        this.loadUserBookings();
      },
      error: () => this.toastSrv.show('Error updating booking', 'error')
    });
  }

  async generateReceipt(booking: any) {
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(245, 158, 11); // Amber
    doc.setFont('helvetica', 'bold');
    doc.text('THRILL TRIPS RECEIPT', 105, y, { align: 'center' });
    y += 10;
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 15;

    // Booking info
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text(`Booking ID: ${booking._id.substring(0, 8).toUpperCase()}`, 20, y);
    doc.text(`Date: ${booking.bookingDate}`, 190, y, { align: 'right' });
    y += 20;

    // Park details
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(booking.parkName.toUpperCase(), 20, y);
    y += 10;

    if (booking.parkImage) {
      try {
        const fullImageUrl = this.getImageUrl(booking.parkImage);
        doc.addImage(fullImageUrl, 'JPEG', 20, y, 170, 80);
        y += 90;
      } catch (e) { y += 10; }
    }

    // Bill Table
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Persons: ${booking.persons}`, 20, y);
    y += 8;
    doc.text(`Addons: ${booking.addons.length > 0 ? booking.addons.join(', ') : 'None'}`, 20, y);
    y += 8;
    doc.text(`Payment: ${booking.paymentMethod}`, 20, y);
    y += 15;

    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129); // Green
    doc.text(`Total Amount: Rs.${booking.totalAmount}`, 20, y);

    y += 15;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for booking with Thrill Trips! Show this receipt at the entrance.', 105, y, { align: 'center' });

    doc.save(`${booking.parkName}_thill_trips.pdf`);
  }
}
