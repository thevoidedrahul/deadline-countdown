import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class ErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((response: HttpErrorResponse) => {
                return this.handleJsonError(response);
            })
        );
    }

    private handleJsonError(errorResponse: HttpErrorResponse): Observable<never> {
        let errorMessage: string;

        if (errorResponse.error instanceof ErrorEvent) {

            errorMessage = `Network error: ${errorResponse.error.message}`;
        } else {
            switch (errorResponse.status) {
                case 0:
                    errorMessage = 'Unable to connect to server. Please check your network connection.';
                    break;
                case 404:
                    errorMessage = 'Deadline service not found. Please contact support.';
                    break;
                case 500:
                    errorMessage = 'Server error. Please try again later.';
                    break;
                case 503:
                    errorMessage = 'Service temporarily unavailable. Please try again later.';
                    break;
                default:
                    errorMessage = `Server error (${errorResponse.status}): ${errorResponse.message}`;
            }
        }

        const error = {
            status: errorResponse.status,
            message: errorMessage,
            timestamp: new Date().toISOString(),
            url: errorResponse.url
        }

        console.error('DeadlineCountdownService Error:', error);

        return throwError(() => error);
    }
}