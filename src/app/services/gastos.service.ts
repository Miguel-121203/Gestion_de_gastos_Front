
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { GastoResponse, Gasto } from '../interface/gasto.interface';

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private http = inject(HttpClient);


  // 🔹 GET: Listar todos los gastos
getGastos(): Observable<GastoResponse[]> {
  return this.http.get<GastoResponse[]>('http://localhost:8080/api/v1/expenses');
}


createGasto( Gasto: Gasto): Observable<Gasto> {
const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
return this.http.post<Gasto>( 'http://localhost:8080/api/v1/expenses' ,Gasto,{headers});
}

}
