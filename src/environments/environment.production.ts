// Environment configuration for PRODUCTION
// Usa rutas relativas - Nginx actúa como proxy
export const environment = {
  production: true,
  envName: 'production',
  apiUrls: {
    expenses: '/api/v1',
    incomes: '/api/v1',
    categories: '/api/v1',
    auth: '/api/v1/auth'
  }
};
