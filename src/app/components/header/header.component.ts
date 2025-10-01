import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  adminMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.updateAdminMenu();
    });
  }

  updateAdminMenu() {
    if (this.isAdmin() || this.isManager()) {
      this.adminMenuItems = [
        {
          label: 'Management',
          icon: 'pi pi-cog',
          items: [
            {
              label: 'Products',
              icon: 'pi pi-box',
              command: () => this.router.navigate(['/manager/products']),
              visible: this.isManager() || this.isAdmin()
            },
            {
              label: 'Stores',
              icon: 'pi pi-building',
              command: () => this.router.navigate(['/manager/stores']),
              visible: this.isManager() || this.isAdmin()
            },
            {
              label: 'Users',
              icon: 'pi pi-users',
              command: () => this.router.navigate(['/admin/users']),
              visible: this.isAdmin()
            },
            {
              separator: true
            },
            {
              label: 'Dashboard',
              icon: 'pi pi-home',
              command: () => this.router.navigate(['/manager/dashboard']),
              visible: this.isManager() || this.isAdmin()
            }
          ]
        }
      ];
    } else {
      this.adminMenuItems = [];
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isManager(): boolean {
    return this.authService.isStoreManager();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUserInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    return '';
  }

  getUserName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return '';
  }
}
