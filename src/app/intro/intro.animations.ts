
import { trigger, transition, style, animate } from '@angular/animations';

const easeOut = 'cubic-bezier(0,0,.6,1)';
const easeIn = 'cubic-bezier(.6,0,1,1)';

export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(`300ms 300ms ${easeOut}`, style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate(`300ms ${easeIn}`, style({ opacity: 0 }))
  ])
]);

export const slideInOutAnimation = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: "translateX(100%)" }),
    animate(`400ms 250ms ${easeOut}`, style({ transform: "translateX(0%)" }) )
  ]),
  transition(':leave', [
    style({ transform: "translateX(0%)" }),
    animate(`400ms ${easeIn}`, style({ transform: 'translateX(-100%)' }))
  ])
]);
