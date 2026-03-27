import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "home",
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        data: { animation: 'HomePage' }
    },
    {
        path: "about",
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
        data: { animation: 'AboutPage' }
    },
    {
        path: "explore",
        loadComponent: () => import('./pages/explore/explore.component').then(m => m.ExploreComponent),
        data: { animation: 'ExplorePage' }
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
        data: { animation: 'LoginPage' }
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
        data: { animation: 'AdminPage' }
    },
    {
        path: 'user',
        loadComponent: () => import('./pages/user/user.component').then(m => m.UserComponent),
        data: { animation: 'UserPage' }
    },
    {
        path: 'booking',
        loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent),
        data: { animation: 'BookingPage' }
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' },
];
