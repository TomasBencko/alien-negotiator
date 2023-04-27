import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  inputMessage = '';

  onSendMessage() {
    this.sendMessage.emit(this.inputMessage);
    this.inputMessage = '';
    this.messageInput.nativeElement.blur();
  }
}
