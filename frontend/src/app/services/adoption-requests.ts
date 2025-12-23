import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdoptionRequestsService {
  private readonly api = `${environment.apiUrl}/adoption-requests`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(request: any) {
    return this.http.post<any>(this.api, request);
  }

  update(id: string, request: any) {
    return this.http.put<any>(`${this.api}/${id}`, request);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.api}/${id}`);
  }
}
