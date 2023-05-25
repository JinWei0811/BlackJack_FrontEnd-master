import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { colors, animals } from '../../assets/nameDictionary'
import { connectResponse } from 'src/model/connectResponse';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {


  isButtonDisabled: boolean = true;
  roomId = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(4),
  ]);
  roomInputId: string = '';

  socket$: WebSocketSubject<any> = new WebSocketSubject('ws://localhost:8080/connect');
  sessionId: string = '';
  playerName: string = '';


  constructor(private router: Router) {

  }
  ngOnDestroy(): void {
    this.socket$.unsubscribe();
  }

  ngOnInit(): void {
    this.subscribeWebSocket();
  }

  subscribeWebSocket() {
    this.socket$.subscribe(
      message => {
        let tempMessage = message as connectResponse;
        const response = {
          name: this.playerName,
          roomId: tempMessage.roomId,
          sessionId: tempMessage.sessionId,
          playerList: tempMessage.playerList,
          playerStateList: tempMessage.playerStateList,
          content: tempMessage.content
        }

        if (response.content === '創建新房間成功') {
          this.router.navigate(['/GameRoom'], { queryParams: response }); //  game-page 路由
          this.socket$.unsubscribe();
        }

        if (response.content?.includes('成功加入房間') && response.content?.includes(this.playerName)) {
          this.router.navigate(['/GameRoom'], { queryParams: response }); //  game-page 路由
          this.socket$.unsubscribe();
        }
      },
      error => { console.error('WebSocket错误:', error); },
      () => { }
    );
  }

  initPlayerName() {
    let firstName = colors[Math.floor(Math.random() * colors.length)];
    let lastName = animals[Math.floor(Math.random() * colors.length)];
    return `${firstName}-${lastName}`
  }

  enableButton() {
    this.isButtonDisabled = false;
  }
  disableButton() {
    this.isButtonDisabled = true;
  }
  navigateToGamePage() {
    this.playerName = this.initPlayerName();
    const createRoomMessage = {
      name: this.playerName,
      method: 'create'
    };
    this.socket$.next(createRoomMessage);
  }

  joinRoom() {
    console.log('join')
    this.playerName = this.initPlayerName();
    const joinRoomMessage = {
      name: this.playerName,
      method: 'join',
      roomId: this.roomInputId
    }
    this.socket$.next(joinRoomMessage);
  }
}
