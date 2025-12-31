import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../../models/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = true;
  displayDialog = false;
  selectedUser: User | null = null;
  isEditMode = false;

  userForm: User = this.getEmptyUser();

  roleOptions = [
    { label: 'Customer', value: UserRole.CUSTOMER },
    { label: 'Store Manager', value: UserRole.STORE_MANAGER },
    { label: 'Admin', value: UserRole.ADMIN }
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  showAddDialog() {
    this.isEditMode = false;
    this.userForm = this.getEmptyUser();
    this.displayDialog = true;
  }

  showEditDialog(user: User) {
    this.isEditMode = true;
    this.userForm = { ...user };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.userForm = this.getEmptyUser();
  }

  saveUser() {
    if (this.isEditMode && this.userForm.id) {
      this.userService.updateUser(this.userForm.id, this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    } else {
      this.userService.createUser(this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }

  deleteUser(user: User) {
    if (user.id && confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/manager/dashboard']);
  }

  getRoleSeverity(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'danger';
      case UserRole.STORE_MANAGER:
        return 'warning';
      case UserRole.CUSTOMER:
        return 'info';
      default:
        return 'info';
    }
  }

  private getEmptyUser(): User {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: UserRole.CUSTOMER,
      active: true,
      notificationsEnabled: true
    };
  }
}
