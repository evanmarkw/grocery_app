import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard  {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isStoreManager()) {
      return true;
    } else if (this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/']);
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}
