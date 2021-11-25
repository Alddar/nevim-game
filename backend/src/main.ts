import RpcFunction = nkruntime.RpcFunction;
import Context = nkruntime.Context;
import Logger = nkruntime.Logger;
import Nakama = nkruntime.Nakama;
import {
    matchInit,
    matchJoin,
    matchJoinAttempt,
    matchLeave,
    matchLoop,
    matchSignal,
    matchTerminate
} from "./handlers/matchInit";
import Initializer = nkruntime.Initializer;

const matchName = 'nevim'

const rpcCreateMatchId = 'create-match'
const rpcCreateMatch: RpcFunction = (ctx: Context, logger: Logger, nk: Nakama, payload: string): string | void => {
    const matchId = nk.matchCreate(matchName);
    const match = nk.matchGet(matchId)
    return JSON.stringify(match);
}

const rpcListMatchesId = 'list-matches'
const rpcListMatches: RpcFunction = (context: Context, logger: Logger, nk: Nakama): string | void => {
    const matches = nk.matchList(50);
    return JSON.stringify({matches})
}

const InitModule: nkruntime.InitModule =
    (ctx: Context, logger: Logger, nk: Nakama, initializer: Initializer) => {
        initializer.registerRpc(rpcCreateMatchId, rpcCreateMatch)
        initializer.registerRpc(rpcListMatchesId, rpcListMatches)
        initializer.registerMatch(matchName, {
            matchInit,
            matchJoinAttempt,
            matchJoin,
            matchLeave,
            matchLoop,
            matchTerminate,
            matchSignal
        })
    }

!InitModule && InitModule.bind(null);
