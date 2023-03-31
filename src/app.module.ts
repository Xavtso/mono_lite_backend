import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.model';
import { CardsModule } from './cards/cards.module';
import { Card } from './cards/card.model';
import * as tedious from 'tedious';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
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
      models: [User, Card],
      autoLoadModels: true,
    }),
    UsersModule,
    CardsModule,
  ],
})
export class AppModule {}
