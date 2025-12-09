import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReferenceRow } from '@core/interfaces/reference-row';
import { environment } from '@environments';

@Injectable({ providedIn: 'root' })
export class ReferenceDataService {
  private httpClient = inject(HttpClient);

  private apiUrl = `${environment.API_URL}/reference-data`;

  /**
   * Get all reference data rows.
   * @return Observable<ReferenceRow[]>
   */
  getAll(): Observable<ReferenceRow[]> {
    return this.httpClient.get<ReferenceRow[]>(this.apiUrl);
  }
}
