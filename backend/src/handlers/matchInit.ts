import {GameState, GameStateState, GameStateToClient, OpCodes, Player} from "shared";
import Context = nkruntime.Context;
import Logger = nkruntime.Logger;
import Nakama = nkruntime.Nakama;
import MatchDispatcher = nkruntime.MatchDispatcher;
import Presence = nkruntime.Presence;
import MatchMessage = nkruntime.MatchMessage;
import {initializeGame} from "./functions/initGame";

function gameStateToMatchData(state: GameState, userId: string): GameStateToClient {
    const {players, gameOwner, draw } = state
    return {
        players,
        draw,
        throw: state.throw,
        gameOwner,
        state: state.state
    }
}

const sendGameState = (state: GameState, dispatcher: MatchDispatcher) => {
    state.players.forEach((player) => {
        dispatcher.broadcastMessage(
            OpCodes.GAME_STATE_UPDATE,
            JSON.stringify(gameStateToMatchData(state, player.userId)),
            [player]
        )
    })
}

const handleMessage = (state: GameState, message: MatchMessage, dispatcher: MatchDispatcher): GameState => {
    switch (message.opCode) {
        case OpCodes.SEND_CHAT_MESSAGE:
            const from = state.players.find((p) => p.userId === message.sender.userId).displayName
            const chatMessage = {from, message: JSON.parse(message.data)}
            dispatcher.broadcastMessage(OpCodes.SEND_CHAT_MESSAGE, JSON.stringify(chatMessage), state.players, null);
            state.chatMessages = [...state.chatMessages, chatMessage]
            break
        case OpCodes.START_GAME:
            if(state.players.length < 2) {
                dispatcher.broadcastMessage(OpCodes.ERROR, JSON.stringify('Mas malo kamaradu'), [message.sender])
                return state
            }
            if(state.gameOwner !== message.sender.userId) {
                dispatcher.broadcastMessage(OpCodes.ERROR, JSON.stringify('Tohle nejde'), [message.sender])
            }
            state.state = GameStateState.IN_PROGRESS
            state = initializeGame(state)
            sendGameState(state, dispatcher)
            break
        case OpCodes.TEST_ACTION:
            const randomPlayer = Math.floor(Math.random() * state.players.length)
            let cardIndex = 0
            for(let i = 0; i < 8; i++) {
                if(state.players[randomPlayer].cards[i] !== null) {
                    cardIndex = i
                    break
                }
            }
            const card = state.players[randomPlayer].cards[cardIndex]
            card.index = state.index++
            state.throw = [...state.throw, card]
            state.players[randomPlayer].cards[cardIndex] = null
            sendGameState(state, dispatcher)
            break
    }
    return state
}

export const matchInit = (ctx: Context, logger: Logger, nk: Nakama, params: { [key: string]: string; }): { state: GameState; tickRate: number; label: string; } => {
    logger.debug('Lobby match created');

    return {
        state: {
            players: [],
            draw: [],
            throw: [],
            gameOwner: '',
            ticksEmpty: 0,
            chatMessages: [],
            index: 54,
            state: GameStateState.IN_LOBBY
        },
        tickRate: 5,
        label: ''
    };
};

export const matchJoinAttempt = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, presence: Presence, metadata: { [key: string]: any })
    : { state: GameState, accept: boolean, rejectMessage?: string | undefined } | null => {
    logger.debug('%q attempted to join Lobby match', ctx.userId);
    // TODO: enable
    // if(state.state !== GameStateState.IN_LOBBY) {
    //     return { state, accept: false, rejectMessage: 'Hra uz zacala.' }
    // }
    return {
        state,
        accept: true
    };
}

export const matchJoin = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, presences: Presence[])
    : { state: GameState } | null => {
    if (presences.length === 0) {
        return {state}
    }

    const newPlayers = presences.map((presence): Player => {
        const {displayName} = nk.usersGetId([presence.userId])[0]
        return {
            ...presence,
            displayName: displayName,
            cards: [null, null, null, null, null, null, null, null],
            hand: null
        }
    })
    state.players = [...state.players, ...newPlayers]

    if (state.gameOwner === '') {
        state.gameOwner = presences[0].userId
    }

    newPlayers.forEach((player) => {
        dispatcher.broadcastMessage(
            OpCodes.CHAT_MESSAGES,
            JSON.stringify(state.chatMessages),
            [player]
        )
    })

    // TODO: REMOVE
    if(state.state === GameStateState.IN_PROGRESS) {
        state = initializeGame(state)
    }

    sendGameState(state, dispatcher)

    return {
        state
    };
}

export const matchLeave = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, presences: Presence[])
    : { state: GameState } | null => {
    presences.forEach(presence => {
        state.players = state.players.filter(p => presence.userId !== p.userId);
        if (presence.userId === state.gameOwner) {
            state.gameOwner = ''
        }
        logger.debug('%q left Lobby match', presence.userId);
    });

    if (state.gameOwner === '' && state.players.length !== 0) {
        state.gameOwner = state.players[0].userId
    }

    state.players.forEach((player) => {
        dispatcher.broadcastMessage(
            OpCodes.GAME_STATE_UPDATE,
            JSON.stringify(gameStateToMatchData(state, player.userId)),
            [player]
        )
    })

    return {
        state
    };
}

export const matchLoop = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, messages: MatchMessage[])
    : { state: GameState } | null => {
    messages.forEach(message => {
        state = handleMessage(state, message, dispatcher)
    });

    if (state.players.length === 0)
        state.ticksEmpty++
    else
        state.ticksEmpty = 0

    if (state.ticksEmpty >= 30)
        return null

    return {
        state
    };
}

export const matchTerminate = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, graceSeconds: number)
    : { state: GameState } | null => {
    logger.debug('Lobby match terminated');

    // const message = `Server shutting down in ${graceSeconds} seconds.`;
    // dispatcher.broadcastMessage(2, message, null, null);

    return {
        state
    };
}

export const matchSignal = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, data: string)
    : { state: GameState; tickRate: number; label: string; } => {
    return {state: state, tickRate: 5, label: ""};
};