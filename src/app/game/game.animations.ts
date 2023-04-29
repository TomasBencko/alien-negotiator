import { trigger, style, animate, transition, state } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  state('void', style({ opacity: 0 })),
  transition('void <=> *', animate('1s ease-in')),
]);

export const fadeInTranslateAnimation = trigger('fadeInTranslate', [
  state('void', style({ opacity: 0, transform: 'translateY(-100%)' })),
  transition('void <=> *', animate('1s ease-in', style({ opacity: 1, transform: 'translateY(0)' }))),
]);
