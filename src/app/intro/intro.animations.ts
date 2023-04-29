import { trigger, transition, style, animate } from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms 300ms ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('300ms ease-out', style({ opacity: 0 }))
  ])
]);

export const slideInOutAnimation = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: "translateX(100%)" }),
    animate('300ms 150ms ease-out', style({ transform: "translateX(0%)" }) )
  ]),
  transition(':leave', [
    style({ transform: "translateX(0%)" }),
    animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
  ])
]);
