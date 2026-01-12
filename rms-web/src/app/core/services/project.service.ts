import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments';
import { Project, UtilizationData } from '@core/interfaces/project';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/projects`;

  /**
   * Get all projects.
   * @return Observable<Project[]>
   */
  public getAllProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.apiUrl);
  }

  /**
   * Get all project utilization data.
   * @return Observable<UtilizationData[]>
   */
  public getAllProjectUtilization(): Observable<UtilizationData[]> {
    return this.httpClient.get<UtilizationData[]>(`${this.apiUrl}/utilization`);
  }
}
