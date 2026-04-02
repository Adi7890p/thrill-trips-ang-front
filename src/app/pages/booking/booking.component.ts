import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThrillService } from '../../services/thrill.service';
import { ToastService } from '../../services/toast.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  private thrillSrv = inject(ThrillService);
  private toastSrv = inject(ToastService);
  private router = inject(Router);

  park: any = null;

  getTomorrow(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  minDate: string = this.getTomorrow();

  bookingForm: any = {
    persons: 1,
    bookingDate: this.minDate,
    paymentMethod: 'Credit Card',
    addons: [] as string[]
  };

  addonsList = [
    { id: 'express', name: 'Express Pass', price: 250, icon: 'assets/images/express.png', desc: 'Skip regular lines at select rides and attractions.' },
    { id: 'meal', name: 'Meal Pass', price: 180, icon: 'assets/images/meal.png', desc: 'Enjoy hassle-free dining with prepaid meals.' },
    { id: 'locker', name: 'Locker Pass', price: 100, icon: 'assets/images/locker.png', desc: 'Store your valuables safely while enjoying the park.' }
  ];

  ngOnInit() {
    const saved = sessionStorage.getItem('selectedPark');
    if (!saved) {
      this.toastSrv.show('No park selected, going back...', 'error');
      this.router.navigate(['/explore']);
      return;
    }
    this.park = JSON.parse(saved);
  }

  toggleAddon(id: string) {
    const idx = this.bookingForm.addons.indexOf(id);
    if (idx > -1) {
      this.bookingForm.addons.splice(idx, 1);
    } else {
      this.bookingForm.addons.push(id);
    }
  }

  calculateTotal(): number {
    if (!this.park) return 0;
    const persons = Number(this.bookingForm.persons) > 0 ? Number(this.bookingForm.persons) : 1;
    let total = Number(this.park.price) * persons;
    this.bookingForm.addons.forEach((id: string) => {
      const addon = this.addonsList.find(a => a.id === id);
      if (addon) total += addon.price * persons;
    });
    return total;
  }

  getImageUrl(path: string) {
    return this.thrillSrv.getImageUrl(path);
  }

  onConfirm() {
    const uid = sessionStorage.getItem('uid');
    const userEmail = sessionStorage.getItem('userEmail');

    if (!uid) {
      this.toastSrv.show('Session Expired. Please login again.', 'error');
      this.router.navigate(['/login']);
      return;
    }

    const payload = {
      userId: uid,
      userEmail: userEmail || 'Not Provided',
      parkName: this.park.name,
      parkImage: this.park.image,
      bookingDate: this.bookingForm.bookingDate,
      persons: Number(this.bookingForm.persons) > 0 ? Number(this.bookingForm.persons) : 1,
      totalAmount: Number(this.calculateTotal()),
      paymentMethod: this.bookingForm.paymentMethod,
      addons: this.bookingForm.addons
    };

    this.thrillSrv.addBooking(payload).subscribe({
      next: () => {
        this.toastSrv.show('Booking Confirmed! Enjoy your trip!', 'success');
        this.router.navigate(['/user']);
      },
      error: (err) => {
        this.toastSrv.show('Error saving booking to DB', 'error');
      }
    });
  }
}
