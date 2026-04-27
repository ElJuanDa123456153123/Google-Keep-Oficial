import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { AuthCallbackComponent } from './shared/components/auth-callback/auth-callback.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'auth/callback',
        component: AuthCallbackComponent
    },
    // The main board doesn't have a specific routed component right now
    // because it relies on app.ts embedding everything directly.
    // So the empty route logic will be handled by *ngIf in app.html
];
