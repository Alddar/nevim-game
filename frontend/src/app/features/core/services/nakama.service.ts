import {Injectable} from '@angular/core';
import {Client, Match, MatchData, MatchPresenceEvent, Session, Socket} from "@heroiclabs/nakama-js";
import {CookieService} from "ngx-cookie-service";
import {BehaviorSubject, EMPTY, filter, from, map, mergeMap, Observable, of, take, tap} from "rxjs";
import {ApiAccount} from "@heroiclabs/nakama-js/dist/api.gen";
import {rpcCreateMatchId, RpcCreateMatchResponse} from 'shared';

export enum State {
  INIT,
  AUTHENTICATED
}

@Injectable({
  providedIn: 'root'
})
export class NakamaService {
  private client: Client
  private session: Session | null = null
  private socket: Socket | null = null
  private sessionPromise: Promise<any> | null = null

  private matchDataSubject = new BehaviorSubject<MatchData | null>(null)

  private stateSubject = new BehaviorSubject<State>(State.INIT)
  public get matchData$() {
    return this.matchDataSubject.asObservable()
  }

  private userIdSubject = new BehaviorSubject<string>("")
  public get userId$() {
    return this.userIdSubject.asObservable()
  }

  constructor(private cookieService: CookieService) {
    this.client = new Client("defaultkey", "localhost", "7350")
  }

  private registerSocketCallbacks() {
    if (!this.socket)
      return
    this.socket.onmatchdata = (matchData) => {
      this.matchDataSubject.next(matchData)
    }
  }

  public waitForState(state: State, fn: Function) {
    this.stateSubject.asObservable().pipe(
      filter(s => s === state),
      take(1)
    ).subscribe(() => fn())
  }

  authenticate(deviceId: string, username: string): Observable<boolean> {
    this.stateSubject.next(State.INIT)
    this.socket = this.client.createSocket(false, true)

    return from(this.client.authenticateDevice(deviceId, true, deviceId)).pipe(
      mergeMap((session) => {
        if(session.user_id)
          this.userIdSubject.next(session.user_id)

        this.client.updateAccount(session, {display_name: username})
        this.session = session
        return from(this.socket?.connect(session, false) || EMPTY).pipe(
          tap(session => {
            this.session = session
            this.registerSocketCallbacks();
            this.stateSubject.next(State.AUTHENTICATED)
          }),
          map(() => true)
        )
      }))
  }

  getAccount(): Observable<ApiAccount> | null {
    return from(this.client.getAccount(this.session!!))
  }

  createMatch(): Observable<RpcCreateMatchResponse> {
    return from(this.client.rpc(this.session!!, rpcCreateMatchId, {})).pipe(map(
      (rpcResponse) => rpcResponse.payload as RpcCreateMatchResponse)
    )
  }

  listMatches() {
    const rpcId = 'list-matches'
    return from(Promise.allSettled([this.sessionPromise]).then(async () =>
      await this.client.rpc(this.session!!, rpcId, {})
    ))
  }

  joinMatch(id: string): Observable<Match> {
    if (!this.socket) return EMPTY
    return from(this.socket.joinMatch(id))
  }

  leaveMatch(id: string) {
    this.socket?.leaveMatch(id)
  }
}
