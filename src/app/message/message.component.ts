import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() isUserMessage!: boolean;
  // isUserMessage = true; // This will be set dynamically later
  messageText = 'Sample message'; // This will be replaced with actual message text later
}
