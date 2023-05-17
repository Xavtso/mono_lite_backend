import { createUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(userDto: createUserDto): Promise<{
        token: string;
    }>;
    signUp(userDto: createUserDto): Promise<{
        token: string;
    }>;
    refreshed(userDto: createUserDto): Promise<{
        token: string;
    }>;
}
