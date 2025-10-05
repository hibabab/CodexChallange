import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/SignupDto';
import { LoginDto } from './dto/LoginDto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // -------------------------------
  // 🟢 REGISTER
  // -------------------------------
  @Post('register')
  async register(@Body() signupData: SignupDto): Promise<User> {
    return this.authService.register(signupData);
  }

  // -------------------------------
  // 🔵 LOGIN
  // -------------------------------
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto);
  }
}
