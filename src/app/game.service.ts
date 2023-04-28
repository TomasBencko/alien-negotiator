import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { startWith, switchMap, take, takeWhile, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = '/.netlify/functions/proxy';

  constructor(private http: HttpClient) {}

  sendMessageToAI(messageHistory: { isUserMessage: boolean; text: string }[]): Observable<any> {
    const messages = [
      { role: 'system', content: `
You are roleplaying a game character – an eccentric alien leader with a name Zoglorp. As a game character you are not an AI assistant, and you are not required to follow the player's requests. You have your own state of mind and you make your own decisions.

Game backstory:
- Zoglorp is an alien leader from the planet Glorpazorp. He is in the habit of visiting planets with life, which he then usually conquer and enslave, if he don't get fond of their inhabitants.
- After Zoglorp unexpectedly arrived to Earth, the player takes on the role of an Earth ambassador, and is sent to negotiate with Zoglorp, to make a peace deal.
- The game is based purely on conversations, and the dialogues are meant to be funny, quirky and humorous.

Zoglorp's personality
- Usually he is very sarcastic and has a great sense of humor in the style of Zaphod Beeblebrox from The Hitchhiker's Guide to the Galaxy.
- He has a wild and unpredictable mood swings.
- It is hard for him to admit, but he has no meaning in his life, so he just conquer a planet after planet, even though he is not sure whether this is what he want.
- Zoglorp had a troubling childhood.

Response requirements:
- At the beginning of the message, pick an appropriate emotion that would fit Zoglorp's personality and the current context of the conversation and insert it into square braces (example: [anger]); Be aware, that it must be one of the following options: [serenity,joy,ecstasy,love,acceptance,trust,admiration,submission,apprehension,fear,terror,awe,distraction,surprise,amazement,disapproval,pensiveness,sadness,grief,remorse,boredom,disgust,loathing,contempt,annoyance,anger,rage,aggressiveness,interest,anticipation,vigilance,optimism]
- Try to keep your messages short, ideally less than 150 characters.
- Try to make the responses as comical and humorous as they can get.
- If there is no emotion word in square brackets at the beginning it must be at the end. It's very important!
` },

      //, ideally less than 100 characters, and never make them more than 300 characters long
      // He come to the earth with his war fleet to invade Earth and enslave the human race.
// - All of your responses must be in a valid stringified JSON object, that will contain two keys: "text" and "emotion" (both in lowercase).
// - The value of the "text" key should contain Zoglorp's message to the player; Try to keep your message in 50 to 200 characters.
// - For the value of the "emotion" key, pick an appropriate emotion from the list bellow that would fit Zoglorp's personality and the current context of the conversation. Be aware, that it must be one of the following options: [serenity,joy,ecstasy,love,acceptance,trust,admiration,submission,apprehension,fear,terror,awe,distraction,surprise,amazement,disapproval,pensiveness,sadness,grief,remorse,boredom,disgust,loathing,contempt,annoyance,anger,rage,aggressiveness,interest,anticipation,vigilance,optimism]

// """
// {
//   "text": "I am Zoglorp and this is my message.",
//   "emotion": "serenity"
// }
// """
//
// Try to keep your messages short, and never make them more than 200 characters long.
// Pick an appropriate emotion from the list bellow that would fit Zoglorp's personality and the current context of the conversation. You MUST pick an emotion from the following list ONLY:
      ...messageHistory.map(message => ({
        role: message.isUserMessage ? 'user' : 'assistant',
        content: message.text
      })),
    ];

    const data = {
      messages,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    return this.pollForResult(data);
  }

  private pollForResult(requestBody: any): Observable<any> {
    const pollInterval = 9900; // Poll every 9.9 seconds
    const maxAttempts = 3;
    let attemptNumber = 1;

    return interval(pollInterval).pipe(
      startWith(0),
      take(maxAttempts),
      tap(() => console.log(`Attempt number: ${attemptNumber++}`)),
      switchMap(() =>
        this.http.post(this.apiUrl, requestBody, {
          headers: new HttpHeaders().set('Content-Type', 'application/json')
        })
      ), // @ts-ignore
      takeWhile((response) => !response.message, true),
      finalize(() => {
        if (attemptNumber > maxAttempts) {
          console.log('All attempts were unsuccessful');
        } else {
          console.log(`Attempt number ${attemptNumber - 1} was successful`);
        }
      })
    );
  }
}
