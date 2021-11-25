import Context = nkruntime.Context;
import Logger = nkruntime.Logger;
import Nakama = nkruntime.Nakama;
import MatchState = nkruntime.MatchState;
import MatchSignalFunction = nkruntime.MatchSignalFunction;
import MatchDispatcher = nkruntime.MatchDispatcher;
import Presence = nkruntime.Presence;
import MatchMessage = nkruntime.MatchMessage;

interface GameState extends MatchState {
    presences: Presence[],
    ticksEmpty: number
}

export const matchInit =  (ctx: Context, logger: Logger, nk: Nakama, params: { [key: string]: string; }):  { state: GameState; tickRate: number; label: string; } => {
    logger.debug('Lobby match created');

    const presences: Presence[] = [];
    return {
        state: {
            presences,
            ticksEmpty: 0
        },
        tickRate: 5,
        label: ''
    };
};

export const matchJoinAttempt = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, presence: Presence, metadata: {[key: string]: any })
    : {state: GameState, accept: boolean, rejectMessage?: string | undefined } | null => {
    logger.debug('%q attempted to join Lobby match', ctx.userId);

    return {
        state,
        accept: true
    };
}

export const matchJoin = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, presences: Presence[])
    : { state: GameState } | null => {
    state.presences = [...state.presences, ...presences]
    logger.debug('State:', state)

    return {
        state
    };
}

export const matchLeave = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, presences: Presence[])
    : { state: GameState } | null => {
    presences.forEach(presence => {
        state.presences = state.presences.filter(p => presence.userId !== p.userId);
        logger.debug('%q left Lobby match', presence.userId);
    });

    return {
        state
    };
}

export const matchLoop = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, messages: MatchMessage[])
    : { state: GameState} | null => {
    logger.debug('Lobby match loop executed');

    state.presences.forEach(presence => {
        logger.info('Presence %v name $v', presence.userId, presence.username);
    });

    messages.forEach(message => {
        logger.info('Received %v from %v', message.data, message.sender.userId);
        dispatcher.broadcastMessage(1, message.data, [message.sender], null);
    });

    if(state.presences.length === 0)
        state.ticksEmpty++
    else
        state.ticksEmpty = 0

    if(state.ticksEmpty >= 30 )
        return null

    return {
        state
    };
}

export const matchTerminate = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, graceSeconds: number)
    : { state: GameState} | null => {
    logger.debug('Lobby match terminated');

    const message = `Server shutting down in ${graceSeconds} seconds.`;
    dispatcher.broadcastMessage(2, message, null, null);

    return {
        state
    };
}

export const matchSignal: MatchSignalFunction = (ctx: Context, logger: Logger, nk: Nakama, dispatcher: MatchDispatcher, tick: number, state: GameState, data: string)
    : { state: GameState; tickRate: number; label: string; } => {
    return { state: state, tickRate: 5, label: "" };
};