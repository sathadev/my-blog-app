import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  const authRequest = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authToken)
  });
  return next(authRequest);
};