import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { CardsModule } from '../cards/cards.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { GoogleStrategy } from './google.strategy';

@Module({
  providers: [AuthService,GoogleStrategy],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CardsModule),
    forwardRef(() => TransactionsModule),

    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
