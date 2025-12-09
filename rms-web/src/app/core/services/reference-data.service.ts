import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReferenceRow } from '@core/interfaces/reference-row';
import { environment } from '@environments';

@Injectable({ providedIn: 'root' })
export class ReferenceDataService {
  private apiUrl = `${environment.API_URL}/reference-data`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ReferenceRow[]> {
    return this.http.get<ReferenceRow[]>(this.apiUrl);
  }
}
