export interface CategoriaRequest {
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface CategoriaAPI {
  categoryId: number;  // ❌ Era 'id', ahora es 'categoryId'
  name: string;
  description: string | null;  // ✅ Agregar
  type: 'INCOME' | 'EXPENSE';
  active: boolean;  // ✅ Agregar
  createdAt: string;
  updatedAt: string;
}

export interface CategoriaUpdateRequest {
  name?: string;
  type?: 'INCOME' | 'EXPENSE';
}
