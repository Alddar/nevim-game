import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import {GameCreateOrJoinComponent} from "./components/create/game-create-or-join.component";
import {GameLobbyComponent} from "./components/lobby/game-lobby.component";

const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'create-or-join', component: GameCreateOrJoinComponent },
  { path: 'lobby/:id', component: GameLobbyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
