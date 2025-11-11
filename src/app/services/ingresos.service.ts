import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { income } from '../interface/income.interface';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrls.incomes}/incomes`; // URL base del microservicio de ingresos

  // 🔹 GET: Listar todos los ingresos
  getIngresos(): Observable<income[]> {
    return this.http.get<income[]>(this.apiUrl);
  }

  // 🔹 POST: Crear un nuevo ingreso
  createIngreso(ingreso: income): Observable<income> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<income>(this.apiUrl, ingreso, { headers });
  }

  // 🔹 PUT: Actualizar un ingreso existente
  updateIngreso(id: number, ingreso: income): Observable<income> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<income>(`${this.apiUrl}/${id}`, ingreso, { headers });
  }

  // 🔹 DELETE: Eliminar un ingreso por ID
  deleteIngreso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
