import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GastoResponse, Gasto } from '../interface/gasto.interface';

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrls.expenses}/expenses`; // Base URL

  // 🔹 GET: Listar todos los gastos
  getGastos(): Observable<GastoResponse[]> {
    return this.http.get<GastoResponse[]>(this.apiUrl);
  }

  // 🔹 POST: Crear un nuevo gasto
  createGasto(gasto: Gasto): Observable<Gasto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Gasto>(this.apiUrl, gasto, { headers });
  }

  // 🔹 PUT: Actualizar un gasto existente
  updateGasto(id: number, gasto: Gasto): Observable<Gasto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, gasto, { headers });
  }

  // 🔹 DELETE: Eliminar un gasto por ID
  deleteGasto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

