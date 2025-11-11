import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Importa las interfaces desde tu archivo de interfaces
import { CategoriaAPI, CategoriaRequest, CategoriaUpdateRequest } from '../interface/categories.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrls.categories}/categories`

  /**
   * Obtener todas las categorías
   */
  obtenerCategorias(): Observable<CategoriaAPI[]> {
    return this.http.get<CategoriaAPI[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener categoría por ID
   */
  obtenerCategoriaPorId(id: number): Observable<CategoriaAPI> {
    return this.http.get<CategoriaAPI>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener categorías por tipo (INCOME o EXPENSE)
   */
  obtenerCategoriasPorTipo(tipo: 'INCOME' | 'EXPENSE'): Observable<CategoriaAPI[]> {
    return this.http.get<CategoriaAPI[]>(`${this.apiUrl}/type/${tipo}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crear nueva categoría
   */
  crearCategoria(request: CategoriaRequest): Observable<CategoriaAPI> {
    return this.http.post<CategoriaAPI>(this.apiUrl, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar categoría existente
   */
  actualizarCategoria(id: number, request: CategoriaUpdateRequest): Observable<CategoriaAPI> {
    return this.http.put<CategoriaAPI>(`${this.apiUrl}/${id}`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar categoría
   */
  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;

      // Mensajes específicos según el código de estado
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud inválida. Verifica los datos enviados.';
          break;
        case 404:
          errorMessage = 'Categoría no encontrada.';
          break;
        case 409:
          errorMessage = 'Ya existe una categoría con ese nombre.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
          break;
      }
    }

    console.error('Error en CategoriasService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
