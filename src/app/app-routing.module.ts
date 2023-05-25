import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from './game-page/game-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
const routes: Routes = [
  {
    path: '', component: LandingPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'GameRoom', component: GamePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
