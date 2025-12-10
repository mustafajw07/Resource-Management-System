export interface Client{
    clientId: number;
    clientName: string;
}

export interface ClientManager{
    managerId: number;
    managerName: string;
    projectId: number;
    clientId: number;
}