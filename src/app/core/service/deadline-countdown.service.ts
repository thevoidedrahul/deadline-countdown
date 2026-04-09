import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, retry, catchError, throwError, timer, shareReplay } from 'rxjs';
import { DeadlineCountdown } from '@code/interface/deadline.interface';

@Injectable({ providedIn: 'root' })
export class DeadlineCountdownService {
  private readonly http = inject(HttpClient);
  private readonly API_ENDPOINT = '/api/deadline';
  private readonly RETRY_COUNT = 3;
  private readonly RETRY_DELAY = 1000;

  getDeadlineSeconds(): Observable<DeadlineCountdown> {
    return this.http.get<DeadlineCountdown>(this.API_ENDPOINT).pipe(
      retry({
        count: this.RETRY_COUNT,
        delay: this.calculateRetryDelay.bind(this)
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private calculateRetryDelay(error: HttpErrorResponse, retryCount: number): Observable<number> {
    const delay = Math.min(this.RETRY_DELAY * Math.pow(2, retryCount - 1), 10000);
    console.warn(`Retry attempt ${retryCount} after ${delay}ms due to:`, error.message);
    return timer(delay);
  }
}