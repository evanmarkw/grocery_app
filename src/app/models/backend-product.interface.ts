export interface BackendProduct {
  id?: number;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  active: boolean;
  brand?: string;
  category?: string;
  subCategory?: string;
  otherNames?: string[];
  weight?: number;
  weightUnit?: string;
  volume?: number;
  volumeUnit?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendStore {
  id?: number;
  code: string;
  name: string;
  description?: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  status: StoreStatus;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
  openingHours?: string;
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',
  PERMANENTLY_CLOSED = 'PERMANENTLY_CLOSED'
}
