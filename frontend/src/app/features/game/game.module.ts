import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GameRoutingModule} from './game-routing.module';
import {GameComponent} from './components/game/game.component';
import {GameCreateOrJoinComponent} from './components/create/game-create-or-join.component';
import {ReactiveFormsModule} from "@angular/forms";
import { GameLobbyComponent } from './components/lobby/game-lobby.component';
import {StoreModule} from "@ngrx/store";
import * as fromGameState from "./store/game.reducer";
import {EffectsModule} from "@ngrx/effects";
import {GameEffects} from "./store/game.effects";
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import {ClipboardModule} from "ngx-clipboard";


@NgModule({
  declarations: [
    GameComponent,
    GameCreateOrJoinComponent,
    GameLobbyComponent
  ],
    imports: [
        CommonModule,
        GameRoutingModule,
        ReactiveFormsModule,
        StoreModule.forFeature(fromGameState.gameStateFeatureKey, fromGameState.reducers, {metaReducers: fromGameState.metaReducers}),
        EffectsModule.forFeature([GameEffects]),
        NgxTippyModule,
        ClipboardModule,
        // ClipboardModule
    ]
})
export class GameModule {
}
