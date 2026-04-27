import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-container">
          <img src="assets/keep-logo.png" alt="Google Keep Logo" class="logo" onerror="this.src='https://www.gstatic.com/images/branding/product/1x/keep_48dp.png'" />
          <h1>Google Keep</h1>
        </div>
        <h2>{{ isRegistering ? 'Crear una cuenta' : 'Inicia sesión' }}</h2>
        <p>{{ isRegistering ? 'Regístrate para usar Google Keep Clon' : 'Usa tu cuenta para continuar a Google Keep Clon' }}</p>

        <form (ngSubmit)="onSubmit()" #authForm="ngForm" class="auth-form">
          <div class="form-group" *ngIf="isRegistering">
            <input type="text" placeholder="Nombre completo" name="name" [(ngModel)]="name" required class="form-control" />
          </div>
          <div class="form-group">
            <input type="email" placeholder="Correo electrónico" name="email" [(ngModel)]="email" required class="form-control" />
          </div>
          <div class="form-group password-group">
            <input [type]="showPassword ? 'text' : 'password'" placeholder="Contraseña" name="password" [(ngModel)]="password" required class="form-control" />
            <button type="button" class="toggle-password" (click)="togglePasswordVisibility()">
              <i [class]="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          
        <div class="error-message" *ngIf="errorMessage" [innerHTML]="errorMessage"></div>

          <button type="submit" class="submit-btn" [disabled]="!authForm.form.valid || isLoading">
            {{ isLoading ? 'Cargando...' : (isRegistering ? 'Registrarse' : 'Iniciar sesión') }}
          </button>
        </form>

        <div class="divider"><span>o</span></div>
        
        <button class="google-btn" (click)="loginWithGoogle()" [disabled]="isLoading">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" />
          <span>Continuar con Google</span>
        </button>

        <div class="toggle-mode">
          <p>
            {{ isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?' }}
            <a href="javascript:void(0)" (click)="toggleMode()">
              {{ isRegistering ? 'Inicia sesión' : 'Regístrate' }}
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 100vw;
      background-color: #f0f2f5;
    }
    .login-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    .logo { height: 48px; }
    h1 { font-size: 24px; color: #5f6368; margin: 0; font-weight: 500; }
    h2 { margin-top: 0; font-weight: 400; color: #202124; }
    p { color: #5f6368; margin-bottom: 20px; line-height: 1.5; font-size: 14px; }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;
    }
    .form-control {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #dadce0;
      border-radius: 4px;
      font-size: 16px;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .form-control:focus {
      border-color: #1a73e8;
      border-width: 2px;
      padding: 11px 13px; /* Compensate for border width */
    }
    
    .password-group {
      position: relative;
      display: flex;
      align-items: center;
    }
    .toggle-password {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;
      color: #5f6368;
      display: flex;
      padding: 5px;
    }
    .toggle-password:hover {
      color: #202124;
    }
    
    .submit-btn {
      background-color: #1a73e8;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 12px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .submit-btn:hover:not(:disabled) {
      background-color: #1557b0;
    }
    .submit-btn:disabled {
      background-color: #a8c7fa;
      cursor: not-allowed;
    }
    .error-message {
      color: #d93025;
      font-size: 13px;
      text-align: left;
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: #5f6368;
      margin-bottom: 20px;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #dadce0;
    }
    .divider span { padding: 0 10px; font-size: 12px; font-weight: 500; text-transform: uppercase; }

    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background-color: white;
      border: 1px solid #dadce0;
      border-radius: 4px;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 500;
      color: #3c4043;
      cursor: pointer;
      width: 100%;
      transition: background-color 0.2s;
    }
    .google-btn:hover:not(:disabled) { background-color: #f8f9fa; }
    .google-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .google-btn img { width: 18px; height: 18px; }

    .toggle-mode { margin-top: 25px; }
    .toggle-mode a { color: #1a73e8; text-decoration: none; font-weight: 500; }
    .toggle-mode a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  isRegistering = false;
  name = '';
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    if (this.isRegistering) {
      this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          if (Array.isArray(err.error?.message)) {
             this.errorMessage = err.error.message.join('<br>• ');
          } else {
             this.errorMessage = err.error?.message || 'Error al iniciar sesión o registrar usuario.';
          }
        }
      });
    } else {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          if (Array.isArray(err.error?.message)) {
             this.errorMessage = err.error.message.join('<br>• ');
          } else {
             this.errorMessage = err.error?.message || 'Correo o contraseña incorrectos.';
          }
        }
      });
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
