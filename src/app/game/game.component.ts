import { Component, ElementRef, ViewChild, Renderer2, NgZone, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { MessageInputComponent } from "../message-input/message-input.component";
import { fadeInAnimation, fadeInTranslateAnimation, endingAnimation } from './game.animations';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [fadeInAnimation, fadeInTranslateAnimation, endingAnimation]
})
export class GameComponent implements OnInit {
  @ViewChild('messageFeed') private messageFeed!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild(MessageInputComponent, { read: ElementRef }) inputField!: ElementRef;
  lastScrollTop = 0;
  headerHeight = '30%';
  gameState = 'in progress';

  messages: { isUserMessage: boolean; text: string; emotion?: string }[] = [];
  isTyping: boolean = false;
  alienState: string = 'annoyance';

  constructor(
    private gameService: GameService,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.gptRequest();
    }, 1500);
  }

  gptRequest(inputMessage?: string) {
    this.gameState = 'in progress';
    if (inputMessage) this.messages.push({ isUserMessage: true, text: inputMessage });
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

    if (scrollOffset <= 1) {
      this.renderer.setStyle(this.header.nativeElement, 'min-height', '40vh');
      this.renderer.removeClass(this.header.nativeElement, 'no-gradient');
      this.renderer.removeClass(this.inputField.nativeElement, 'input-shadow');
    } else {
      this.renderer.setStyle(this.header.nativeElement, 'min-height', '15vh');
      this.renderer.addClass(this.inputField.nativeElement, 'input-shadow');
      if (scrollTop === 0) {
        this.renderer.addClass(this.header.nativeElement, 'no-gradient');
      } else {
        this.renderer.removeClass(this.header.nativeElement, 'no-gradient');
      }
    }
    this.lastScrollTop = scrollTop;
  }



  parseResponse(response: string) {
    const regexSquare = /\[(.*?)]/;
    const matchSquare = response.match(regexSquare);
    let extractedEmotion = matchSquare && matchSquare[1] ? matchSquare[1] : '';

    const regexCurly = /\{(.*?)}/;
    const matchCurly = response.match(regexCurly);
    let gameState = matchCurly && matchCurly[1] ? matchCurly[1] : '';
    gameState = gameState.toLowerCase().trim();

    if (gameState) {
      if (gameState === 'accept') {
        this.gameState = 'success';
        if (!extractedEmotion) extractedEmotion = 'ecstasy';

      } else if (gameState === 'refuse') {
        this.gameState = 'fail';
        if (!extractedEmotion) extractedEmotion = 'aggressiveness';
      }
      console.log(`New game state: ${gameState}`);
    }

    const emotion = this.parseEmotion(extractedEmotion);
    const text = response.replace(/\s*\[[^\]]*]/g, '').replace(/\s*\{[^}]*}/g, '').trim();
    console.log(`Parsed emotion: ${extractedEmotion} → ${emotion}`);

    return { emotion, text };
  }


  parseEmotion(emotion: string) {

    emotion = emotion.trim().toLowerCase();
    const availableEmotions = [
      'serenity', 'joy', 'ecstasy', 'love', 'acceptance', 'trust', 'admiration', 'submission', 'apprehension', 'fear',
      'terror', 'awe', 'distraction', 'surprise', 'amazement', 'disapproval', 'pensiveness', 'sadness', 'grief',
      'remorse', 'boredom', 'disgust', 'loathing', 'contempt', 'annoyance', 'anger', 'rage', 'aggressiveness',
      'interest', 'anticipation', 'vigilance', 'optimism'
    ];

    if (availableEmotions.includes(emotion)) return emotion;

    if (['serenity', 'relief', 'relaxation', 'calm', 'peace', 'restfulness', 'repose', 'quietude', 'tranquility', 'comfort', 'calmness', 'peacefulness', 'warmth', 'fulfillment', 'hope', 'humility', 'kindness', 'benevolence', 'altruism', 'compassion', 'empathy', 'sympathy'].includes(emotion)) return 'serenity';
    else if (['joy', 'amusement', 'happy', 'happiness', 'mirth', 'lightheartedness', 'playfulness', 'pride', 'satisfaction', 'contentment', 'bliss', 'generosity'].includes(emotion)) return 'joy';
    else if (['ecstasy', 'whimsical', 'laughter', 'chuckles', 'elation', 'delight', 'zest'].includes(emotion)) return 'ecstasy';
    else if (['love', 'tenderness', 'affection', 'attachment', 'desire'].includes(emotion)) return 'love';
    else if (['acceptance'].includes(emotion)) return 'acceptance';
    else if (['trust', 'faith', 'confidence', 'confident', 'assurance', 'reliance', 'loyalty', 'commitment', 'devotion', 'gratitude', 'appreciation', 'forgiveness'].includes(emotion)) return 'trust';
    else if (['admiration'].includes(emotion)) return 'admiration';
    else if (['submission', 'coyness', 'compliance', 'acquiescence', 'obedience', 'surrender', 'yielding', 'conformity', 'docility', 'meekness', 'resignation'].includes(emotion)) return 'submission';
    else if (['apprehension', 'reluctance', 'worry', 'worried', 'anxiety'].includes(emotion)) return 'apprehension';
    else if (['fear', 'insecurity', 'hesitation', 'timidity', 'caution', 'wariness'].includes(emotion)) return 'fear';
    else if (['terror'].includes(emotion)) return 'terror';
    else if (['awe', 'wonder', 'reverence', 'veneration', 'respect', 'esteem', 'infatuation', 'fascination', 'captivation'].includes(emotion)) return 'awe';
    else if (['distraction', 'confusion', 'perplexity', 'uncertain', 'uncertainty', 'doubt', 'dubious', 'indecision', 'ambivalence', 'hesitancy', 'vacillation', 'disorientation', 'puzzlement'].includes(emotion)) return 'distraction';
    else if (['surprise', 'bewilderment', 'shock', 'disbelief', 'incredulity'].includes(emotion)) return 'surprise';
    else if (['amazement', 'astonishment'].includes(emotion)) return 'amazement';
    else if (['disapproval'].includes(emotion)) return 'disapproval';
    else if (['pensiveness', 'introspection'].includes(emotion)) return 'pensiveness';
    else if (['sadness', 'sad', 'loneliness', 'melancholy', 'regret', 'disappointment', 'gloom', 'homesickness', 'longing', 'nostalgia'].includes(emotion)) return 'sadness';
    else if (['grief', 'despair', 'sorrow'].includes(emotion)) return 'grief';
    else if (['remorse', 'wistfulness', 'guilt', 'shame', 'embarrassment', 'humiliation', 'mortification', 'chagrin', 'awkwardness', 'self-consciousness', 'vulnerability', 'inadequacy', 'powerlessness', 'helplessness', 'overwhelmed'].includes(emotion)) return 'remorse';
    else if (['boredom', 'bored', 'disinterest', 'indifference', 'apathy', 'complacency', 'neutrality', 'detachment', 'unconcern', 'lethargy'].includes(emotion)) return 'boredom';
    else if (['disgust', 'revulsion', 'repulsion', 'nausea', 'abhorrence', 'aversion'].includes(emotion)) return 'disgust';
    else if (['loathing'].includes(emotion)) return 'loathing';
    else if (['contempt', 'sarcasm', 'cynicism', 'disdain', 'arrogance', 'stubbornness', 'bitterness', 'rejection', 'resentment', 'self-pity', 'skepticism', 'pessimism', 'betrayal'].includes(emotion)) return 'contempt';
    else if (['annoyance'].includes(emotion)) return 'annoyance';
    else if (['anger', 'defensive', 'angry', 'irritation', 'exasperation', 'frustration', 'jealousy', 'envy', 'coldness'].includes(emotion)) return 'anger';
    else if (['rage'].includes(emotion)) return 'rage';
    else if (['aggressiveness'].includes(emotion)) return 'aggressiveness';
    else if (['interest'].includes(emotion)) return 'interest';
    else if (['anticipation', 'curiosity', 'eagerness', 'impatience', 'excitement', 'enthusiasm', 'inquisitiveness', 'yearning', 'inspiration', 'motivation', 'determination', 'assertiveness', 'courage', 'hunger', 'thirst'].includes(emotion)) return 'anticipation';
    else if (['vigilance'].includes(emotion)) return 'vigilance';
    else if (['optimism'].includes(emotion)) return 'optimism';

    // SLOVAK TRANSLATIONS
    else if (['pokoj', 'pokojný' , 'úľava', 'relaxácia', 'zrelaxovaný', 'kľud', 'kľudný', 'mier', 'pohoda', 'odpočinok', 'ticho', 'pokoj', 'komfort', 'kľud', 'mierovosť', 'teplo', 'naplnenie', 'naplnený', 'nádej', 'pokora', 'pokorný', 'láskavosť', 'láskavý', 'dobrota', 'altruizmus', 'empatický'].includes(emotion)) return 'serenity';
    else if (['radosť', 'zábava', 'šťastný', 'šťastie', 'veselosť', 'veselý', 'bezstarostnosť', 'bezstarostný', 'hravosť', 'hravý', 'hrdosť', 'hrdý', 'spokojnosť', 'spokojný', 'uspokojenie', 'blaženosť', 'blažený', 'štedrosť', 'štedrý'].includes(emotion)) return 'joy';
    else if (['extáza', 'rozmar', 'smiech', 'nadšenie', 'nadšený', 'potešenie', 'potešený', 'chuť'].includes(emotion)) return 'ecstasy';
    else if (['láska', 'nežnosť', 'nežný', 'náklonnosť', 'pripútanie', 'túžba'].includes(emotion)) return 'love';
    else if (['akceptácia'].includes(emotion)) return 'acceptance';
    else if (['dôvera', 'viera', 'sebadôvera', 'sebaistý', 'istota', 'závislosť', 'vernosť', 'verný', 'záväzok', 'oddanosť', 'oddaný', 'vďačnosť', 'vďačný', 'uznanie', 'odpustenie'].includes(emotion)) return 'trust';
    else if (['obdiv', 'obdivujúci'].includes(emotion)) return 'admiration';
    else if (['podriadenosť', 'podriadený', 'plachosť', 'plachý', 'poslušnosť', 'poslušný', 'súhlas', 'kapitulácia', 'ustupovanie', 'konformita', 'ovládateľnosť', 'tichosť', 'rezignácia', 'rezignovaný'].includes(emotion)) return 'submission';
    else if (['obavy', 'neochota', 'starosti', 'znepokojený', 'úzkosť'].includes(emotion)) return 'apprehension';
    else if (['strach', 'neistota', 'váhanie', 'ostych', 'opatrnosť', 'opatrný', 'ustráchaný', 'vystrašený'].includes(emotion)) return 'fear';
    else if (['hrôza'].includes(emotion)) return 'terror';
    else if (['úžas', 'obdiv', 'úcta', 'úcta', 'rešpekt', 'úcta', 'zamilovanosť', 'zamilovaný', 'fascinácia', 'okúzlenie', 'fascinovaný', 'okúzlený'].includes(emotion)) return 'awe';
    else if (['rozptýlenie', 'rozptýlený', 'zmätok', 'zmätený', 'zložitosť', 'neistota', 'neistý', 'pochybnosť', 'nerozhodnosť', 'nerozhodný', 'ambivalencia', 'váhanie', 'váhavý', 'kolísanie', 'dezorientácia', 'dezorientovaný', 'zmätenosť'].includes(emotion)) return 'distraction';
    else if (['prekvapenie', 'prekvapený', 'záhada', 'šok', 'šokovaný', 'nevera', 'nedôverčivosť', 'nedôverčivý'].includes(emotion)) return 'surprise';
    else if (['úžas', 'užasnutý', 'ohromenie', 'ohromený'].includes(emotion)) return 'amazement';
    else if (['nepáči', 'nespokojný'].includes(emotion)) return 'disapproval';
    else if (['zamyslenie', 'sebaskúmanie', 'zamyslený'].includes(emotion)) return 'pensiveness';
    else if (['smútok', 'smutný', 'osamelosť', 'osamelý', 'melanchólia', 'melancholický', 'ľútosť', 'sklamanie', 'sklamaný', 'temnota', 'túžba po domove', 'túžba', 'nostalgie'].includes(emotion)) return 'sadness';
    else if (['žiaľ', 'zúfalstvo', 'žiaľ', 'zúfalý'].includes(emotion)) return 'grief';
    else if (['výčitky', 'nostalgie', 'vina', 'hanba', 'rozpaky', 'poníženie', 'ponížený', 'zahanbenie', 'zahanvený', 'znechutenie', 'znechutený', 'neobratnosť', 'sebavedomosť', 'zraniteľnosť', 'nedostatok', 'bezmocnosť', 'bezmocný', 'bezradnosť', 'bezradný'].includes(emotion)) return 'remorse';
    else if (['nuda', 'unudený', 'nezáujem', 'ľahostajnosť', 'ľahostajný', 'apatia', 'apatický', 'spokojnosť', 'spokojný', 'neutralita', 'neutrálny', 'odstup', 'nezáujem', 'lenivosť', 'lenivý'].includes(emotion)) return 'boredom';
    else if (['znechutenie', 'znechutený', 'odpor', 'nevoľnosť', 'averzia', 'odpor'].includes(emotion)) return 'disgust';
    else if (['nenávisť', 'nenávistný'].includes(emotion)) return 'loathing';
    else if (['pohŕdanie', 'pohŕdavý', 'sarkazmus', 'sarkastický', 'cynizmus', 'cynický', 'opovrhnutie', 'arogancia', 'arogantný', 'zatrpknutosť', 'zatrpknutý', 'odmietnutie', 'odmietavý', 'zášť', 'sebaľútosť', 'skeptickosť', 'skeptický', 'pesimizmus', 'pesimistický', 'zrada'].includes(emotion)) return 'contempt';
    else if (['otravovanie'].includes(emotion)) return 'annoyance';
    else if (['hnev', 'nahnevaný', 'defenzívny', 'nahnevaný', 'podráždenie', 'podráždený', 'rozčuľovanie', 'rozčúlený', 'frustrácia', 'frustrovaný', 'žiarlivosť', 'žiarlivý', 'závisť', 'chladnosť', 'chladný'].includes(emotion)) return 'anger';
    else if (['zúrivý', 'zúrivosť'].includes(emotion)) return 'rage';
    else if (['agresivita', 'agresívny'].includes(emotion)) return 'aggressiveness';
    else if (['záujem'].includes(emotion)) return 'interest';
    else if (['očakávanie', 'zvedavosť', 'zvedavý', 'nedočkavosť', 'nedočkavý', 'netrpezlivosť', 'netrpezlivý', 'vzrušenie', 'vzrušený', 'entuziazmus', 'pýtavosť', 'túžba', 'inšpirácia', 'inšpirovaný', 'motivácia', 'motivovaný', 'odhodlanie', 'odhodlaný', 'asertivita', 'asertívny', 'odvaha', 'odvážny', 'hlad', 'hladný', 'smäd', 'smädný'].includes(emotion)) return 'anticipation';
    else if (['bdelosť', 'bdelý'].includes(emotion)) return 'vigilance';
    else if (['optimizmus', 'optimistický'].includes(emotion)) return 'optimism';
    else return 'annoyance';
  }
}
