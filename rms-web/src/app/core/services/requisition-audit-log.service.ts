
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
   */
  public getAllLogs(): Observable<RequisitionLog[]> {
    return this.httpClient.get<RequisitionLog[]>(this.apiUrl);
  }

  // /**
  //  * Fetch stage change logs for a requisition
  //  */
  // public getStageLogs(requisitionId: number): Observable<RequisitionLog[]> {
  //   return this.httpClient.get<RequisitionLog[]>(`${this.apiUrl}/${requisitionId}/stage-logs`);
  // }

  /**
   * Update requisition stage
   */
  public updateStage(requisitionId: number, requisitionStageId: number, note: string) {
    return this.httpClient.put(`${this.apiUrl}/${requisitionId}/stage`, {
      requisitionStageId,
      note
    });
  }
}
