import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Gasto } from '../models/models-module';
 // o el nombre real del archivo



@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private http = inject(HttpClient);

  // ⚙️ Aquí define la URL de tu backend
  private apiUrl = 'http://localhost:8080/api/v1/expenses';

  // 🔹 GET: Listar todos los gastos
  getGastos(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.apiUrl);
  }

  // 🔹 POST: Crear un nuevo gasto
  crearGasto(gasto: Gasto): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, gasto);
  }
}
