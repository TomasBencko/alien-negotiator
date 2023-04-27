import { Component, ElementRef, ViewChild, Renderer2, NgZone } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  @ViewChild('messageFeed') private messageFeed!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  lastScrollTop = 0;
  headerHeight = '30%';

  messages: { isUserMessage: boolean; text: string }[] = [];
  isTyping: boolean = false;

  constructor(
    private gameService: GameService,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  async testAPI(inputMessage: string) {
    this.messages.push({ isUserMessage: true, text: inputMessage });
    setTimeout(() => this.scrollToBottom(), 0);

    const responsePromise = this.gameService.sendMessageToAI(inputMessage);

    setTimeout(() => {
      this.isTyping = true;
      setTimeout(() => this.scrollToBottom(), 0);
    }, 500);

    const response = await responsePromise;
    this.isTyping = false;
    this.messages.push({ isUserMessage: false, text: response.message });
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.ngZone.runOutsideAngular(() => {
      // setTimeout(() => {
        try {
          this.renderer.setStyle(this.header.nativeElement, 'min-height', '30vh');
          this.messageFeed.nativeElement.scrollTop = this.messageFeed.nativeElement.scrollHeight;
        } catch (err) {}
      // }, 0);
    });
  }

  // Add this function
  onScroll() {
    const messageFeedElement = this.messageFeed.nativeElement;
    const scrollTop = messageFeedElement.scrollTop;
    const scrollOffset = messageFeedElement.scrollHeight - messageFeedElement.scrollTop - messageFeedElement.offsetHeight;

    if (scrollOffset <= 100) {
      this.renderer.setStyle(this.header.nativeElement, 'min-height', '30vh');
      this.renderer.removeClass(this.header.nativeElement, 'no-gradient');
    } else {
      this.renderer.setStyle(this.header.nativeElement, 'min-height', '15vh');
      if (scrollTop === 0) {
        this.renderer.addClass(this.header.nativeElement, 'no-gradient');
      } else {
        this.renderer.removeClass(this.header.nativeElement, 'no-gradient');
      }
    }
    this.lastScrollTop = scrollTop;
  }
}
