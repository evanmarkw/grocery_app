import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Aisle } from '../../models/aisle.interface';
import { AisleService } from '../../services/aisle.service';
import { BackendStoreService } from '../../services/backend-store.service';
import { BackendStore } from '../../models/backend-product.interface';

@Component({
  selector: 'app-aisle-management',
  standalone: false,
  templateUrl: './aisle-management.component.html',
  styleUrl: './aisle-management.component.css'
})
export class AisleManagementComponent implements OnInit {
  aisles: Aisle[] = [];
  loading = false;
  displayDialog = false;
  isEditMode = false;
  stores: any[] = [];

  aisleForm: Aisle = {
    storeId: 0,
    number: '',
    name: '',
    description: '',
    sequenceOrder: 1
  };

  constructor(
    private aisleService: AisleService,
    private storeService: BackendStoreService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadAisles();
    this.loadStores();
  }

  loadAisles() {
    this.loading = true;
    this.aisleService.getAllAisles().subscribe({
      next: (data) => {
        this.aisles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading aisles:', error);
        this.loading = false;
      }
    });
  }

  loadStores() {
    this.storeService.getAllStores().subscribe({
      next: (data: BackendStore[]) => {
        this.stores = data.map((store: BackendStore) => ({
          label: store.name,
          value: store.id
        }));
      },
      error: (error: any) => {
        console.error('Error loading stores:', error);
      }
    });
  }

  showAddDialog() {
    this.isEditMode = false;
    this.aisleForm = {
      storeId: this.stores.length > 0 ? this.stores[0].value : 0,
      number: '',
      name: '',
      description: '',
      sequenceOrder: 1
    };
    this.displayDialog = true;
  }

  showEditDialog(aisle: Aisle) {
    this.isEditMode = true;
    this.aisleForm = { ...aisle };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  saveAisle() {
    if (this.isEditMode && this.aisleForm.id) {
      this.aisleService.updateAisle(this.aisleForm.id, this.aisleForm).subscribe({
        next: () => {
          this.loadAisles();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error updating aisle:', error);
        }
      });
    } else {
      this.aisleService.createAisle(this.aisleForm).subscribe({
        next: () => {
          this.loadAisles();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error creating aisle:', error);
        }
      });
    }
  }

  deleteAisle(aisle: Aisle) {
    if (confirm(`Are you sure you want to delete ${aisle.name}?`)) {
      if (aisle.id) {
        this.aisleService.deleteAisle(aisle.id).subscribe({
          next: () => {
            this.loadAisles();
          },
          error: (error) => {
            console.error('Error deleting aisle:', error);
          }
        });
      }
    }
  }

  goBack() {
    this.location.back();
  }
}
