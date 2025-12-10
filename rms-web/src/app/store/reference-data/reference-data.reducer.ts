import { createReducer, on } from '@ngrx/store';
import { addReferenceData } from './reference-data.action';
import { initialReferenceDataState } from './reference-data.state';

export const referenceDataReducer = createReducer(
    initialReferenceDataState,
    on(addReferenceData, (state, { referenceData }) => ({
        ...state,
        referenceData: referenceData,
        error: null
    })),
);