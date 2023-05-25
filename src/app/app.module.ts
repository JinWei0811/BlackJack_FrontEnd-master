import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LayoutModule } from '@angular/cdk/layout';
import { GamePageComponent } from './game-page/game-page.component';
import { PlayerComponent } from './game-page/player/player.component';
import { PlayerActionComponent } from './game-page/player-action/player-action.component';
import { HandScoreComponent } from './game-page/player/hand-score/hand-score.component';
import { MoneyCounterComponent } from './game-page/player/money-counter/money-counter.component';
import { PlayingCardComponent } from './game-page/player/playing-card/playing-card.component';
import { TimestampProgressBarComponent } from './game-page/player/timestamp-progress-bar/timestamp-progress-bar.component';
import { PlayerTableComponent } from './game-page/player/player-table/player-table.component';
import { SettingComponent } from './game-page/player/setting/setting.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    GamePageComponent,
    PlayerComponent,
    PlayerActionComponent,
    HandScoreComponent,
    MoneyCounterComponent,
    PlayingCardComponent,
    TimestampProgressBarComponent,
    PlayerTableComponent,
    SettingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    ClipboardModule,
    MatCheckboxModule,
    LayoutModule,
    FormsModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
