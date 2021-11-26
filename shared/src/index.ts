import 'nakama-runtime'

import MatchState = nkruntime.MatchState;
import Presence = nkruntime.Presence;
import Match = nkruntime.Match;

export const rpcCreateMatchId = 'create-match'
export interface RpcCreateMatchParams {

}
export type RpcCreateMatchResponse = Match

export const rpcListMatchesId = 'list-matches'
export interface RpcListMatchesParams {

}
export interface RpcListMatchesResponse {
    matches: Match[]
}

export interface Player extends Presence {
    displayName: string
}

export interface GameState extends MatchState {
    players: Player[],
    ticksEmpty: number,
    gameOwner: string
}

export interface MatchDataState {
    players: Player[]
    gameOwner: string
}

export class OpCodes {
    public static readonly GAME_STATE_UPDATE = 1
}
