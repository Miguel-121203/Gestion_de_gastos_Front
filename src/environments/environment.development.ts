// Environment configuration for DEV
export const environment = {
  production: false,
  envName: 'dev',
  apiUrls: {
    expenses: 'http://localhost:8082/api/v1',
    incomes: 'http://localhost:8102/api/v1',
    categories: 'http://localhost:8112/api/v1',
    auth: 'http://localhost:8202/api/v1/auth'
  }
};
