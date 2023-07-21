import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketSubject } from 'rxjs/webSocket';
import { colors, animals } from '../../assets/nameDictionary';
import { connectResponse } from 'src/model/connect';
import { ToastrService } from 'ngx-toastr';
import { config } from '../../config/app.config';
import * as _ from 'lodash';
import { WebsocketService } from 'src/service/websocket.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  isButtonDisabled: boolean = true;
  connectSuccess: boolean = false;

  roomInputId: string;
  playerName: string;

  webSocket: WebSocket;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.websocketService.connect(config.url).subscribe(
      (isConnected: boolean) => {
        this.connectSuccess = isConnected;
        this.webSocket = this.websocketService.getWebSocket();
      },
      (err) => {
        this.toastr.error('連線伺服器錯誤，請確認伺服器狀態');
      },
      () => {}
    );
    this.subscribeWebSocket();
  }

  subscribeWebSocket() {
    this.websocketService.getWebSocket().onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event?.data) as connectResponse;
      if (!message) {
        return;
      }

      if (message.method === config.response.create) {
        this.toastr.info(message.content);
        this.router.navigate(['/GameRoom'], {
          queryParams: {
            message: JSON.stringify(message),
            playerName: this.playerName,
          },
        }); //  game-page 路由
      }

      if (message.method === config.response.join) {
        if (message.playerList.includes(this.playerName)) {
          this.toastr.info(message.content);
          this.router.navigate(['/GameRoom'], {
            queryParams: { message: message, playerName: this.playerName },
          }); //  game-page 路由
        } else {
          this.toastr.warning(message.content);
        }
      }
    };
  }

  initPlayerName() {
    let firstName = colors[Math.floor(Math.random() * colors.length)];
    let lastName = animals[Math.floor(Math.random() * colors.length)];
    return `${firstName}-${lastName}`;
  }

  enableButton() {
    this.isButtonDisabled = false;
  }
  disableButton() {
    this.isButtonDisabled = true;
  }
  navigateToGamePage() {
    if (!this.connectSuccess) {
      this.toastr.error('伺服器連線錯誤，請刷新網頁再試');
      return;
    }

    this.playerName = this.initPlayerName();
    const createRoomMessage = {
      name: this.playerName,
      method: config.method.create,
    };
    this.webSocket.send(JSON.stringify(createRoomMessage));
  }

  joinRoom() {
    if (!this.connectSuccess) {
      this.toastr.error('伺服器連線錯誤，請刷新網頁再試');
      return;
    }
    if (_.isNil(this.roomInputId)) {
      this.toastr.warning('請填入 Room ID');
      return;
    }
    this.playerName = this.initPlayerName();
    const joinRoomMessage = {
      name: this.playerName,
      method: config.method.join,
      roomId: this.roomInputId,
    };
    this.webSocket.send(JSON.stringify(joinRoomMessage));
  }
}
