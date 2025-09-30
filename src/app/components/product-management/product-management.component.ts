import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendProduct } from '../../models/backend-product.interface';
import { BackendProductService } from '../../services/backend-product.service';

@Component({
  selector: 'app-product-management',
  standalone: false,
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})
export class ProductManagementComponent implements OnInit {
  products: BackendProduct[] = [];
  loading = true;
  displayDialog = false;
  selectedProduct: BackendProduct | null = null;
  isEditMode = false;

  productForm: BackendProduct = this.getEmptyProduct();

  constructor(
    private productService: BackendProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  showAddDialog() {
    this.isEditMode = false;
    this.productForm = this.getEmptyProduct();
    this.displayDialog = true;
  }

  showEditDialog(product: BackendProduct) {
    this.isEditMode = true;
    this.productForm = { ...product };
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.productForm = this.getEmptyProduct();
  }

  saveProduct() {
    if (this.isEditMode && this.productForm.id) {
      this.productService.updateProduct(this.productForm.id, this.productForm).subscribe({
        next: () => {
          this.loadProducts();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    } else {
      this.productService.createProduct(this.productForm).subscribe({
        next: () => {
          this.loadProducts();
          this.hideDialog();
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    }
  }

  deleteProduct(product: BackendProduct) {
    if (product.id && confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/manager/dashboard']);
  }

  private getEmptyProduct(): BackendProduct {
    return {
      name: '',
      sku: '',
      price: 0,
      quantity: 0,
      active: true
    };
  }
}
