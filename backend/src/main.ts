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
import {rpcCreateMatchId, RpcCreateMatchResponse, rpcListMatchesId, RpcListMatchesResponse} from "shared";

const matchName = 'nevim'

function rpcCreateReturn<_T>(r: _T): string {
    return JSON.stringify(r)
}

const rpcCreateMatch: RpcFunction = (ctx: Context, logger: Logger, nk: Nakama, payload: string): string | void => {
    const matchId = nk.matchCreate(matchName);
    const match = nk.matchGet(matchId)
    return rpcCreateReturn<RpcCreateMatchResponse>(match)
}

const rpcListMatches: RpcFunction = (context: Context, logger: Logger, nk: Nakama): string | void => {
    const matches = nk.matchList(50);
    return rpcCreateReturn<RpcListMatchesResponse>({matches})
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
