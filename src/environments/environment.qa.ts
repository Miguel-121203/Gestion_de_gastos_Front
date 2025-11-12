// Environment configuration for QA
// Usa rutas relativas - Nginx actúa como proxy
export const environment = {
  production: false,
  envName: 'qa',
  apiUrls: {
    expenses: '/api/v1',
    incomes: '/api/v1',
    categories: '/api/v1',
    auth: '/api/v1/auth'
  }
};
