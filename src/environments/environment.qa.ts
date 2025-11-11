// Environment configuration for QA
export const environment = {
  production: false,
  envName: 'qa',
  apiUrls: {
    expenses: 'http://localhost:8081/api/v1',
    incomes: 'http://localhost:8101/api/v1',
    categories: 'http://localhost:8111/api/v1',
    auth: 'http://localhost:8201/api/v1/auth'
  }
};
