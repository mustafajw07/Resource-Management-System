// /src/app/core/interfaces/project-requisition.ts

export type ISODateString = string;

/**
 * Main (read) shape returned by the API
 */
export interface ProjectRequisition {
    requisitionId: number;
    requisitionDate: ISODateString | Date;
    projectId: number;
    projectName: string;
    clientId: number;
    clientName: string;
    projectStatus: string;
    projectStartDate: ISODateString;
    projectEndDate: ISODateString;
    requisitionTypeId: number;
    requisitionTypeName: string;
    requisitionStageId: number;
    requisitionStageName: string;
    fulfillmentMediumId: number;
    fulfillmentMediumName: string;
    urgencyName: string;
    skillId: number;
    skill: string;
    requisitionStatusId: number;
    requisitionStatusName: string;
    hiringPocId: number;
    hiringPocName: string;
    hiringPocEmail: string;
    clientPocName: string;
    fteHeadCount: number;
    fteTotalAllocation: number | null;
    fulfilledAllocation: number;
    notes: string;
    tentativeOnboardingDate: ISODateString;
    ageingDays: number;
}

/**
 * Create input: omit server-generated/read-only fields
 * (adjust omitted keys if your backend differs)
 */
export type ProjectRequisitionCreate = Omit<
    ProjectRequisition,
    | 'requisitionId'
    | 'projectName'
    | 'clientName'
    | 'projectStatus'
    | 'projectStartDate'
    | 'projectEndDate'
    | 'hiringPocName'
    | 'hiringPocEmail'
    | 'clientPocName'
    | 'ageingDays'
    | 'skillId'
>;

/**
 * Partial input for PATCH/updates — all fields optional except identifiers you want required.
 * Example: to allow partial updates but require requisitionId for identifying resource:
 */
export type ProjectRequisitionPatch = Partial<ProjectRequisitionCreate> & {
    requisitionId: number;
};

/**
 * If you want a fully generic update where even the id can be omitted, use:
 * type ProjectRequisitionPartial = Partial<ProjectRequisition>;
 */