import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendStore, StoreStatus } from '../../models/backend-product.interface';
import { BackendStoreService } from '../../services/backend-store.service';
import { Aisle } from '../../models/aisle.interface';
import { Shelf } from '../../models/shelf.interface';
import { AisleService } from '../../services/aisle.service';
import { ShelfService } from '../../services/shelf.service';

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

  // Aisle and Shelf management
  storeAisles: Aisle[] = [];
  storeShelves: Shelf[] = [];
  displayAisleDialog = false;
  displayShelfDialog = false;
  isEditAisleMode = false;
  isEditShelfMode = false;

  aisleForm: Aisle = this.getEmptyAisle();
  shelfForm: Shelf = this.getEmptyShelf();

  constructor(
    private storeService: BackendStoreService,
    private aisleService: AisleService,
    private shelfService: ShelfService,
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

    // Load aisles and shelves for this store
    if (store.id) {
      this.loadStoreAisles(store.id);
      this.loadStoreShelves(store.id);
    }
  }

  hideDialog() {
    this.displayDialog = false;
    this.storeForm = this.getEmptyStore();
    this.storeAisles = [];
    this.storeShelves = [];
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

  private getEmptyAisle(): Aisle {
    return {
      storeId: 0,
      number: '',
      name: '',
      description: '',
      sequenceOrder: 1
    };
  }

  private getEmptyShelf(): Shelf {
    return {
      storeId: 0,
      aisleId: 0,
      code: '',
      level: 1,
      section: 1
    };
  }

  // Aisle Management
  loadStoreAisles(storeId: number) {
    this.aisleService.getAislesByStore(storeId).subscribe({
      next: (data: Aisle[]) => {
        this.storeAisles = data;
      },
      error: (error: any) => {
        console.error('Error loading aisles:', error);
      }
    });
  }

  showAddAisleDialog() {
    this.isEditAisleMode = false;
    this.aisleForm = this.getEmptyAisle();
    this.aisleForm.storeId = this.storeForm.id || 0;
    this.displayAisleDialog = true;
  }

  showEditAisleDialog(aisle: Aisle) {
    this.isEditAisleMode = true;
    this.aisleForm = { ...aisle };
    this.displayAisleDialog = true;
  }

  hideAisleDialog() {
    this.displayAisleDialog = false;
    this.aisleForm = this.getEmptyAisle();
  }

  saveAisle() {
    if (this.isEditAisleMode && this.aisleForm.id) {
      this.aisleService.updateAisle(this.aisleForm.id, this.aisleForm).subscribe({
        next: () => {
          if (this.storeForm.id) {
            this.loadStoreAisles(this.storeForm.id);
          }
          this.hideAisleDialog();
        },
        error: (error: any) => {
          console.error('Error updating aisle:', error);
        }
      });
    } else {
      this.aisleService.createAisle(this.aisleForm).subscribe({
        next: () => {
          if (this.storeForm.id) {
            this.loadStoreAisles(this.storeForm.id);
          }
          this.hideAisleDialog();
        },
        error: (error: any) => {
          console.error('Error creating aisle:', error);
        }
      });
    }
  }

  deleteAisle(aisle: Aisle) {
    if (confirm(`Are you sure you want to delete aisle ${aisle.name}?`)) {
      if (aisle.id) {
        this.aisleService.deleteAisle(aisle.id).subscribe({
          next: () => {
            if (this.storeForm.id) {
              this.loadStoreAisles(this.storeForm.id);
            }
          },
          error: (error: any) => {
            console.error('Error deleting aisle:', error);
          }
        });
      }
    }
  }

  // Shelf Management
  loadStoreShelves(storeId: number) {
    this.shelfService.getShelvesByStore(storeId).subscribe({
      next: (data: Shelf[]) => {
        this.storeShelves = data;
      },
      error: (error: any) => {
        console.error('Error loading shelves:', error);
      }
    });
  }

  showAddShelfDialog() {
    this.isEditShelfMode = false;
    this.shelfForm = this.getEmptyShelf();
    this.shelfForm.storeId = this.storeForm.id || 0;
    if (this.storeAisles.length > 0 && this.storeAisles[0].id) {
      this.shelfForm.aisleId = this.storeAisles[0].id;
    }
    this.displayShelfDialog = true;
  }

  showEditShelfDialog(shelf: Shelf) {
    this.isEditShelfMode = true;
    this.shelfForm = { ...shelf };
    this.displayShelfDialog = true;
  }

  hideShelfDialog() {
    this.displayShelfDialog = false;
    this.shelfForm = this.getEmptyShelf();
  }

  saveShelf() {
    if (this.isEditShelfMode && this.shelfForm.id) {
      this.shelfService.updateShelf(this.shelfForm.id, this.shelfForm).subscribe({
        next: () => {
          if (this.storeForm.id) {
            this.loadStoreShelves(this.storeForm.id);
          }
          this.hideShelfDialog();
        },
        error: (error: any) => {
          console.error('Error updating shelf:', error);
        }
      });
    } else {
      this.shelfService.createShelf(this.shelfForm).subscribe({
        next: () => {
          if (this.storeForm.id) {
            this.loadStoreShelves(this.storeForm.id);
          }
          this.hideShelfDialog();
        },
        error: (error: any) => {
          console.error('Error creating shelf:', error);
        }
      });
    }
  }

  deleteShelf(shelf: Shelf) {
    if (confirm(`Are you sure you want to delete shelf ${shelf.code}?`)) {
      if (shelf.id) {
        this.shelfService.deleteShelf(shelf.id).subscribe({
          next: () => {
            if (this.storeForm.id) {
              this.loadStoreShelves(this.storeForm.id);
            }
          },
          error: (error: any) => {
            console.error('Error deleting shelf:', error);
          }
        });
      }
    }
  }

  getAisleName(aisleId: number): string {
    const aisle = this.storeAisles.find(a => a.id === aisleId);
    return aisle ? `${aisle.number} - ${aisle.name}` : 'N/A';
  }
}
