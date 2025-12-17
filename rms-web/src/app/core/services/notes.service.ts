import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments';
import { HttpClient } from '@angular/common/http';
import { Notes } from '@core/interfaces/notes';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/notes`;

  /**
   * Fetch all project requisitions
   * @returns Observable of ProjectRequisition array
   */
  public getAllNotesForRequisitionId(requisitionId: number): Observable<Notes[]> {
    return this.httpClient.get<Notes[]>(`${this.apiUrl}/${requisitionId}`);
  }
}