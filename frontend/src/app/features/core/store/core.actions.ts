import {createAction, props} from "@ngrx/store";
import {Session} from "@heroiclabs/nakama-js";

interface AuthenticateUserProps {
  username: string,
  deviceId: string
}

export const authenticateUser = createAction('authenticate', props<AuthenticateUserProps>())

interface SessionUpdateProps {
  session: Session
}

export const sessionUpdate = createAction('sessionUpdate', props<SessionUpdateProps>())
