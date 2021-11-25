import {Injectable} from '@angular/core';
import {Client, Match, MatchPresenceEvent, Session, Socket} from "@heroiclabs/nakama-js";
import {v4 as uuidv4} from "uuid";
import {CookieService} from "ngx-cookie-service";
import {BehaviorSubject, EMPTY, filter, from, map, mergeMap, Observable, take, tap} from "rxjs";
import {ApiAccount, ApiUpdateAccountRequest} from "@heroiclabs/nakama-js/dist/api.gen";

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

  private matchPresenceSubject = new BehaviorSubject<MatchPresenceEvent | null>(null)

  private stateSubject = new BehaviorSubject<State>(State.INIT)

  public get matchPresence$() {
    return this.matchPresenceSubject.asObservable()
  }

  constructor(private cookieService: CookieService) {
    this.client = new Client("defaultkey", "localhost", "7350")
  }

  private registerSocketCallbacks() {
    if (!this.socket)
      return
    this.socket.onmatchpresence = (event) => {
      this.matchPresenceSubject.next(event)
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

    return from(this.client.authenticateDevice(deviceId, true, username)).pipe(
      mergeMap((session) => {
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

  createMatch(): Observable<{ size: number, label: string, matchId: string, authoritative: true }> {
    const rpcId = 'create-match'
    return from(this.client.rpc(this.session!!, rpcId, {})).pipe(map(
      (rpcResponse) => rpcResponse.payload as any)
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
}
