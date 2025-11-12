// Environment configuration for LOCAL
// Usa proxy para evitar problemas de CORS en desarrollo
export const environment = {
  production: false,
  envName: 'local',
  apiUrls: {
    expenses: '/api/v1',
    incomes: '/api/v1',
    categories: '/api/v1',
    auth: '/api/v1/auth'
  }
};
