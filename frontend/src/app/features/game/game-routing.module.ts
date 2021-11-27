import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import {GameCreateOrJoinComponent} from "./components/create/game-create-or-join.component";
import {GameLobbyComponent} from "./components/lobby/game-lobby.component";
import {PageNotFoundComponent} from "../core/components/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: 'create-or-join', component: GameCreateOrJoinComponent },
  { path: 'lobby/:id', component: GameLobbyComponent },
  { path: ':id', component: GameComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
