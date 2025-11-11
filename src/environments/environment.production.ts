// Environment configuration for PRODUCTION
export const environment = {
  production: true,
  envName: 'production',
  apiUrls: {
    expenses: 'http://localhost:8080/api/v1',
    incomes: 'http://localhost:8100/api/v1',
    categories: 'http://localhost:8110/api/v1',
    auth: 'http://localhost:8200/api/v1/auth'
  }
};
