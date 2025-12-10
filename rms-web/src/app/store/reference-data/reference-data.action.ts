import { createAction, props } from '@ngrx/store';
import { ReferenceRow } from '@core/interfaces/reference-row';

export const ADD_REFERENCE_DATA = '[Reference Data] Add ReferenceData'

export const addReferenceData = createAction(
    ADD_REFERENCE_DATA,
    props<{referenceData: ReferenceRow[]}>(),
)