import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ManagerGuard } from './guards/manager.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'manager',
    canActivate: [ManagerGuard],
    children: [
      { path: 'dashboard', component: ManagerDashboardComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'stores', component: StoreManagementComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: 'users', component: UserManagementComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
