import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { introContent, IntroStep } from './intro-content';
import { trigger, transition, style, state, animate } from '@angular/animations';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate('400ms ease-out')]),
      transition(':leave', [animate('400ms ease-in', style({ opacity: 0 }))])
    ]),
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      transition(':enter', [style({ transform: 'translateX(100%)', opacity: 0 }), animate('400ms ease-out')]),
      transition(':leave', [animate('400ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))])
    ])
  ]
})
export class IntroComponent {
  introContent: IntroStep[] = introContent;
  currentIndex = 0;

  constructor(private router: Router) {}

  onNext(): void {
    if (this.currentIndex < this.introContent.length - 1) {
      this.currentIndex++;
    } else {
      this.router.navigate(['/game']);
    }
  }

  onSkip(): void {
    this.router.navigate(['/game']);
  }
}
