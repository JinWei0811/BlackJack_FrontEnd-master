import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { card } from 'src/model/card';
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
  botPlayer: playerInfo = {};
  readyMenuHidden: boolean = false;
  isAllStay: boolean = false;
  isBotStay: boolean = false;

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
        console.log(message);
        let response = message as any;
        // join
        if (response.content?.includes('加入房間')) {
          this.players = [];
          for (let i = 0; i < response.playerList.length; i++) {
            if (response.playerList[i] === 'bot') {
              this.botPlayer.name = response.playerList[i];
              this.botPlayer.state = response.playerStateList[i];
              console.log(this.botPlayer);
              continue;
            }
            let playerInfo = {
              name: response.playerList[i],
              state: response.playerStateList[i]
            }
            this.players.push(playerInfo);
          }
        }

        if (response.content?.includes('準備就緒')) {
          console.log(response);
        }

        if (response.content === '遊戲開始') {
          this.readyMenuHidden = true;
        }

        if (response?.state === 'continue') {
          if (response.name === 'bot') {
            let hand = [] as card[];
            for (let i = 0; i < response.suits.length; i++) {
              let card = {
                suits: response.suits[i],
                rank: response.ranks[i],
              } as card;
              hand.push(card);
            }
            this.botPlayer.name = response.name;
            this.botPlayer.state = response.state;
            this.botPlayer.point = response.points;
            this.botPlayer.hand = hand;
          }
          if (response.name !== 'bot') {
            let playerIndex = this.players.findIndex(v => v.name === response.name);
            let player = this.players[playerIndex];
            if (player != null) {
              let hand = [] as card[];
              for (let i = 0; i < response.suits.length; i++) {
                let card = {
                  suits: response.suits[i],
                  rank: response.ranks[i],
                } as card;
                hand.push(card);
              }
              player!.name = response?.name;
              player!.state = response.state;
              player!.point = response.points;
              player!.hand = hand;
              this.players[playerIndex] = player;
            }
          }
        }

        if (response?.state === 'skip') {
          if (response.name === 'bot') {
            let hand = [] as card[];
            for (let i = 0; i < response.suits.length; i++) {
              let card = {
                suits: response.suits[i],
                rank: response.ranks[i],
              } as card;
              hand.push(card);
            }
            this.botPlayer.name = response.name;
            this.botPlayer.state = response.state;
            this.botPlayer.point = response.points;
            this.botPlayer.hand = hand;
          }
          if (response.name !== 'bot') {
            let playerIndex = this.players.findIndex(v => v.name === response.name);
            let player = this.players[playerIndex];
            if (player != null) {
              let hand = [] as card[];
              for (let i = 0; i < response.suits.length; i++) {
                let card = {
                  suits: response.suits[i],
                  rank: response.ranks[i],
                } as card;
                hand.push(card);
              }
              player!.name = response?.name;
              player!.state = response.state;
              player!.point = response.points;
              player!.hand = hand;
              this.players[playerIndex] = player;
            }
          }
        }

        if (response?.state === 'bust') {
          if (response.name === 'bot') {
            let hand = [] as card[];
            for (let i = 0; i < response.suits.length; i++) {
              let card = {
                suits: response.suits[i],
                rank: response.ranks[i],
              } as card;
              hand.push(card);
            }
            this.botPlayer.name = response.name;
            this.botPlayer.state = response.state;
            this.botPlayer.point = response.points;
            this.botPlayer.hand = hand;
          }
          if (response.name !== 'bot') {
            let playerIndex = this.players.findIndex(v => v.name === response.name);
            let player = this.players[playerIndex];
            if (player != null) {
              let hand = [] as card[];
              for (let i = 0; i < response.suits.length; i++) {
                let card = {
                  suits: response.suits[i],
                  rank: response.ranks[i],
                } as card;
                hand.push(card);
              }
              player!.name = response?.name;
              player!.state = response?.state;
              player!.point = response.points;
              player!.hand = hand;
              this.players[playerIndex] = player;
              console.log(this.players);
            }
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
