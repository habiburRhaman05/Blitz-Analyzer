export interface CreditPackage {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  credits: number;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}