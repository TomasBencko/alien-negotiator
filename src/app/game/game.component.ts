import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  messages: { isUserMessage: boolean; text: string }[] = [];

  constructor(private gameService: GameService) {}

  async testAPI(inputMessage: string) {
    this.messages.push({ isUserMessage: true, text: inputMessage });

    const response = await this.gameService.sendMessageToAI(inputMessage);
    this.messages.push({ isUserMessage: false, text: response.message });
  }
}
