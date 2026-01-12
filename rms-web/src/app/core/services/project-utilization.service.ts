import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/project-utilization`;

}