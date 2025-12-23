import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PetsService {
  private api = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(pet: any) {
    return this.http.post<any>(this.api, pet);
  }

  update(id: string, pet: any) {
    return this.http.put<any>(`${this.api}/${id}`, pet);
  }

  delete(id: string) {
    return this.http.delete<any>(`${this.api}/${id}`);
  }
}
