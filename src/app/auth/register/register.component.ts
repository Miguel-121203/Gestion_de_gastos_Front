import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interface/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Modelo del formulario
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';

  // Estados
  loading: boolean = false;
  error: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Validaciones
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  firstNameError: string = '';
  lastNameError: string = '';

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // ============================
  // REGISTER HANDLER
  // ============================
  onRegister(): void {
    // Resetear errores
    this.error = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.firstNameError = '';
    this.lastNameError = '';

    // Validar campos
    if (!this.validateForm()) {
      return;
    }

    // Preparar request
    const userData: RegisterRequest = {
      email: this.email.trim(),
      password: this.password,
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim()
    };

    // Llamar al servicio
    this.loading = true;
    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.loading = false;
        // El servicio se encarga de la redirección al dashboard
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.loading = false;

        // Manejar errores específicos
        if (err.status === 400) {
          this.error = err.error?.message || 'Datos inválidos. Verifica los campos.';
        } else if (err.status === 409) {
          this.error = 'El email ya está registrado';
        } else if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 8202';
        } else {
          this.error = 'Error al registrar usuario. Intenta nuevamente.';
        }
      }
    });
  }

  // ============================
  // VALIDACIONES
  // ============================
  validateForm(): boolean {
    let isValid = true;

    // Validar firstName
    if (!this.firstName.trim()) {
      this.firstNameError = 'El nombre es requerido';
      isValid = false;
    } else if (this.firstName.trim().length < 2) {
      this.firstNameError = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validar lastName
    if (!this.lastName.trim()) {
      this.lastNameError = 'El apellido es requerido';
      isValid = false;
    } else if (this.lastName.trim().length < 2) {
      this.lastNameError = 'El apellido debe tener al menos 2 caracteres';
      isValid = false;
    }

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

    // Validar confirmPassword
    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Confirma tu contraseña';
      isValid = false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Las contraseñas no coinciden';
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

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
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
    this.confirmPasswordError = '';
    this.error = '';
  }

  onConfirmPasswordChange(): void {
    this.confirmPasswordError = '';
    this.error = '';
  }

  onFirstNameChange(): void {
    this.firstNameError = '';
    this.error = '';
  }

  onLastNameChange(): void {
    this.lastNameError = '';
    this.error = '';
  }

  // ============================
  // NAVEGACIÓN A LOGIN
  // ============================
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
