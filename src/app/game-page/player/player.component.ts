import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { connectResponse } from 'src/model/connectResponse';
import { playerInfo } from 'src/model/player';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
  type: 'dealer' | 'player' = 'player';
  scoreBottom: boolean | null = false;
  @Input() roomId: string = '';
  @Input() players: playerInfo[] = [];
  @Input() sessionId: string = '';
  @Input() playerName: string = '';
  gameResult: string = '' // 存储游戏结果的变量

  socket$: WebSocketSubject<any> = new WebSocketSubject('ws://localhost:8080/connect');


  constructor() { }

  ngOnDestroy(): void {
    this.socket$.unsubscribe();
  }

  ngOnInit(): void {
    this.subscribeWebSocket();
  }

  tempClick() {
    this.socket$.next({ "name": "simon", "method": "join", "roomId": "9YtPSz" }
    )
  }

  subscribeWebSocket() {
    this.socket$.subscribe(
      message => {
        let response = message as connectResponse;
        console.log(message);
        // join
        if (response.content?.includes('加入房間')) {
          this.players = [];
          for (let i = 0; i < response['playerList'].length; i++) {
            if (response['playerList'][i] === 'bot') {
              continue;
            }
            let playerInfo = {
              name: response['playerList'][i],
              state: response['playerStateList'][i]
            }
            this.players.push(playerInfo);
          }
        }
      },
      error => { console.error('WebSocket错误:', error); },
      () => { }
    );
    this.reconnectWebSocket();
  }

  reconnectWebSocket() {
    const reconnectMessage = {
      name: this.playerName,
      method: 'reconnect',
      roomId: this.roomId,
      sessionId: this.sessionId,
    };
    this.socket$.next(reconnectMessage);
  }

  handleGameResult(result: string) {
    const createRoomMessage = {
      name: name,
      method: 'create'
    };
  }


  // players = [
  //   { name: '沉睡山羊', index: 1 },
  //   { name: '火山孝子', index: 2 },
  //   { name: 'player3', index: 3 },
  // ];

}
