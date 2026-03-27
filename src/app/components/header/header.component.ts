import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private router = inject(Router);

  isLoggedIn() {
    return !!sessionStorage.getItem('token');
  }

  isAdmin() {
    return !!sessionStorage.getItem('admin');
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
