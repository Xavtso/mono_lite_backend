import * as tedious from 'tedious';

export const productionDB = {
  dialect: 'mssql',
  dialectModule: tedious,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 1433,
  database: process.env.DB,
  dialectOptions: {
    driver: {
      version: 'ODBC Driver 18 for SQL Server',
    },
    options: {
      encrypt: true,
      authentication: {
        type: 'azure-active-directory-msi-app-service',
      },
    },
    encrypt: true,
    trustServerCertificate: false,
  },
};
export const devDB = {
  dialect: 'postgres',
  host: 'localhost',
  database: 'mono_db',
  username: 'postgres',
  password: 'vh2004r44',
  port: 5432,
};
