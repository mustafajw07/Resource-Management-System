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
   * Fetch all project requisitions notes by requisition ID
   * @param requisitionId The ID of the requisition
   * @returns Observable <Notes[]>
   */
  public getAllNotesForRequisitionId(requisitionId: number): Observable<Notes[]> {
    return this.httpClient.get<Notes[]>(`${this.apiUrl}/${requisitionId}`);
  }

  /**
   * Create a new note for a requisition
   * @param requisitionId The ID of the requisition
   * @param noteText The text of the note
   * @returns Observable of boolean indicating success
   */
  public createNote(requisitionId: number, noteText: string): Observable<boolean> {
    const payload = { requisitionId, noteText };
    return this.httpClient.post<boolean>(this.apiUrl, payload);
  }
}