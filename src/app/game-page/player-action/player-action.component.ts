import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-player-action',
  templateUrl: './player-action.component.html',
  styleUrls: ['./player-action.component.css']
})
export class PlayerActionComponent {
  @Input() playerCards: string[] = [];
  @Input() dealerCards: string[] = [];
  @Input() roomId: string = '';
  @Input() gameResult: string | null = null;
  @Output() dealCardsEvent = new EventEmitter<void>();
  @Output() hitEvent = new EventEmitter<void>();
  @Output() standEvent = new EventEmitter<void>();
  @Output() resetEvent = new EventEmitter<void>();


  constructor() {

  }
  readyMenuHidden: boolean = false;
  readyClicked(): void {
    this.readyMenuHidden = !this.readyMenuHidden;
  }




  /** If true stayHitMenu is shown instead of ready menu */




}
