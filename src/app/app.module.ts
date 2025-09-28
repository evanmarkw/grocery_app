import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { routes } from './app.routes';
import { ProductGridComponent } from './components/product-grid/product-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductGridComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ButtonModule,
    ToolbarModule,
    CardModule,
    DataViewModule,
    RatingModule,
    TagModule,
    InputTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
