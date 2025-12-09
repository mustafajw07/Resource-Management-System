import { createReducer, on } from '@ngrx/store';
import { ReferenceDataActions } from './reference-data.action';
import { groupByCategoryName, ReferenceDataState } from '@core/interfaces/reference-row';



const initialState: ReferenceDataState = {
    all: [],
    byCategoryName: {},
    status: 'idle',
    error: null,
    lastLoadedAt: null
};

export const referenceDataReducer = createReducer(
        initialState,
        on(ReferenceDataActions.load, (state) => ({
            ...state, status: 'loading', error: null
        })),
        on(ReferenceDataActions.loadSuccess, (state, { rows }) => ({
            ...state,
            status: 'succeeded',
            all: rows,
            byCategory: groupByCategoryName(rows),
            lastLoadedAt: Date.now(),
        })),
        on(ReferenceDataActions.loadFailure, (state, { error }) => ({
            ...state, status: 'failed', error
        })),
    
);