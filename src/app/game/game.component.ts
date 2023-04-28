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

  messages: { isUserMessage: boolean; text: string; emotion?: string }[] = [];
  isTyping: boolean = false;
  alienState: string = 'annoyance';

  constructor(
    private gameService: GameService,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  gptRequest(inputMessage: string) {
    this.messages.push({ isUserMessage: true, text: inputMessage });
    setTimeout(() => this.scrollToBottom(), 0);

    const responseObservable = this.gameService.sendMessageToAI(this.messages);

    setTimeout(() => {
      this.isTyping = true;
      setTimeout(() => this.scrollToBottom(), 0);
    }, 500);

    responseObservable.subscribe({
      next: (response) => {
        console.log(`Received following response:`);
        console.log(JSON.stringify(response));

        this.isTyping = false;

        // let parsedResponse = null;
        // try {
        //   parsedResponse = JSON.parse(response.message); // .replace('\\n', '",')
        //
        // } catch (e) {
        //   console.error(`Parsing response was unsuccessful`);
        //   console.error(e);
        // }
        // const text = parsedResponse ? parsedResponse.text : response.message;
        // const emotion = parsedResponse ? this.parseEmotion(parsedResponse.emotion) : 'awe';

        const { text, emotion } = this.parseResponse(response.message);

        this.messages.push({ isUserMessage: false, text, emotion });
        this.alienState = emotion;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error:', error);
        this.isTyping = false;
        this.messages.push({
          isUserMessage: false,
          text: 'An error occurred. Please try again later.',
        });
        this.scrollToBottom();
      }
    });
  }


  scrollToBottom(): void {
    this.ngZone.runOutsideAngular(() => {
      try {
        this.renderer.setStyle(this.header.nativeElement, 'min-height', '40vh');
        this.messageFeed.nativeElement.scrollTop = this.messageFeed.nativeElement.scrollHeight;
      } catch (err) {}
    });
  }

  onScroll() {
    const messageFeedElement = this.messageFeed.nativeElement;
    const scrollTop = messageFeedElement.scrollTop;
    const scrollOffset = messageFeedElement.scrollHeight - messageFeedElement.scrollTop - messageFeedElement.offsetHeight;

    if (scrollOffset <= 100) {
      this.renderer.setStyle(this.header.nativeElement, 'min-height', '40vh');
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



  parseResponse(response: string) {
    const regex = /\[(.*?)]/;
    const match = response.match(regex);
    let emotion = match && match[1] ? match[1] : '';
    emotion = this.parseEmotion(emotion);
    const text = response.replace(/\s*\[[^\]]*]/g, '');

    return { emotion, text };
  }

// Example usage:
//   const inputString = "Hello [world]! This is a [sample] string with [text] inside square brackets.";
//   const result = extractTextInsideBrackets(inputString);
//   console.log(result);



  parseEmotion(emotion: string) {

    const availableEmotions = [
      'serenity','joy','ecstasy','love','acceptance','trust','admiration','submission','apprehension','fear','terror',
      'awe','distraction','surprise','amazement','disapproval','pensiveness','sadness','grief','remorse','boredom',
      'disgust','loathing','contempt','annoyance','anger','rage','aggressiveness','interest','anticipation','vigilance',
      'optimism'
    ]

    if (availableEmotions.includes(emotion)) return emotion;

    switch (emotion.trim().toLowerCase()) {
      case 'arrogance': emotion = 'pensiveness'; break;
      case 'defensive': emotion = 'anger'; break;
      case 'confident': emotion = 'pensiveness'; break;
      case 'amusement': emotion = 'joy'; break;
      default: emotion = 'annoyance';
    }

    return emotion;
  }
}
