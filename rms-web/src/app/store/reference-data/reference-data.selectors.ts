import {  ReferenceRow } from '@core/interfaces/reference-row';
import { createFeatureSelector, createSelector } from '@ngrx/store';


export interface ReferenceDataState {
  referenceData: ReferenceRow [];
}

export const selectReferenceDataState=createFeatureSelector<ReferenceDataState>(
  'reference'
)

export const selectAll = createSelector(
  selectReferenceDataState,
  (state: ReferenceDataState) => state.referenceData
);

export const selectByCategory =(category:string)=>(
createSelector(
  selectReferenceDataState,
  (state) => state.referenceData.filter(c=>c.categoryName===category)
)
)

