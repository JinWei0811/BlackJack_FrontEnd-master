import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private websocket: WebSocket;

  constructor() {}

  connect(url: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.websocket = new WebSocket(url);

      this.websocket.onopen = (event) => {
        observer.next(true);
        observer.complete();
      };

      this.websocket.onerror = (error) => {
        observer.error(false);
      };
    });
  }

  getWebSocket(): WebSocket {
    return this.websocket;
  }
}
