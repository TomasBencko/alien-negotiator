import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  constructor(private gameService: GameService) {}

  inputMessage: string = 'Hello, Zoglorp! How are you today?';
  outputMessage: string = '';

  async testAPI() {
    const playerMessage = this.inputMessage;
    const response = await this.gameService.sendMessageToAI(playerMessage);
    this.outputMessage = response.message;
  }
}
