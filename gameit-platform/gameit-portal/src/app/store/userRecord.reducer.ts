import { Action, createReducer, on } from '@ngrx/store';
import * as userActions from './userRecord.action';

export interface UserState {
    User: any;
}

export const userInitialState: UserState = {
    User: null
};

const userReducer = createReducer(
    userInitialState,
    on(userActions.userRecord, (state, { userRecord }) => (
        { User: userRecord }
    ))
);

export function reducer(state: UserState | undefined, action: Action) {
    return userReducer(state, action);
}