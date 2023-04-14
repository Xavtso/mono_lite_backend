import { Injectable,HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { createUserDto } from './dto/create-user.dto';

import { User } from './user.model';
import * as bcrypt from 'bcryptjs';
import { Card } from 'src/cards/card.model';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: createUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }
  async getUserById(user_id: number) {
    const users = await this.userRepository.findByPk(user_id);
    return users;
  }
  async getUserbyEmail(email:string){
    const user = await this.userRepository.findOne({
      where: { email },
      include: {all: true}
    })
    
    return user;
  }
  async deleteUser(dto: createUserDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    // return user;
    if (!user) {
      throw new HttpException('Пароль або емейл не вірні', HttpStatus.BAD_REQUEST);
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    console.log(dto.password);
    console.log(isValidPassword);
    if (isValidPassword) {
      console.log('password is valid');
      try {
        const cardDelete = await Card.destroy({where: {user_id: user.user_id}}) ;
        const result = await User.destroy({ where: { email: user.email } });
        if (result === 0 || cardDelete === 0) {
          throw new Error('Користувач не знайдений');
        }
        return 'Користувач успішно видалений';
      } catch (error) {
        throw new Error(`Помилка при видаленні користувача: ${error.message}`);
        
      }
    }
  }
  
}
