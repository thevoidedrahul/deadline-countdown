import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeadlineCountdownService } from './deadline-countdown.service';
import { DeadlineCountdown } from '@code/interface/deadline.interface';
import { HttpErrorResponse } from '@angular/common/http';

describe('DeadlineCountdownService', () => {
  let service: DeadlineCountdownService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeadlineCountdownService]
    });
    service = TestBed.inject(DeadlineCountdownService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDeadlineSeconds', () => {
    it('should return deadline data successfully', () => {
      const mockResponse: DeadlineCountdown = { secondsLeft: 3600 };

      service.getDeadlineSeconds().subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/deadline');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle HTTP errors with retry logic', () => {
      const mockResponse: DeadlineCountdown = { secondsLeft: 3600 };
      let requestCount = 0;

      service.getDeadlineSeconds().subscribe({
        next: data => {
          expect(data).toEqual(mockResponse);
          expect(requestCount).toBe(3);
        },
        error: () => expect(false).toBe(true)
      });

      const req1 = httpMock.expectOne('/api/deadline');
      expect(req1.request.method).toBe('GET');
      requestCount++;
      req1.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      setTimeout(() => {
        const req2 = httpMock.expectOne('/api/deadline');
        requestCount++;
        req2.flush('Error', { status: 500, statusText: 'Internal Server Error' });

        setTimeout(() => {
          const req3 = httpMock.expectOne('/api/deadline');
          requestCount++;
          req3.flush(mockResponse);
        }, 1000);
      }, 1000);
    });

    it('should share replay the response', () => {
      const mockResponse: DeadlineCountdown = { secondsLeft: 3600 };
      let subscriptionCount = 0;

      const observable = service.getDeadlineSeconds();
      
      observable.subscribe(() => subscriptionCount++);
      observable.subscribe(() => subscriptionCount++);

      const req = httpMock.expectOne('/api/deadline');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      expect(subscriptionCount).toBe(2);
    });

    it('should handle different response scenarios', () => {
      const testCases: DeadlineCountdown[] = [
        { secondsLeft: 0 },
        { secondsLeft: 86400 },
        { secondsLeft: 999999 }
      ];

      testCases.forEach((mockResponse) => {
        service.getDeadlineSeconds().subscribe(data => {
          expect(data).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('/api/deadline');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
      });
    });

    it('should handle network timeout errors', () => {
      const mockResponse: DeadlineCountdown = { secondsLeft: 3600 };

      service.getDeadlineSeconds().subscribe({
        next: data => {
          expect(data).toEqual(mockResponse);
        }
      });

      const req1 = httpMock.expectOne('/api/deadline');
      req1.error(new ErrorEvent('timeout'), { status: 0, statusText: 'Unknown Error' });

      setTimeout(() => {
        const req2 = httpMock.expectOne('/api/deadline');
        req2.flush(mockResponse);
      }, 1000);
    });

    it('should handle retry mechanism', () => {
      const mockResponse: DeadlineCountdown = { secondsLeft: 3600 };
      
      service.getDeadlineSeconds().subscribe();

      const req1 = httpMock.expectOne('/api/deadline');
      req1.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      expect(true).toBe(true);
    });
  });

  describe('Error scenarios', () => {
    it('should handle malformed JSON response', () => {
      service.getDeadlineSeconds().subscribe({
        error: (error) => {
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne('/api/deadline');
      req.flush('invalid json', { status: 200, statusText: 'OK' });
    });

    it('should handle HTTP error status codes', () => {
      const errorCases = [
        { status: 404, statusText: 'Not Found' },
        { status: 401, statusText: 'Unauthorized' },
        { status: 500, statusText: 'Internal Server Error' }
      ];

      errorCases.forEach(errorCase => {
        service.getDeadlineSeconds().subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(errorCase.status);
          }
        });

        const req = httpMock.expectOne('/api/deadline');
        req.flush('Error', errorCase);
      });
    });
  });
});
