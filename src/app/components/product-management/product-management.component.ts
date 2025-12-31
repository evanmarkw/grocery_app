import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendProduct } from '../../models/backend-product.interface';
import { BackendProductService } from '../../services/backend-product.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-product-management',
  standalone: false,
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  products: BackendProduct[] = [];
  loading = true;
  displayDialog = false;
  selectedProduct: BackendProduct | null = null;
  isEditMode = false;
  selectedFile: File | null = null;
  uploadingImage = false;

  productForm: BackendProduct = this.getEmptyProduct();

  constructor(
    private productService: BackendProductService,
    private fileUploadService: FileUploadService,
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveProduct() {
    // If there's a file to upload, upload it first
    if (this.selectedFile) {
      this.uploadingImage = true;
      this.fileUploadService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          this.productForm.imageUrl = response.imageUrl;
          this.uploadingImage = false;
          this.selectedFile = null;
          this.saveProductData();
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.uploadingImage = false;
        }
      });
    } else {
      this.saveProductData();
    }
  }

  private saveProductData() {
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
