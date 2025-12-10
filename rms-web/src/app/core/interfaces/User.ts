export interface User{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name?: string;
}

export interface UserResponse{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    jobTitleId: number;
    locationId: number;
}