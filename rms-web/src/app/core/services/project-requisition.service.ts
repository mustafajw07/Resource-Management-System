import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProjectRequisition } from '@core/interfaces/ProjectRequisition';
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
  public GetAllRequisitions(): Observable<ProjectRequisition[]> {
    return this.httpClient.get<ProjectRequisition[]>(this.apiUrl);
  }
}
