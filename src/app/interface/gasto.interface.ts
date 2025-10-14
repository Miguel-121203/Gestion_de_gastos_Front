export interface GastoResponse{
  expenseId:         number;
  amount:            number;
  expenseCategoryId: number;
  expenseDate:       Date;
  description:       string;
  userId:            number;
  active:            boolean;
  createdAt:         Date;
  updatedAt:         Date;
}
export interface Gasto {
  amount:            number;
  expenseCategoryId: number;
  expenseDate:       Date;
  description:       string;
  userId:            number;
}

export interface CategoriaGasto {
  id: number;
  nombre: string;
  description?: string;
}
