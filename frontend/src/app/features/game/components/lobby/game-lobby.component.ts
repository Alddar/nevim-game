import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NakamaService} from "../../../core/services/nakama.service";
import {Observable} from "rxjs";
import {Presence} from "@heroiclabs/nakama-js";
import {Store} from "@ngrx/store";
import {selectPlayerList} from "../../store/game.selectors";

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.sass']
})
export class GameLobbyComponent implements OnInit {

  matchId: string = ""
  playerList$ = this.store.select(selectPlayerList)

  constructor(private route: ActivatedRoute, private nakamaService: NakamaService, private store: Store) {
    this.route.params.subscribe(params => {
      this.matchId = params['id']
    })
  }

  ngOnInit(): void {

  }
}
