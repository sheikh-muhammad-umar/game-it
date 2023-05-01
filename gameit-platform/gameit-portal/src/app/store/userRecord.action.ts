import { createAction, props } from '@ngrx/store';

export const userRecord = createAction('userRecord',
    props<{ userRecord: any }>());