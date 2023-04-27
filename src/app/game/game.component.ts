import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewChecked {
  @ViewChild('messageFeed') private messageFeed!: ElementRef;

  messages: { isUserMessage: boolean; text: string }[] = [];
  isTyping: boolean = false;

  constructor(private gameService: GameService) {}

  async testAPI(inputMessage: string) {
    this.messages.push({ isUserMessage: true, text: inputMessage });

    const responsePromise = this.gameService.sendMessageToAI(inputMessage);

    setTimeout(() => {
      this.isTyping = true;
      this.scrollToBottom();
    }, 500);

    const response = await responsePromise;
    this.isTyping = false;
    this.messages.push({ isUserMessage: false, text: response.message });
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    console.log(`ngAfterViewChecked was called`)
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageFeed.nativeElement.scrollTop = this.messageFeed.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
