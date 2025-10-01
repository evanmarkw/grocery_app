import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user.interface';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = '168 Asian Mart';
  currentUser: User | null = null;
  userMenuItems: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to current user changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.updateUserMenu();
    });
  }

  updateUserMenu() {
    this.userMenuItems = [];

    if (this.currentUser) {
      // Add profile item for all users
      this.userMenuItems.push({
        label: 'My Profile',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile'])
      });

      // Add manager items if user is store manager or admin
      if (this.authService.isStoreManager()) {
        this.userMenuItems.push(
          { separator: true },
          {
            label: 'Manage Products',
            icon: 'pi pi-box',
            command: () => this.router.navigate(['/manager/products'])
          },
          {
            label: 'Manage Stores',
            icon: 'pi pi-building',
            command: () => this.router.navigate(['/manager/stores'])
          },
          {
            label: 'Dashboard',
            icon: 'pi pi-chart-bar',
            command: () => this.router.navigate(['/manager/dashboard'])
          }
        );
      }

      // Add admin items if user is admin
      if (this.authService.isAdmin()) {
        this.userMenuItems.push(
          { separator: true },
          {
            label: 'Manage Users',
            icon: 'pi pi-users',
            command: () => this.router.navigate(['/admin/users'])
          }
        );
      }

      // Add logout item
      this.userMenuItems.push(
        { separator: true },
        {
          label: 'Sign Out',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        }
      );
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return '';
  }

  getUserInitials(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    return '';
  }
}
