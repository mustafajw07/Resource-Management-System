import { ReferenceRow } from "@core/interfaces/reference-row";

export interface ReferenceDataState {
  referenceData: ReferenceRow[];
}

export const initialReferenceDataState: ReferenceDataState = {
    referenceData: []
};