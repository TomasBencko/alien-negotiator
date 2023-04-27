import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() isUserMessage!: boolean;
  @Input() messageText!: string;
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
      await this.delay(150); // Adjust this value to control the speed of the animation
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
