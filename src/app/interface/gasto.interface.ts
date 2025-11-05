export interface CategoriaGasto {
  name: string;
  description: string | null;
  type: string;
}

export interface GastoResponse {
  expenseId: number;
  amount: number;
  expenseCategoryId: number;
  category?: CategoriaGasto;  // ✅ Agregado
  expenseDate: string;  // ✅ Cambiado de Date a string
  description: string;
  userId: number;
  active: boolean;
  createdAt: string;  // ✅ Cambiado de Date a string
  updatedAt: string;  // ✅ Cambiado de Date a string
}

export interface Gasto {
  amount: number;
  expenseCategoryId?: number;
  expenseDate: string;  // ✅ Cambiado de Date a string
  description: string;
  userId: number;
}
