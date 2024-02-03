import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpBaseService {
  constructor(private readonly http: HttpClient) {}

  get<T>(url: string, params?: { [key: string]: any }): Observable<T> {
    return this.http.get<T>(url, params);
  }

  post<T>(
    url: string,
    body: any,
    params?: { [key: string]: any }
  ): Observable<T> {
    return this.http.post<T>(url, body, params);
  }
}
