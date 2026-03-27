import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { HeaderComponent } from '../../components/header/header.component';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('subref') subref!: ElementRef;
  @ViewChild('subref1') subref1!: ElementRef;
  @ViewChild('subref2') subref2!: ElementRef;

  @ViewChild('ride1') ride1!: ElementRef;
  @ViewChild('ride2') ride2!: ElementRef;
  @ViewChild('ride3') ride3!: ElementRef;
  @ViewChild('ride4') ride4!: ElementRef;
  @ViewChild('ride5') ride5!: ElementRef;
  @ViewChild('ride6') ride6!: ElementRef;

  @ViewChild('headRef') headRef!: ElementRef;

  ngOnInit() {
    ScrollTrigger.config({
      limitCallbacks: true
    });
  }

  private static isFirstHomeLoad = true;

  ngAfterViewInit(): void {
    if (!HomeComponent.isFirstHomeLoad) {
      gsap.set("h1", { opacity: 1, y: 0 });
    }
    const delay = HomeComponent.isFirstHomeLoad ? 400 : 1500;
    setTimeout(() => {
      this.initAnimations();
      HomeComponent.isFirstHomeLoad = false;
    }, delay);
  }

  private initAnimations() {
    if (HomeComponent.isFirstHomeLoad) {
      gsap.fromTo("h1",
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1, delay: 0.3, stagger: 0.3, repeat: 0 }
      );
    }

    gsap.fromTo(this.subref.nativeElement,
      { y: '100%', opacity: 0 },
      {
        y: '0%', opacity: 1, duration: 1,
        scrollTrigger: {
          trigger: this.subref.nativeElement,
          start: "-150% 20%",
          end: "10% 80%",
          scrub: true
        }
      }
    );

    gsap.fromTo(this.subref1.nativeElement,
      { x: '-100%', opacity: 0 },
      {
        x: '0%', opacity: 1,
        scrollTrigger: {
          trigger: this.subref1.nativeElement,
          start: "-70% 30%",
          end: "80% 90%",
          scrub: true
        }
      }
    );

    gsap.fromTo(this.subref2.nativeElement,
      { x: '100%', opacity: 0 },
      {
        x: '0%', opacity: 1,
        scrollTrigger: {
          trigger: this.subref2.nativeElement,
          start: "-70% 30%",
          end: "80% 90%",
          scrub: true
        }
      }
    );

    const rides = [this.ride1, this.ride2, this.ride3, this.ride4, this.ride5, this.ride6];
    rides.forEach((ride) => {
      gsap.from(ride.nativeElement, {
        y: '6vh',
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ride.nativeElement,
          start: '20% 75%',
          end: '50% 40%',
          scrub: true
        }
      });
    });

    gsap.from(this.headRef.nativeElement, {
      scale: 0.8,
      opacity: 0,
      duration: 2,
      scrollTrigger: {
        trigger: this.headRef.nativeElement,
        start: '50% 60%',
        end: '100% 35%',
        scrub: true
      }
    });

    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}