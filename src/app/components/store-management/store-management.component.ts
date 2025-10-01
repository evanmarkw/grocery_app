import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendStore, StoreStatus } from '../../models/backend-product.interface';
import { BackendStoreService } from '../../services/backend-store.service';

@Component({
  selector: 'app-store-management',
  standalone: false,
  templateUrl: './store-management.component.html',
  styleUrl: './store-management.component.css'
})
export class StoreManagementComponent implements OnInit {
  stores: BackendStore[] = [];
  loading = true;
  displayDialog = false;
  selectedStore: BackendStore | null = null;
  isEditMode = false;

  storeForm: BackendStore = this.getEmptyStore();
  storeStatusOptions = Object.values(StoreStatus);

  constructor(
    private storeService: BackendStoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStores();
  }

  loadStores() {
    this.loading = true;
    this.storeService.getAllStores().subscribe({
      next: (data) => {
        this.stores = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.loading = false;
      }
    });
  }

  showAddDialog() {
    this.isEditMode = false;
    this.storeForm = this.getEmptyStore();
    this.displayDialog = true;
  }

  showEditDialog(store: BackendStore) {
    this.isEditMode = true;
    this.storeForm = { ...store };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.storeForm = this.getEmptyStore();
  }

  saveStore() {
    if (this.isEditMode && this.storeForm.id) {
      this.storeService.updateStore(this.storeForm.id, this.storeForm).subscribe({
        next: () => {
          this.loadStores();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error updating store:', error);
        }
      });
    } else {
      this.storeService.createStore(this.storeForm).subscribe({
        next: () => {
          this.loadStores();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error creating store:', error);
        }
      });
    }
  }

  deleteStore(store: BackendStore) {
    if (store.id && confirm(`Are you sure you want to delete ${store.name}?`)) {
      this.storeService.deleteStore(store.id).subscribe({
        next: () => {
          this.loadStores();
        },
        error: (error) => {
          console.error('Error deleting store:', error);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/manager/dashboard']);
  }

  getStatusSeverity(status: StoreStatus): string {
    switch (status) {
      case StoreStatus.ACTIVE:
        return 'success';
      case StoreStatus.INACTIVE:
        return 'warning';
      case StoreStatus.TEMPORARILY_CLOSED:
        return 'info';
      case StoreStatus.PERMANENTLY_CLOSED:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  private getEmptyStore(): BackendStore {
    return {
      code: '',
      name: '',
      address: '',
      status: StoreStatus.ACTIVE,
      deliveryEnabled: false,
      pickupEnabled: true
    };
  }
}
