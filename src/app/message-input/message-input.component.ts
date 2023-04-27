import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {
  @Output() sendMessage = new EventEmitter<string>();
  inputMessage = '';

  onSendMessage() {
    this.sendMessage.emit(this.inputMessage);
    this.inputMessage = '';
  }
}
