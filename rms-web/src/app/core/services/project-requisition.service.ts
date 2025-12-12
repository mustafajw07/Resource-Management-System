import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProjectRequisition, ProjectRequisitionCreate } from '@core/interfaces/project-requisition';
import { Observable } from 'rxjs';
import { environment } from '@environments';

@Injectable({ providedIn: 'root' })
export class ProjectRequisitionService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/project-requisitions`;

  /**
   * Fetch all project requisitions
   * @returns Observable of ProjectRequisition array
   */
  public getAllRequisitions(): Observable<ProjectRequisition[]> {
    return this.httpClient.get<ProjectRequisition[]>(this.apiUrl);
  }

  /**
   * Creates new project requisition
   * @returns Observable of boolean indicating success
   */
  public createRequisition(payload: ProjectRequisitionCreate): Observable<boolean> {
    return this.httpClient.post<boolean>(this.apiUrl, payload);
  }
}
