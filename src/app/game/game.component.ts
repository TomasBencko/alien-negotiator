import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  messages: { isUserMessage: boolean; text: string }[] = [];
  isTyping: boolean = false;

  constructor(private gameService: GameService) {}

  async testAPI(inputMessage: string) {
    this.messages.push({ isUserMessage: true, text: inputMessage });

    const responsePromise = this.gameService.sendMessageToAI(inputMessage);

    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
    }, 500);

    const response = await responsePromise;
    this.messages.push({ isUserMessage: false, text: response.message });
  }
}
