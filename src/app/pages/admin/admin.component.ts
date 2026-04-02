import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThrillService } from '../../services/thrill.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  private thrillService = inject(ThrillService);
  private toastService = inject(ToastService);

  selectedTab: 'parks' | 'bookings' | 'admins' = 'parks';

  parks: any[] = [];
  bookings: any[] = [];
  admins: any[] = [];

  isAddModalOpen: boolean = false;
  isAdminModalOpen: boolean = false;

  parkForm = { name: '', city: '', category: '', price: 0, description: '', image: '' };
  adminForm = { unm: '', password: '' };
  selectedParkId: string | null = null;
  selectedAdminUnm: string | null = null;
  selectedImageFile: File | null = null;
  selectedImagePreview: string | null = null;

  ngOnInit() {
    this.loadData();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.selectedImagePreview = URL.createObjectURL(file);
    }
  }

  getImageUrl(imagePath: string): string {
    return this.thrillService.getImageUrl(imagePath);
  }


  loadData() {
    if (this.selectedTab === 'parks') {
      this.thrillService.getParks().subscribe((res: any) => this.parks = res);
    } else if (this.selectedTab === 'bookings') {
      this.thrillService.getAllBookings().subscribe((res: any) => this.bookings = res);
    } else if (this.selectedTab === 'admins') {
      this.thrillService.getAdmins().subscribe((res: any) => this.admins = res);
    }
  }

  selectTab(tab: 'parks' | 'bookings' | 'admins') {
    this.selectedTab = tab;
    this.loadData();
  }

  toggleAddModal() {
    this.isAddModalOpen = !this.isAddModalOpen;
    if (!this.isAddModalOpen) {
      this.selectedParkId = null;
      this.selectedImageFile = null;
      this.selectedImagePreview = null;
      this.parkForm = { name: '', city: '', category: '', price: 0, description: '', image: '' };
    }
  }

  toggleAdminModal() {
    this.isAdminModalOpen = !this.isAdminModalOpen;
    if (!this.isAdminModalOpen) {
      this.selectedAdminUnm = null;
      this.adminForm = { unm: '', password: '' };
    }
  }

  editPark(id: string) {
    const park = this.parks.find(p => p._id === id);
    if (park) {
      this.parkForm = { ...park, price: Number(park.price) };
      this.selectedParkId = id;
      this.isAddModalOpen = true;
    }
  }

  editAdmin(unm: string) {
    const admin = this.admins.find(a => a.unm === unm);
    if (admin) {
      this.adminForm = { unm: admin.unm, password: '' };
      this.selectedAdminUnm = unm;
      this.isAdminModalOpen = true;
    }
  }

  addPark() {
    const { name, city, category, price, description } = this.parkForm;
    if (!name || !city || !category || !price || !description) {
      this.toastService.show('Please fill in all fields!', 'error');
      return;
    }
    if (!this.selectedParkId && !this.selectedImageFile) {
      this.toastService.show('Please upload an image!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('city', city);
    formData.append('category', category);
    formData.append('price', price.toString());
    formData.append('description', description);
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    } else if (this.parkForm.image) {
      // keep existing image path on edit with no new file
      formData.append('existingImage', this.parkForm.image);
    }

    if (this.selectedParkId) {
      this.thrillService.updatePark(this.selectedParkId, formData).subscribe(() => {
        this.toastService.show('Park updated successfully!', 'success');
        this.toggleAddModal();
        this.loadData();
      });
    } else {
      this.thrillService.addPark(formData).subscribe(() => {
        this.toastService.show('Park added successfully!', 'success');
        this.toggleAddModal();
        this.loadData();
      });
    }
  }

  addAdmin() {
    const { unm, password } = this.adminForm;
    if (!unm || !password) {
      this.toastService.show('Please provide both username and password!', 'error');
      return;
    }
    if (password.length < 3) {
      this.toastService.show('Password must be at least 3 characters!', 'error');
      return;
    }

    if (this.selectedAdminUnm) {
      this.thrillService.updateAdmin(this.selectedAdminUnm, unm, password).subscribe(() => {
        this.toastService.show('Admin account updated!', 'success');
        this.toggleAdminModal();
        this.loadData();
      });
    } else {
      this.thrillService.addAdmin(unm, password).subscribe(() => {
        this.toastService.show('Admin created successfully!', 'success');
        this.toggleAdminModal();
        this.loadData();
      });
    }
  }

  viewImage(img: string) {
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${img}" style="width:100%; height:auto;">`);
    }
  }

  deletePark(id: string) {
    if (confirm('Delete this park?')) {
      this.thrillService.deletePark(id).subscribe(() => {
        this.toastService.show('Park deleted successfully', 'info');
        this.loadData();
      });
    }
  }

  deleteAdmin(unm: string) {
    if (confirm('Delete this admin?')) {
      this.thrillService.deleteAdmin(unm).subscribe(() => {
        this.toastService.show('Admin account removed', 'info');
        this.loadData();
      });
    }
  }
}
