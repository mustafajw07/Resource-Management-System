export interface Project{
    projectId:number;
    projectName:string;
    clientId:number;
    status:string;
    startDate:Date;
    endDate:Date;
}

export interface UtilizationData{
    userId:number;
    userName:string;
    email:string;
    locationId:number;
    locationName:string;
    projectId:number;
    projectName:string;
    utilizationPercentage:number;
    allocationStartDate:Date;
    allocationEndDate:Date;
}