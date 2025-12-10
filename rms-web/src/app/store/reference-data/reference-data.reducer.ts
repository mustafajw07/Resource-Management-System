import { createReducer, on } from '@ngrx/store';

import { ReferenceRow } from '@core/interfaces/reference-row';
import { AddReferenceData } from './reference-data.action';

export interface ReferenceDataState {
  referenceData:ReferenceRow[]
}


const initialState: ReferenceDataState = {
    referenceData:[]
};

export const referenceDataReducer = createReducer(
        initialState,
        on(AddReferenceData, (state, { rows }) => ({
            ...state,
            referenceData:rows
        })),
);