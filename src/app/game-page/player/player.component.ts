import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WebSocketSubject } from 'rxjs/webSocket';
import { card } from 'src/model/card';
import { connectResponse, gameResponse } from 'src/model/connect';
import { playerInfo } from 'src/model/player';
import { WebsocketService } from 'src/service/websocket.service';
import { config } from '../../../config/app.config';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  type: 'dealer' | 'player' = 'player';
  scoreBottom: boolean | null;
  @Input() roomId: string;
  @Input() players: playerInfo[];
  @Input() sessionId: string;
  @Input() playerName: string;
  gameResult: string;
  botPlayer: playerInfo = {};
  readyMenuHidden: boolean = false;
  isAllStay: boolean = false;
  isBotStay: boolean = false;

  webSocket: WebSocket;

  constructor(
    private webSocketService: WebsocketService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.webSocket = this.webSocketService.getWebSocket();
    this.subscribeWebSocket();
  }

  subscribeWebSocket() {
    this.webSocket.onmessage = (event) => {
      const response = JSON.parse(event.data) as connectResponse | gameResponse;
      // join
      if (response.method === config.response.join && response instanceof  connectResponse) {
        this.players = [];
        this.toastr.info(response.content);
        for (let i = 0; i < response.playerList.length; i++) {
          if (response.playerList[i] === 'bot') {
            this.botPlayer.name = response.playerList[i];
            this.botPlayer.state = response.playerStateList[i];
            continue;
          }
          let playerInfo = {
            name: response.playerList[i],
            state: response.playerStateList[i],
          };
          this.players.push(playerInfo);
        }
      }

      if (response.method === config.response.ready && response instanceof connectResponse) {
        this.toastr.info(response.content);
      }

      if (response.method === config.response.start && response instanceof connectResponse) {
        this.toastr.info(response.content);
        this.readyMenuHidden = true;
      }

      if(response.method === config.response.)


      if (response?.method === 'continue') {
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
          let playerIndex = this.players.findIndex(
            (v) => v.name === response.name
          );
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
          let playerIndex = this.players.findIndex(
            (v) => v.name === response.name
          );
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
          let playerIndex = this.players.findIndex(
            (v) => v.name === response.name
          );
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
    };
  }

  // reconnectWebSocket() {
  //   const reconnectMessage = {
  //     name: this.playerName,
  //     method: 'reconnect',
  //     roomId: this.roomId,
  //     sessionId: this.sessionId,
  //   };
  //   this.socket$.next(reconnectMessage);
  // }

  handleGameResult(result: string) {
    const createRoomMessage = {
      name: name,
      method: 'create',
    };
  }
}
