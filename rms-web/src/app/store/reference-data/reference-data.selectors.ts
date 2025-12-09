
// import { createSelector } from '@ngrx/store';
// import { referenceDataReducer } from './reference-data.reducer';

// export const {
//   name,
//   selectReferenceDataState,
//   selectAll,
//   selectByCategoryName, 
//   selectStatus,
//   selectError,
// } = referenceDataReducer;

// export const selectCategoryByName = (categoryName: string) =>
//   createSelector(selectByCategoryName, (byCategoryName) =>
//     byCategoryName[categoryName] || { items: [] }
//   );

import { ReferenceDataState } from '@core/interfaces/reference-row';
import { createSelector } from '@ngrx/store';

export interface AppState {
  referenceData: ReferenceDataState;
}

export const selectReferenceDataState = (state: AppState) => state.referenceData;

export const selectAll = createSelector(
  selectReferenceDataState,
  (state) => state.all
);

export const selectByCategory = createSelector(
  selectReferenceDataState,
  (state) => state.byCategoryName
);

export const selectStatus = createSelector(
  selectReferenceDataState,
  (state) => state.status
);

export const selectError = createSelector(
  selectReferenceDataState,
  (state) => state.error
);

export const selectCategoryByName = (categoryName: string) =>
  createSelector(selectByCategory, (byCategory) => byCategory[categoryName] ?? { items: [] });