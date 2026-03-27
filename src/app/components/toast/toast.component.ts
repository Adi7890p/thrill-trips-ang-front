import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-[20vh] right-10 z-[100] flex flex-col gap-4">
      <div *ngFor="let toast of toasts; let i = index" 
           class="min-w-[320px] p-6 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/10 animate-slide-in flex items-center gap-4 transition-all"
           [ngClass]="{
             'bg-green-500/20 border-green-500/30 text-green-400': toast.type === 'success',
             'bg-red-500/20 border-red-500/30 text-red-400': toast.type === 'error',
             'bg-blue-500/20 border-blue-500/30 text-blue-400': toast.type === 'info'
           }">
        <div class="w-2 h-2 rounded-full animate-pulse" 
             [ngClass]="{
               'bg-green-600': toast.type === 'success',
               'bg-red-600': toast.type === 'error',
               'bg-blue-600': toast.type === 'info'
             }">
        </div>
        <span class="tracking-widest uppercase font-bold text-sm font- leading-tight text-white text-center w-full ">{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.toastService.toastState.subscribe((toast: ToastMessage) => {
      this.toasts.push(toast);
      setTimeout(() => {
        this.toasts.shift();
      }, 2000);
    });
  }
}
