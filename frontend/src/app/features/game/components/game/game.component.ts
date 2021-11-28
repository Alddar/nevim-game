import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NakamaService, State} from "../../../core/services/nakama.service";
import {
  combineLatest,
  debounce,
  EMPTY, filter,
  fromEvent, interval,
  map, startWith,
  switchMap,
  take,
  tap,
} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Store} from "@ngrx/store";
import {selectGameState} from "../../store/game.selectors";
import {GameStateState} from 'shared';
import {GameStateUI} from '../../models/gameStateUI';
import {BOARD_HEIGHT, BOARD_WIDTH, CARD_HEIGHT, CARD_WIDTH, PLAYER_NAME_POSITIONS} from "../../const/coordinates";
import {cardsAnimation} from "../../animations/cards";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass'],
  animations: [
    cardsAnimation()
  ]
})
export class GameComponent implements OnInit {
  boardSize$ =
    fromEvent(window, 'resize').pipe(
      debounce((i) => interval(100)),
      map(() => ({width: window.innerWidth, height: window.innerHeight})),
      startWith({width: window.innerWidth, height: window.innerHeight}),
      map(size => {
        if(size.width / size.height > BOARD_WIDTH / BOARD_HEIGHT) {
          const newWidth = size.height / BOARD_HEIGHT * BOARD_WIDTH
            return {
            width: newWidth,
            height: size.height
          }
        }
        const newHeight = size.width / BOARD_WIDTH * BOARD_HEIGHT
        return {
          width: size.width,
          height: newHeight
        }
      })
    )

  matchId: string = ''
  cardIds = [...Array(54).keys()]

  gameStateUI$ = combineLatest([
    this.store.select(selectGameState),
    this.boardSize$
  ]).pipe(
    map(([gameState, boardSize]): GameStateUI | null => {
      if(!gameState)
        return null

      const players = gameState.players.map((player, playerIndex) => ({
                ...player,
                style: {
                  transform: `translate(${(PLAYER_NAME_POSITIONS[playerIndex].x) * (boardSize.width)}px, ${(PLAYER_NAME_POSITIONS[playerIndex].y) * (boardSize.height)}px)`
                }
              }))

      const cards = []
      cards.push(...gameState.draw.map((card) => ({...card, state: 'draw'})))
      cards.push(...gameState.throw.map((card) => ({...card, state: 'throw'})))
      players.forEach((player, playerIndex) => {
        player.cards.forEach((card, cardIndex) => {
          if(card !== null) {
            cards.push({...card, state: `player${playerIndex}-card${cardIndex}`})
          }
        })
      })

      return {...gameState, players, cards}
    }),
    filter(gameState => gameState !== null),
  )

  gameStateCards$ = this.gameStateUI$.pipe(
    map(gameState => gameState?.cards),
  )

  cardById$(id: number) {
    return this.gameStateCards$.pipe(
      filter(cards => cards !== null),
      map((cards) => cards?.find((card) => card.id === id))
    )
  }

  get CARD_WIDTH() {
    return CARD_WIDTH
  }

  get CARD_HEIGHT() {
    return CARD_HEIGHT
  }

  constructor(private route: ActivatedRoute,
              private nakamaService: NakamaService,
              private router: Router,
              private toastr: ToastrService,
              private store: Store) {
  }

  ngOnInit(): void {
    this.nakamaService.waitForState(State.AUTHENTICATED, () => {
      this.route.params.pipe(
        map((params): string => params['id']),
        tap((matchId) => this.matchId = matchId),
        switchMap((matchId) => {
          return this.store.select(selectGameState).pipe(
            take(1),
            switchMap((gameState) => {
              if (gameState?.state !== GameStateState.IN_PROGRESS) {
                return this.nakamaService.joinMatch(matchId)
              }
              return EMPTY
            }))

        })
      ).subscribe({
        error: (err) => {
          this.toastr.error(JSON.stringify(err))
          this.router.navigate(['game', 'create-or-join'])
        }
      })
    })
  }

  testAction() {
    this.nakamaService.testAction()
  }
}
