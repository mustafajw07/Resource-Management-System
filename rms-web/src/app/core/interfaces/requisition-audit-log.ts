export type ISODateString = string;

export interface RequisitionLog{
    auditId: number,
    requisitionId: number, 
    fieldName: string, 
    oldValue: string, 
    newValue: string, 
    actionType: 'UPDATE', 
    changedBy: string, 
    changedAt: string | Date;
}