// import 'nakama-runtime'

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

export interface GameState extends MatchState {
    presences: Presence[],
    ticksEmpty: number
}
