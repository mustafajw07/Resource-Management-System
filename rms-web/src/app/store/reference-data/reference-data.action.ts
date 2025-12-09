import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ReferenceRow } from '@core/interfaces/reference-row';

export const ReferenceDataActions = createActionGroup({
    source: 'ReferenceData',
    events: {
        'Load': emptyProps(),
        'Load Success': props<{ rows: ReferenceRow[] }>(),
        'Load Failure': props<{ error: string }>(),
    },
});
