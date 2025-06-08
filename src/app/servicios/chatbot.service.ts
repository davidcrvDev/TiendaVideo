import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: 'any'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private url = 'https://fab1th13.app.n8n.cloud/webhook/b277eab8-c30d-4cd0-bdc5-7ed88f9a1b87';

  constructor() { }

  async getData(text: string): Promise<any> {

    const body = {
      param1: text,
      sessionId: 'asdasdasd',
      action: 'sendMessage'
    };

    const username = 'TiendaVideo';
    const password = 'TiendaVideo';
    const basicAuth = btoa(`${username}:${password}`);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      })
    };

    const response: any = await lastValueFrom(this.http.post<any>(this.url, body, options));

    return response;
  }
}
