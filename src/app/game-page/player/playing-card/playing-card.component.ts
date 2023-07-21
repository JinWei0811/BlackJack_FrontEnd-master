import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  DoCheck,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { WebSocketSubject } from 'rxjs/webSocket';
import { playerInfo } from 'src/model/player';
import * as _ from 'lodash';
import { WebsocketService } from 'src/service/websocket.service';

@Component({
  selector: 'app-playing-card',
  templateUrl: './playing-card.component.html',
  styleUrls: ['./playing-card.component.css'],
  animations: [
    trigger('dealAnimation', [
      state('void', style({ transform: 'translateY(-100%)' })),
      transition(':enter', animate('500ms ease-out')),
    ]),
  ],
})
export class PlayingCardComponent implements OnInit, OnChanges, DoCheck {
  @Output() gameResultEvent = new EventEmitter<string>();
  @Input() roomId: string = '';
  @Input() sessionId: string = '';
  @Input() playerName: string = '';
  @Input() players: playerInfo[] = [];
  @Input() readyMenuHidden: boolean = false;
  @Input() botPlayer: playerInfo = {};
  @Input() isAllStay: boolean = false;
  startCheck: boolean = false;
  isPlayerBust: boolean = false;

  stagingPlayers: playerInfo[] = [];
  imagePath = '../../../assets/images/Cards/';

  dealerCards: string[] = []; // 莊家手牌
  playerCards: string[] = []; // 玩家1手牌
  player2Cards: string[] = []; // 玩家2手牌

  currentBet: number = 100;
  betChange: number = 0;

  gameResult: string = ''; // 遊戲結果
  player2gameResult: string = ''; // 玩家2遊戲結果
  // 撲克牌圖片的名稱，假設撲克牌的圖片名稱格式為 "card-<suit>-<value>"

  cardSuits: string[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  cardValues: string[] = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];

  startDealerValueHidden: boolean = false;
  startPlayer2ValueHidden: boolean = false;
  // 莊家第二張牌為覆蓋狀態
  dealerSecondCardVisible: boolean = false;
  dealAnimationInProgress: boolean = false;

  webSocket: WebSocket;

  constructor(private webSocketService: WebsocketService) {}

  ngOnChanges(): void {
    if (this.readyMenuHidden && !this.startCheck) {
      this.dealCards();
    }
  }

  ngDoCheck(): void {
    if (this.players[0].state === 'skip' || this.players[0].state === 'bust') {
      this.isPlayerBust = true;
    }

    if (this.startCheck && !this.isAllStay) {
      this.checkPlayerCards();
      this.checkPlayer2Cards();
    }
    if (this.isAllStay) {
      this.checkDealerCards();
    }
  }

  ngOnInit(): void {
    this.webSocket = this.webSocketService.getWebSocket();
  }

  startDealerClicked(): void {
    this.startDealerValueHidden = !this.startDealerValueHidden;
  }

  readyClicked(): void {
    let readyMessage = {
      name: this.playerName,
      method: 'ready',
      roomId: this.roomId,
      sessionId: this.sessionId,
    };
    this.webSocket.send(JSON.stringify(readyMessage));
  }

  unReadyClicked(): void {
    this.readyMenuHidden = !this.readyMenuHidden;
    this.reset();
  }

  dealCards() {
    // 隨機發牌給玩家和莊家
    // 重置手牌数组
    this.playerCards = [];
    this.dealerCards = [];
    this.player2Cards = [];

    // 開始發牌動畫
    this.dealAnimationInProgress = true;

    // 延遲莊家、玩家手牌出現的時間
    setTimeout(() => {
      // this.playerCards.push(this.getRandomCard());
      let hand = this.players[0].hand;
      this.playerCards.push(`card-${hand![0].suits}-${hand![0].rank}`);
    }, 500);

    setTimeout(() => {
      // this.dealerCards.push(this.getRandomCard());
      let hand = this.botPlayer.hand;
      this.dealerCards.push(`card-${hand![0].suits}-${hand![0].rank}`);
    }, 1000);

    setTimeout(() => {
      // this.player2Cards.push(this.getRandomCard());
      if (!_.isNil(this.players[1])) {
        let hand = this.players[1].hand;
        this.player2Cards.push(`card-${hand![0].suits}-${hand![0].rank}`);
      }
    }, 1500);

    setTimeout(() => {
      // this.playerCards.push(this.getRandomCard());
      let hand = this.players[0].hand;
      this.playerCards.push(`card-${hand![1].suits}-${hand![1].rank}`);
    }, 2000);

    setTimeout(() => {
      // this.player2Cards.push(this.getRandomCard());
      if (!_.isNil(this.players[1])) {
        let hand = this.players[1].hand;
        this.player2Cards.push(`card-${hand![1].suits}-${hand![1].rank}`);
      }
    }, 2500);

    setTimeout(() => {
      // this.dealerCards.push(this.getRandomCard());
      let hand = this.botPlayer.hand;
      this.dealerCards.push(`card-${hand![1].suits}-${hand![1].rank}`);
      this.dealAnimationInProgress = false; // 停止發牌
      this.dealerSecondCardVisible = false;
      this.startPlayer2ValueHidden = true;
      this.startCheck = true;
      console.log('isover');
    }, 3000);
  }

