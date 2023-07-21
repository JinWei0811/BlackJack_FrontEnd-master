import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketSubject } from 'rxjs/webSocket';
import { connectResponse } from 'src/model/connect';
import { playerInfo } from 'src/model/player';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css'],
})
export class GamePageComponent implements OnInit {
  sessionId: string;
  roomId: string;
  players = [] as playerInfo[];
  playerName: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((value: any) => {
      let response = JSON.parse(value?.message) as connectResponse;
      this.playerName = value.playerName as string;
      this.roomId = response.roomId;

      var ownIndex = response.playerList.findIndex(
        (v) => v === this.playerName
      );
      let ownInfo = {
        name: response.playerList[ownIndex],
        state: response.playerStateList[ownIndex],
      };
      this.players.push(ownInfo);
      for (let i = 0; i < response.playerList.length; i++) {
        if (response.playerList[i] === 'bot' || i === ownIndex) {
          continue;
        }
        let playerInfo = {
          name: response.playerList[i],
          state: response.playerStateList[i],
        };
        this.players.push(playerInfo);
      }
    });
  }
}
