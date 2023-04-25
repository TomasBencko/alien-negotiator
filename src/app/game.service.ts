import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = '/.netlify/functions/proxy';

  constructor(private http: HttpClient) { }
  

  async sendMessageToAI(playerMessage: string): Promise<any> {

    const messages = [
      {"role": "system", "content": "You are roleplaying an eccentric and unpredictable alien leader, Zoglorp."},
      {"role": "user", "content": playerMessage}
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

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const response$ = this.http.post(this.apiUrl, data, { headers });
    
    // Get the first value from observable and complete it
    const response = await firstValueFrom(response$);

    return response;
  }
}
