import { createAction, props } from '@ngrx/store';
import { ReferenceRow } from '@core/interfaces/reference-row';


export const AddReferenceData = createAction(
    '[add] referenceData',
     props<{rows:ReferenceRow[]}>(),
)