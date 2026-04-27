import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `<p>Processando inicio de sesión de Google...</p>`,
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // Escutamos la url buscando parámetros ?token=....
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // Logueamos al usuario (guarda el token y lo empuja al inicio)
        this.auth.loginWithToken(token);
      } else {
        // Falló el logueo, devolver a login
        this.router.navigate(['/login']);
      }
    });
  }
}