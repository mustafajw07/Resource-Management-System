import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments';
import { Project } from '@core/interfaces/project';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/projects`;

  /**
   * Get all reference data rows.
   * @return Observable<ReferenceRow[]>
   */
  public getAllProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.apiUrl);
  }
}
