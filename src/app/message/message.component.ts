import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() isUserMessage!: boolean;
  @Input() messageText!: string;
  @Output() scrollToBottomEvent = new EventEmitter<void>();
  displayedMessage = '';

  ngOnInit() {
    if (!this.isUserMessage) {
      this.animateResponseText();
    } else {
      this.displayedMessage = this.messageText;
    }
  }

  async animateResponseText() {
    const words = this.messageText.split(' ');
    for (const word of words) {
      this.displayedMessage += word + ' ';
      this.scrollToBottomEvent.emit();
      await this.delay(266); // Adjust this value to control the speed of the animation
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
