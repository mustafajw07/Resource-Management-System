
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RequisitionLog } from '@core/interfaces/requisition-audit-log';
import { environment } from '@environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequisitionAuditLogService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/requisitions-log`;
  /**
   * Fetch all requisition logs
   * @returns Observable <RequisitionLog[]>
   */
  public getAllLogs(): Observable<RequisitionLog[]> {
    return this.httpClient.get<RequisitionLog[]>(this.apiUrl);
  }
  
  /**
   * Fetch all requisition logs By ID
   * @returns Observable <RequisitionLog[]>
   */
  public getLogsByRequisitionId(id: number): Observable<RequisitionLog[]> {
    return this.httpClient.get<RequisitionLog[]>(`${this.apiUrl}/${id}`);
  }
}
