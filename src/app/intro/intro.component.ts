import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { introContent, IntroStep } from './intro-content';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
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
