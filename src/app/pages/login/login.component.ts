import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThrillService } from '../../services/thrill.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private thrillSrv = inject(ThrillService);
  private toastSrv = inject(ToastService);
  private router = inject(Router);

  isAdmin: boolean = false;
  isSignup: boolean = false;

  formData = {
    identifier: '',
    password: ''
  };

  setTab(tab: 'user' | 'admin') {
    this.isAdmin = (tab === 'admin');
    this.isSignup = false;
    this.formData = { identifier: '', password: '' };
  }

  toggleSignup() {
    this.isSignup = !this.isSignup;
  }

  onSubmit() {
    if (this.isAdmin) {
      this.thrillSrv.adminLogin(this.formData.identifier, this.formData.password).subscribe({
        next: (res: any) => {
          this.toastSrv.show("Admin Access Granted!", "success");
          sessionStorage.setItem('admin', 'on');
          setTimeout(() => this.router.navigate(['/admin']), 1200);
        },
        error: (err: any) => this.toastSrv.show("Admin Credentials Incorrect", "error")
      });
    } else {
      if (this.isSignup) {
        this.thrillSrv.signup({ 
          email: this.formData.identifier, 
          password: this.formData.password
        }).subscribe({
          next: (res: any) => {
            this.toastSrv.show("Signup Successful! Please Login.", "success");
            this.isSignup = false;
          },
          error: (err: any) => this.toastSrv.show("Signup Failed: " + err.error.details, "error")
        });
      } else {
        this.thrillSrv.loginEmail({ email: this.formData.identifier, password: this.formData.password }).subscribe({
            next: (res: any) => {
            const token = res.token;
            this.toastSrv.show("Login Successful!", "success");
            
            sessionStorage.clear();
            sessionStorage.setItem('token', token);
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            sessionStorage.setItem('uid', payload.id || payload.uid);
            sessionStorage.setItem('userEmail', payload.email);
            
            setTimeout(() => this.router.navigate(['/user']), 1200);
          },
          error: (err: any) => this.toastSrv.show("Invalid Email or Password", "error")
        });
      }
    }
  }

  onGoogleLogin() {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const email = result.user.email;
        if (email) {
          this.thrillSrv.loginGoogle(email).subscribe({
            next: (res: any) => {
              const token = res.token;
              this.toastSrv.show("Google Login Successful!", "success");
              
              sessionStorage.clear();
              sessionStorage.setItem('token', token);
              
              const payload = JSON.parse(atob(token.split('.')[1]));
              sessionStorage.setItem('uid', payload.id || payload.uid);
              sessionStorage.setItem('userEmail', payload.email);

              setTimeout(() => this.router.navigate(['/user']), 1000);
            },
            error: (err: any) => this.toastSrv.show("Backend Sync Failed", "error")
          });
        }
      })
      .catch((error: any) => {
        this.toastSrv.show(`Error: ${error.code}`, "error");
      });
  }
}
