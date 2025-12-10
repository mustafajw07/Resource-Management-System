import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReferenceDataState } from './reference-data.state';
import { ReferenceRow } from '@core/interfaces/reference-row';

export const selectReferenceDataState = createFeatureSelector<ReferenceDataState>('referenceData');

export const selectAllReferenceData = createSelector(
  selectReferenceDataState,
  (state: ReferenceDataState) => state.referenceData
);

export const selectByCategory = (category:string) => 
  createSelector(
    selectAllReferenceData, (referenceData: ReferenceRow[]) => 
    referenceData.filter(row => row.categoryName === category )
);
