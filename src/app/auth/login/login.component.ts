import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interface/auth.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Modelo del formulario
  email: string = '';
  password: string = '';

  // Estados
  loading: boolean = false;
  error: string = '';
  showPassword: boolean = false;

  // Validaciones
  emailError: string = '';
  passwordError: string = '';

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // ============================
  // LOGIN HANDLER
  // ============================
  onLogin(): void {
    // Resetear errores
    this.error = '';
    this.emailError = '';
    this.passwordError = '';

    // Validar campos
    if (!this.validateForm()) {
      return;
    }

    // Preparar request
    const credentials: LoginRequest = {
      email: this.email.trim(),
      password: this.password
    };

    // Llamar al servicio
    this.loading = true;
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.loading = false;
        // El servicio se encarga de la redirección
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.loading = false;

        // Manejar errores específicos
        if (err.status === 401) {
          this.error = 'Email o contraseña incorrectos';
        } else if (err.status === 404) {
          this.error = 'Usuario no encontrado';
        } else if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 8110';
        } else {
          this.error = 'Error al iniciar sesión. Intenta nuevamente.';
        }
      }
    });
  }

  // ============================
  // VALIDACIONES
  // ============================
  validateForm(): boolean {
    let isValid = true;

    // Validar email
    if (!this.email) {
      this.emailError = 'El email es requerido';
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.emailError = 'Ingresa un email válido';
      isValid = false;
    }

    // Validar password
    if (!this.password) {
      this.passwordError = 'La contraseña es requerida';
      isValid = false;
    } else if (this.password.length < 8) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ============================
  // HELPERS
  // ============================
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.error = '';
  }

  onEmailChange(): void {
    this.emailError = '';
    this.error = '';
  }

  onPasswordChange(): void {
    this.passwordError = '';
    this.error = '';
  }

  // ============================
  // NAVEGACIÓN A REGISTRO
  // ============================
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
