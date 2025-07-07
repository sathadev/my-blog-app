import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuth = authService.getIsAuth();
  if (!isAuth) {
    router.navigate(['/login']);
  }
  return isAuth;
};