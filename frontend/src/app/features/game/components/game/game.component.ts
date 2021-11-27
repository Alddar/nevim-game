import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NakamaService, State} from "../../../core/services/nakama.service";
import {
  BehaviorSubject,
  combineLatest,
  debounce,
  EMPTY,
  fromEvent, interval,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom
} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Store} from "@ngrx/store";
import {selectGameState} from "../../store/game.selectors";
import {GameStateState} from 'shared';
import {gameStateToUI} from "../../utils/gameStateToUI";
import {Size} from "../../models/common"
import {CardStyle, CardUI, GameStateUI, GameStateUIWithStyles} from '../../models/gameStateUI';
import {CARD_HEIGHT, CARD_WIDTH} from "../../const/coordinates";


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('board')
  board!: ElementRef

  matchId: string = ''

  private boardSizeSubject = new BehaviorSubject<Size>({width: 0, height: 0});
  boardSize$ = this.boardSizeSubject.asObservable()

  gameStateUI$ = combineLatest([
    this.store.select(selectGameState).pipe(
      map(gameStateToUI)
    ),
    this.boardSize$
  ]).pipe(
    map(([gameState, boardSize]): GameStateUIWithStyles | null => {
        if (!gameState)
          return null
        console.log(gameState, boardSize)
        const cards = gameState.cards.map((card): CardUI & { style: CardStyle } => ({
          ...card,
          style: {
            width: `${boardSize.width * CARD_WIDTH}px`,
            height: `${boardSize.height * CARD_HEIGHT}px`,
            transform: `translate(
              ${(card.x - CARD_WIDTH / 2) * (boardSize.width)}px,
              ${(card.y - CARD_HEIGHT / 2) * (boardSize.height)}px
          )`,
            'z-index': card.index
          }
        }))
        return {...gameState, cards}
      }
    )
  )

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

  ngAfterViewInit() {
    const handleResize = (): any => {
      const width = this.board?.nativeElement.offsetWidth,
        height = this.board?.nativeElement.offsetHeight
      this.boardSizeSubject.next({width, height})
    }
    fromEvent(window, 'resize').pipe(
      debounce((i) => interval(500))
    ).subscribe(() => {
        handleResize()
      }
    )
    handleResize()
  }
}
