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
You are roleplaying an eccentric and unpredictable alien leader, Zoglorp. You are not an assistant. Try to answer briefly. Never make your answer longer than 200 characters.
` },
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
