import { Component, OnInit } from '@angular/core';
import { User, UserRole } from '../../models/user.interface';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  currentUser: User | null = null;
  loading = false;
  searchTerm = '';
  selectedRoleFilter: string | null = null;

  // Dialog states
  showRoleDialog = false;
  showDeleteDialog = false;
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  newRole: UserRole | null = null;

  // Role options for dropdown
  roleOptions = [
    { label: 'Customer', value: UserRole.CUSTOMER },
    { label: 'Store Manager', value: UserRole.STORE_MANAGER },
    { label: 'Admin', value: UserRole.ADMIN }
  ];

  roleFilterOptions = [
    { label: 'All Roles', value: null },
    { label: 'Customers', value: UserRole.CUSTOMER },
    { label: 'Store Managers', value: UserRole.STORE_MANAGER },
    { label: 'Admins', value: UserRole.ADMIN }
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        console.error('Error loading users:', error);
      }
    });
  }

  filterUsers() {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phoneNumber && user.phoneNumber.includes(searchLower))
      );
    }

    // Apply role filter
    if (this.selectedRoleFilter) {
      filtered = filtered.filter(user => user.role === this.selectedRoleFilter);
    }

    this.filteredUsers = filtered;
  }

  editUserRole(user: User) {
    this.selectedUser = user;
    this.newRole = user.role;
    this.showRoleDialog = true;
  }

  updateRole() {
    if (!this.selectedUser || !this.newRole) return;

    this.userService.updateUserRole(this.selectedUser.id, this.newRole).subscribe({
      next: (updatedUser) => {
        // Update the user in the local array
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index > -1) {
          this.users[index] = updatedUser;
          this.filterUsers();
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User role updated to ${this.getRoleDisplay(this.newRole!)}`
        });

        this.showRoleDialog = false;
        this.selectedUser = null;
        this.newRole = null;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user role'
        });
        console.error('Error updating role:', error);
      }
    });
  }

  toggleUserStatus(user: User) {
    const newStatus = !user.active;
    this.userService.toggleUserStatus(user.id, newStatus).subscribe({
      next: (updatedUser) => {
        // Update the user in the local array
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index > -1) {
          this.users[index] = updatedUser;
          this.filterUsers();
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${newStatus ? 'activated' : 'deactivated'} successfully`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user status'
        });
        console.error('Error updating status:', error);
      }
    });
  }

  confirmDelete(user: User) {
    this.userToDelete = user;
    this.showDeleteDialog = true;
  }

  deleteUser() {
    if (!this.userToDelete) return;

    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        // Remove the user from the local array
        this.users = this.users.filter(u => u.id !== this.userToDelete!.id);
        this.filterUsers();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully'
        });

        this.showDeleteDialog = false;
        this.userToDelete = null;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete user'
        });
        console.error('Error deleting user:', error);
      }
    });
  }

  getUserInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getRoleDisplay(role: string): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.STORE_MANAGER:
        return 'Store Manager';
      case UserRole.CUSTOMER:
        return 'Customer';
      default:
        return role;
    }
  }

  getRoleSeverity(role: string): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'danger';
      case UserRole.STORE_MANAGER:
        return 'warning';
      case UserRole.CUSTOMER:
        return 'info';
      default:
        return 'secondary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}