// Environment configuration for DEV
// Usa proxy para evitar problemas de CORS en desarrollo
export const environment = {
  production: false,
  envName: 'dev',
  apiUrls: {
    expenses: '/api/v1',
    incomes: '/api/v1',
    categories: '/api/v1',
    auth: '/api/v1/auth'
  }
};
