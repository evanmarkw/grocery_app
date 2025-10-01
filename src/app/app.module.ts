import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

// PrimeNG Components (v19 is hybrid - some use NgModules, some are standalone)
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { Menubar } from 'primeng/menubar';
import { Avatar } from 'primeng/avatar';
import { Card } from 'primeng/card';
import { Password } from 'primeng/password';
import { Message } from 'primeng/message';
import { Divider } from 'primeng/divider';
import { Panel } from 'primeng/panel';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Image } from 'primeng/image';
import { Chip } from 'primeng/chip';
import { TabView, TabPanel } from 'primeng/tabview';
import { Timeline } from 'primeng/timeline';
import { Fieldset } from 'primeng/fieldset';

// Components
import { AppComponent } from './app.component';
import { StoreManagementComponent } from './components/store-management/store-management.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

@NgModule({
  declarations: [
    AppComponent,
    StoreManagementComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ProductGridComponent,
    ManagerDashboardComponent,
    ProductManagementComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    Toolbar,
    Button,
    TableModule,
    Tag,
    Dialog,
    InputText,
    InputTextarea,
    DropdownModule,
    CheckboxModule,
    Menubar,
    Avatar,
    Card,
    Password,
    Message,
    Divider,
    Panel,
    ProgressSpinner,
    Image,
    Chip,
    TabView,
    TabPanel,
    Timeline,
    Fieldset
  ],
  providers: [
    provideHttpClient(withFetch()),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