  triggerDealAnimation() {
    // 通過改變玩家和莊家手牌的長度來觸發發牌動畫
    // 將手牌組數設為 0，然後逐步增加
    this.playerCards.length = 0;
    this.dealerCards.length = 0;

    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        this.playerCards.push(this.getRandomCard());
        this.dealerCards.push(this.getRandomCard());
      }, i * 500); // 延遲出牌時間
    }
  }

  checkDealerCards() {
    let newHand = this.botPlayer.hand;
    let newCards = [] as string[];
    if (newHand != null) {
      for (let hand of newHand) {
        newCards.push(`card-${hand.suits}-${hand.rank}`);
      }
    }

    if (this.dealerCards.length < newCards?.length) {
      var temp = _.difference(newCards, this.dealerCards);
      if (temp.length > 0) {
        this.dealerCards.push(temp[0]);
      }
    }

    if (this.botPlayer.state === 'skip' || this.botPlayer.state === 'bust') {
      this.checkGameResult();
    }
  }

  checkPlayerCards() {
    // if (this.players[0]?.state === 'skip' || this.players[0]?.state === 'bust') {
    //   return;
    // }
    console.log(this.players[0].state);
    for (let player of this.players) {
      // if (player.name === response.name) {
      //   if (this.players.length == 1) {
      //     this.isAllStay = true;
      //   }
      //   break;
      // }
      if (player.state !== 'skip') {
        if (player.state !== 'bust') {
          this.isAllStay = false;
          break;
        }
      }
      this.isAllStay = true;
    }

    let newHand = this.players.find(
      (v) => v?.name === this.players[0]?.name
    )?.hand;
    let newCards = [] as string[];
    if (newHand != null) {
      for (let hand of newHand) {
        newCards.push(`card-${hand.suits}-${hand.rank}`);
      }
    }
    if (this.playerCards.length < newCards?.length) {
      var temp = _.difference(newCards, this.playerCards);
      if (temp.length > 0) {
        this.playerCards.push(temp[0]);
      }
    }

    if (this.isAllStay) {
      this.dealerSecondCardVisible = true;
    }
  }

  checkPlayer2Cards() {
    // if (this.players[1]?.state === 'skip' || this.players[1]?.state === 'bust') {
    //   return;
    // }
    let newHand = this.players.find(
      (v) => v?.name === this.players[1]?.name
    )?.hand;
    let newCards = [] as string[];
    if (newHand != null) {
      for (let hand of newHand) {
        newCards.push(`card-${hand.suits}-${hand.rank}`);
      }
    }

    if (this.player2Cards.length != newCards?.length) {
      var temp = _.difference(newCards, this.player2Cards);
      if (temp.length > 0) {
        this.player2Cards.push(temp[0]);
      }
    }
  }

  hit() {
    // 玩家要牌
    const playerHitMessage = {
      name: this.playerName,
      method: 'hit',
      roomId: this.roomId,
      sessionId: this.sessionId,
    };
    this.webSocket.send(JSON.stringify(playerHitMessage));
    // this.dealerSecondCardVisible = true;
    // this.playerCards.push(this.getRandomCard());
    // this.checkGameResult();
  }

  stand() {
    // 玩家停牌，莊家出牌
    // this.dealerSecondCardVisible = true;
    // while (this.getDealerPoints() < 17) {
    //   this.dealerCards.push(this.getRandomCard());
    // }
    // this.checkGameResult();
    const playerSkipMessage = {
      name: this.playerName,
      method: 'skip',
      roomId: this.roomId,
      sessionId: this.sessionId,
    };
    this.webSocket.send(JSON.stringify(playerSkipMessage));
  }

  // 玩家2號
  hitPlayer2() {
    this.player2Cards.push(this.getRandomCard());
    this.checkGameResult();
    // 进行其他相关逻辑
  }

  standPlayer2() {
    // 玩家2停牌，不進行任何操作
    this.checkGameResult();
  }

  getPlayer2Points() {
    return this.calculatePoints(this.player2Cards);
  }

  reset() {
    // 重置遊戲狀態
    this.dealerCards = [];
    this.playerCards = [];
    this.player2Cards = [];
    this.gameResult = '';
    this.player2gameResult = '';
    this.startDealerValueHidden = false;
    this.startPlayer2ValueHidden = false;
  }

  getPlayerPoints(): number {
    // 計算玩家手牌的點數總和
    return this.calculatePoints(this.playerCards);
  }

  getDealerPoints(): number {
    // 計算莊家手牌的點數總和
    return this.calculatePoints(this.dealerCards);
  }
  // 獲得隨機卡牌
  private getRandomCard(): string {
    // 隨機獲取一張撲克牌
    const suit =
      this.cardSuits[Math.floor(Math.random() * this.cardSuits.length)];
    const value =
      this.cardValues[Math.floor(Math.random() * this.cardValues.length)];
    return `card-${suit}-${value}`;
  }

  private getRandomCards(count: number): string[] {
    // 隨機獲取指定數量的撲克牌
    const cards: string[] = [];
    for (let i = 0; i < count; i++) {
      cards.push(this.getRandomCard());
    }
    return cards;
  }
  // 計算分數
  private calculatePoints(cards: string[]): number {
    // 計算手牌的點數總和
    let points = 0;
    let hasAce = false;
    for (const card of cards) {
      const value = card.split('-')[2];
      if (value === 'A') {
        points += 11; // Ace的點數為11
        hasAce = true;
      } else if (value === 'K' || value === 'Q' || value === 'J') {
        points += 10; // 十、麥和皇后的點數為10
      } else {
        points += parseInt(value, 10);
      }
    }
    if (points > 21 && hasAce) {
      points -= 10; // 如果點數總和超過21且有Ace，將Ace的點數視為1
    }
    return points;
  }
  // 確認遊戲結果
  private checkGameResult() {
    this.startDealerValueHidden = true;
    const playerPoints = this.getPlayerPoints();
    const dealerPoints = this.getDealerPoints();
    const player2Points = this.getPlayer2Points();

    if (playerPoints > 21) {
      this.gameResult = '玩家爆牌，莊家勝利！';
      this.gameResultEvent.emit('lose');
    } else if (dealerPoints > 21) {
      this.gameResult = '莊家爆牌，玩家勝利！';
      this.gameResultEvent.emit('win');
    } else if (playerPoints === 21 && this.playerCards.length === 2) {
      this.gameResult = '玩家獲得21點，玩家勝利！';
      this.gameResultEvent.emit('win');
    } else if (dealerPoints === 21 && this.dealerCards.length === 2) {
      this.gameResult = '莊家獲得21點，莊家勝利！';
      this.gameResultEvent.emit('lose');
    } else if (playerPoints > dealerPoints) {
      this.gameResult = '玩家點數大於莊家，玩家勝利！';
      this.gameResultEvent.emit('win');
    } else if (playerPoints < dealerPoints) {
      this.gameResult = '玩家點數小於莊家，莊家勝利！';
      this.gameResultEvent.emit('lose');
    } else {
      this.gameResult = '點數相同，平局！';
      this.gameResultEvent.emit('draw');
    }

    if (player2Points > 21) {
      // 玩家2爆牌
      this.player2gameResult = '🙈';
    } else if (player2Points === 21 && this.player2Cards.length === 2) {
      // 玩家2獲得21點
      this.player2gameResult = '😍';
    } else if (player2Points > dealerPoints) {
      // 玩家2點數大於莊家
      this.player2gameResult = '😎';
    } else if (player2Points < dealerPoints) {
      // 玩家2點數小於莊家
      this.player2gameResult = '😭';
    } else {
      // 玩家2和莊家點數相同
      this.player2gameResult = '😐';
    }
  }

  // 賭注按鈕
  changeBet(amount: number): void {
    console.log(this.players);
    // const inputElement = (document.querySelector('input') as HTMLInputElement);
    // if (inputElement) {
    //   const newBet = parseInt(inputElement.value, 10) + amount;
    //   if (newBet >= 0) {
    //     const betDifference = newBet - parseInt(inputElement.value, 10);
    //     this.currentBet = newBet;
    //     this.betChange = betDifference;
    //   }
    // }
  }

  setBet(): void {
    const inputElement = document.querySelector('input') as HTMLInputElement;
    if (inputElement) {
      const newBet = parseInt(inputElement.value, 10);
      this.currentBet = newBet;
    }
  }
}
