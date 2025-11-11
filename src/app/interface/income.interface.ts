export interface CategoriaIngreso {
  name: string;
  description: string | null;
  type: string;
}

export interface IncomeResponse {
  incomeId: number;
  amount: number;
  incomeCategoryId: number;
  category?: CategoriaIngreso;
  incomeDate: string;
  description: string;
  userId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface income {
  incomeId?: number;
  amount: number;
  incomeCategoryId: number;
  incomeDate: string | Date;
  description: string;
  userId: number;
  active?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
