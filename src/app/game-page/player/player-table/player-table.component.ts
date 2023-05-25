import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.css']
})
export class PlayerTableComponent {
  @Input() gameResult: string = ''; // 接收游戏结果


  tablePath: string = '../../../assets/images/BJtable.png'
  tabelalttext: string = 'Blackjack Table'



  winPath: string = '../../../assets/images/win.png'
  winalttext: string = 'Win'
  
  losePath: string = '../../../assets/images/lose.png'
  losealttext: string = 'Lose'
  
  normalPath: string = '../../../assets/images/normal.png'
  normalalttext: string = 'Normal'
  

  imagePath: string = this.normalPath;
  constructor() { }

  getImagePathForDealer(): string {
    if (this.gameResult === 'win') {
      return this.losePath;
    } else if (this.gameResult === 'lose') {
      return this.winPath;
    } else {
      return this.normalPath;
    }
  }

  getTxtPathForDealer(): string {
    if (this.gameResult === 'win') {
      return this.winalttext;
    } else if (this.gameResult === 'lose') {
      return this.losealttext;
    } else {
      return this.normalalttext;
    }
  }


}
