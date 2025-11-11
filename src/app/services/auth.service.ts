import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfo,
  ValidateTokenResponse
} from '../interface/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Base URL del microservicio de usuarios
  private readonly API_URL = environment.apiUrls.auth;

  // BehaviorSubject para mantener el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // BehaviorSubject para mantener información del usuario
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Validar token al iniciar el servicio (comentado temporalmente)
    // Si el backend no tiene endpoint /validate, esto causará logout automático
    // if (this.hasToken()) {
    //   this.validateToken().subscribe();
    // }
    console.log('🔐 AuthService inicializado. Token presente:', this.hasToken());
  }

  // ============================
  // LOGIN
  // ============================
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  // ============================
  // REGISTER
  // ============================
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        console.error('Error en registro:', error);
        throw error;
      })
    );
  }

  // ============================
  // VALIDATE TOKEN
  // ============================
  validateToken(): Observable<ValidateTokenResponse> {
    const token = this.getToken();
    if (!token) {
      return of({ valid: false });
    }

    return this.http.post<ValidateTokenResponse>(
      `${this.API_URL}/validate`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      tap(response => {
        if (!response.valid) {
          this.logout();
        }
      }),
      catchError(error => {
        console.error('Error validando token:', error);
        this.logout();
        return of({ valid: false });
      })
    );
  }

  // ============================
  // LOGOUT
  // ============================
  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');

    // Actualizar subjects
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);

    console.log('🔓 Sesión cerrada - localStorage limpiado');

    // Redirigir al login
    this.router.navigate(['/login']);
  }

  // ============================
  // HELPER METHODS
  // ============================
  private handleAuthSuccess(response: LoginResponse | RegisterResponse): void {
    // Guardar token, tokenType y userId
    localStorage.setItem('token', response.token);
    localStorage.setItem('tokenType', response.tokenType);
    localStorage.setItem('userId', response.user.userId.toString());

    // Crear UserInfo simplificado con los datos del usuario
    const userInfo: UserInfo = {
      userId: response.user.userId,
      email: response.user.email,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      fullName: response.user.fullName,
      role: response.user.role
    };

    // Guardar información del usuario en localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // Actualizar el BehaviorSubject con la información del usuario
    this.currentUserSubject.next(userInfo);

    // Actualizar estado de autenticación
    this.isAuthenticatedSubject.next(true);

    console.log('✅ Login exitoso - Token guardado:', response.token.substring(0, 20) + '...');
    console.log('✅ Usuario:', userInfo.fullName);

    // Redirigir al dashboard
    this.router.navigate(['/dashboard']);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getUserFromStorage(): UserInfo | null {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        return JSON.parse(userInfoStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // ============================
  // PUBLIC GETTERS
  // ============================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const hasToken = this.hasToken();

    console.log('🔍 isLoggedIn check:', {
      hasToken,
      isAuthenticatedSubject: this.isAuthenticatedSubject.value,
      token: hasToken ? this.getToken()?.substring(0, 20) + '...' : 'No token'
    });

    // Si hay token en localStorage, el usuario está autenticado
    // (El BehaviorSubject se sincronizará eventualmente)
    return hasToken;
  }
}
