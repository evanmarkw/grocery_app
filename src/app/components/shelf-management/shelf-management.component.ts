import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Shelf } from '../../models/shelf.interface';
import { ShelfService } from '../../services/shelf.service';
import { AisleService } from '../../services/aisle.service';
import { BackendStoreService } from '../../services/backend-store.service';
import { BackendStore } from '../../models/backend-product.interface';

@Component({
  selector: 'app-shelf-management',
  standalone: false,
  templateUrl: './shelf-management.component.html',
  styleUrl: './shelf-management.component.css'
})
export class ShelfManagementComponent implements OnInit {
  shelves: Shelf[] = [];
  loading = false;
  displayDialog = false;
  isEditMode = false;
  stores: any[] = [];
  aisles: any[] = [];
  allAisles: any[] = [];

  shelfForm: Shelf = {
    storeId: 0,
    aisleId: 0,
    code: '',
    level: 1,
    section: 1
  };

  constructor(
    private shelfService: ShelfService,
    private aisleService: AisleService,
    private storeService: BackendStoreService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadShelves();
    this.loadStores();
    this.loadAisles();
  }

  loadShelves() {
    this.loading = true;
    this.shelfService.getAllShelves().subscribe({
      next: (data) => {
        this.shelves = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading shelves:', error);
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

  loadAisles() {
    this.aisleService.getAllAisles().subscribe({
      next: (data) => {
        this.allAisles = data;
        this.aisles = data.map(aisle => ({
          label: `${aisle.number} - ${aisle.name}`,
          value: aisle.id,
          storeId: aisle.storeId
        }));
      },
      error: (error) => {
        console.error('Error loading aisles:', error);
      }
    });
  }

  onStoreChange(storeId: number) {
    // Filter aisles by selected store
    this.aisles = this.allAisles
      .filter(aisle => aisle.storeId === storeId)
      .map(aisle => ({
        label: `${aisle.number} - ${aisle.name}`,
        value: aisle.id,
        storeId: aisle.storeId
      }));

    // Reset aisle selection if not valid for new store
    if (this.aisles.length > 0 && !this.aisles.find(a => a.value === this.shelfForm.aisleId)) {
      this.shelfForm.aisleId = this.aisles[0].value;
    }
  }

  showAddDialog() {
    this.isEditMode = false;
    this.shelfForm = {
      storeId: this.stores.length > 0 ? this.stores[0].value : 0,
      aisleId: 0,
      code: '',
      level: 1,
      section: 1
    };

    if (this.shelfForm.storeId) {
      this.onStoreChange(this.shelfForm.storeId);
      if (this.aisles.length > 0) {
        this.shelfForm.aisleId = this.aisles[0].value;
      }
    }

    this.displayDialog = true;
  }

  showEditDialog(shelf: Shelf) {
    this.isEditMode = true;
    this.shelfForm = { ...shelf };
    this.onStoreChange(shelf.storeId);
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  saveShelf() {
    if (this.isEditMode && this.shelfForm.id) {
      this.shelfService.updateShelf(this.shelfForm.id, this.shelfForm).subscribe({
        next: () => {
          this.loadShelves();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error updating shelf:', error);
        }
      });
    } else {
      this.shelfService.createShelf(this.shelfForm).subscribe({
        next: () => {
          this.loadShelves();
          this.hideDialog();
        },
        error: (error) => {
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
            this.loadShelves();
          },
          error: (error) => {
            console.error('Error deleting shelf:', error);
          }
        });
      }
    }
  }

  getStoreName(storeId: number): string {
    const store = this.stores.find(s => s.value === storeId);
    return store ? store.label : 'N/A';
  }

  getAisleName(aisleId: number): string {
    const aisle = this.allAisles.find(a => a.id === aisleId);
    return aisle ? `${aisle.number} - ${aisle.name}` : 'N/A';
  }

  goBack() {
    this.location.back();
  }
}
