import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';
import { ManagerGuard } from './guards/manager.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
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
  { path: '**', redirectTo: '' }
];
