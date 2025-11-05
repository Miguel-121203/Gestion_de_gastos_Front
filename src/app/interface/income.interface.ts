export interface income {
  incomeId?: number;
  amount: number;
  incomeCategoryId: number;
  incomeDate: string | Date;
  description: string;
  userId: number;
  active?: boolean;
  createdAt?: string | Date; // Si el backend lo devuelve
  updatedAt?: string | Date; // Si el backend lo devuelve
}
