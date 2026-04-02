import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeadlineCountdown } from '@code/interface/deadline.interface';

@Injectable({ providedIn: 'root' })
export class DeadlineCountdownService {
  constructor(private http: HttpClient) { }

  getDeadlineSeconds(): Observable<DeadlineCountdown> {
    const headers = new HttpHeaders();
    return this.http.get<DeadlineCountdown>('/api/deadline', { headers });
  }
}