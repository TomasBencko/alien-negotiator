import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { introContent, IntroStep } from './intro-content';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
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
