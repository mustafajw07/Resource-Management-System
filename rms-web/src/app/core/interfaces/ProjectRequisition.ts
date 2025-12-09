export interface ProjectRequisition {
    requisitionId: number;
    requisitionDate: string; // ISO date string
    projectId: number;
    projectName: string;
    clientId: number;
    clientName: string;
    projectStatus: string;
    projectStartDate: string; // ISO date string
    projectEndDate: string; // ISO date string
    requisitionTypeId: number;
    requisitionTypeName: string;
    requisitionStageId: number;
    requisitionStageName: string;
    fulfillmentMediumId: number;
    fulfillmentMediumName: string;
    urgencyId: number;
    urgencyName: string;
    requisitionStatusId: number;
    requisitionStatusName: string;
    capabilityAreaId: number;
    capabilityAreaName: string;
    hiringPocId: number;
    hiringPocName: string;
    hiringPocEmail: string;
    clientPocName: string;
    fteHeadCount: number;
    fteTotalAllocation: number | null;
    fulfilledAllocation: number;
    notes: string;
    tentativeOnboardingDate: string; // ISO date string
    ageingDays: number;
}