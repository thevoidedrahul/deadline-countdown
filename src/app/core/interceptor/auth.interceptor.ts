import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = this.setApiHeaders(request);
        return next.handle(request);
    }

    private setApiHeaders(request: HttpRequest<any>): HttpRequest<any> {
        const existingHeaders = request.headers.keys().reduce(
            (acc, key) => {
                acc[key] = request.headers.get(key)!;
                return acc;
            },
            {} as Record<string, string>
        );

        let headers: Record<string, string> = {
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": window.origin,
            "Cache-Control": "no-store, no-cache, must-revalidate",
            Pragma: "no-cache",
            withCredentials: "true",
            credentials: "include"
        };

        return request.clone({
            setHeaders: { ...existingHeaders, ...headers },
            withCredentials: true
        });
    }
}
