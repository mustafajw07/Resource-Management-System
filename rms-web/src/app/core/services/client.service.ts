import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Client, ClientManager } from "@core/interfaces/Client";
import { environment } from "@environments";
import { Observable } from "rxjs";



@Injectable({ providedIn: 'root' })
export class ClientService {
    private readonly httpClient = inject(HttpClient);
    private apiUrl = `${environment.API_URL}/clients`;

    /**
     * Fetch all clients from the API.
     * @returns Observable of client array
     */
    public getAllClients(): Observable<Client[]> {
        return this.httpClient.get<Client[]>(this.apiUrl)
    }

    /**
     * Fetch all client managers from the API.
     * @returns Observable of client manager array
     */
    public getAllClientManagers(clientId: number): Observable<ClientManager[]> {
        return this.httpClient.get<ClientManager[]>(`${this.apiUrl}/managers/${clientId}`)
    }
}