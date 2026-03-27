import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ToastComponent } from './components/toast/toast.component';
import Lenis from 'lenis';
import { trigger, transition, style, query, animate, group } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastComponent],
  template: `
    <app-header></app-header>
    <div [@routeAnimations]="getRouteState(outlet)" 
         (@routeAnimations.start)="onAnimationStart()"
         class="route-container">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
    <app-toast></app-toast>
  `,
  styles: [`
    .route-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
      overflow-x: hidden;
    }
  `],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            minHeight: '100vh',
            opacity: 1
          })
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'translateX(100%)', zIndex: 10 })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('1s cubic-bezier(0.23, 1, 0.32, 1)',
              style({ transform: 'translateX(-15%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('1s cubic-bezier(0.23, 1, 0.32, 1)',
              style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'frontend';
  private router = inject(Router);
  private lenis: any;
  private isFirstLoad = true;

  getRouteState(outlet: any) {
    if (this.isFirstLoad && outlet.isActivated) {
      this.isFirstLoad = false;
      return null;
    }
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  onAnimationStart() {
    window.scrollTo(0, 0);
    if (this.lenis) this.lenis.scrollTo(0, { immediate: true });
  }

  ngOnInit() {
    this.lenis = new Lenis();

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }
}
