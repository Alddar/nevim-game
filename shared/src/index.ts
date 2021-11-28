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

export interface Card {
    id: number,
    value: string,
    index: number,
}

export type Hand = [
        Card | null,
        Card | null,
        Card | null,
        Card | null,
        Card | null,
        Card | null,
        Card | null,
        Card | null,
]

export interface Player extends Presence {
    displayName: string,
    cards: Hand,
    hand: Card | null
}

export interface ChatMessage {
    from: string,
    message: string
}

export class GameStateState {
    public static readonly IN_LOBBY = 0
    public static readonly IN_PROGRESS = 1
}

export interface GameState extends MatchState {
    players: Player[],
    draw: Card[],
    throw: Card[],

    ticksEmpty: number,
    gameOwner: string,
    chatMessages: ChatMessage[],
    state: number,
    index: number
}

export interface GameStateToClient {
    players: Player[],
    draw: Card[],
    throw: Card[]

    gameOwner: string,
    state: number
}

export class OpCodes {
    public static readonly ERROR = 1
    public static readonly GAME_STATE_UPDATE = 2
    public static readonly SEND_CHAT_MESSAGE = 3
    public static readonly CHAT_MESSAGES = 4
    public static readonly START_GAME = 5
    public static readonly TEST_ACTION = 99
}
