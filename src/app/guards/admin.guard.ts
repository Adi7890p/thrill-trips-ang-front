import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const admin = sessionStorage.getItem('admin');

  if (admin == "on") {
    return true;
  } else {

    alert("You are not authorized to access this page.");
    router.navigate(['/home']);
    return false;
  }
};
