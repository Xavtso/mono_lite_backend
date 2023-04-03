import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    login(userDto: createUserDto): Promise<{
        token: string;
    }>;
    signUp(userDto: createUserDto): Promise<{
        token: string;
    }>;
    private generateToken;
    private validateUser;
}
