// auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { SignupDto } from './dto/SignupDto';
import { LoginDto } from './dto/LoginDto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  // -------------------------------
  // 🟢 REGISTER SIMPLE
  // -------------------------------
  async register(signupData: SignupDto): Promise<User> {
    const { email, password,} =
      signupData;

    // Vérification doublons
    if (await this.userRepository.findOne({ where: { email } })) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    // Hash du mot de passe
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = this.userRepository.create({
      
      email,
     
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashedPassword,
     
    });

    return this.userRepository.save(newUser);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Identifiants invalides.');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Identifiants invalides.');

    const payload = { sub: user.id, username: `${user.email} ` };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    return { access_token };
  }
}
