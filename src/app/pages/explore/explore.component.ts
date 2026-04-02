import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThrillService } from '../../services/thrill.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  private thrillSrv = inject(ThrillService);
  private toastSrv = inject(ToastService);
  private router = inject(Router);

  parks: any[] = [];
  filteredParks: any[] = [];
  searchQuery: string = '';
  sortBy: string = '';

  getImageUrl(path: string) {
    return this.thrillSrv.getImageUrl(path);
  }

  isDetailModalOpen: boolean = false;
  selectedPark: any = null;

  ngOnInit() {
    this.loadParks();
  }

  loadParks() {
    this.thrillSrv.getParks().subscribe((res: any) => {
      this.parks = res;
      this.filteredParks = [...this.parks];
    });
  }

  onSearch() {
    if (this.searchQuery.trim() === '') {
      this.filteredParks = [...this.parks];
    } else {
      this.filteredParks = this.parks.filter(park =>
        park.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        park.city.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        park.category.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        park.price.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        park.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.sortParks();
  }

  sortParks() {
    if (this.sortBy === 'lowToHigh') {
      this.filteredParks.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'highToLow') {
      this.filteredParks.sort((a, b) => b.price - a.price);
    }
  }

  openDetails(park: any) {
    this.selectedPark = park;
    this.isDetailModalOpen = true;
  }

  closeDetails() {
    this.isDetailModalOpen = false;
    this.selectedPark = null;
  }

  bookNow(park: any) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.toastSrv.show('Please Login to Book your tickets!', 'error');
      this.router.navigate(['/login']);
      return;
    }

    sessionStorage.setItem('selectedPark', JSON.stringify(park));
    this.router.navigate(['/booking']);
  }

  getRideImages(category: string): string[] {
    const assetsPath = 'assets/images/';
    if (category === 'Amusement Park') {
      return [assetsPath + 'ride1.png', assetsPath + 'ride2.png', assetsPath + 'ride3.png'];
    } else if (category === 'Waterpark') {
      return [assetsPath + 'waterride.png', assetsPath + 'waterride1.png', assetsPath + 'waterride2.png'];
    } else if (category === 'Theme Park') {
      return [assetsPath + 'theme1.png', assetsPath + 'theme3.png', assetsPath + 'theme4.png'];
    }
    return [];
  }
}
