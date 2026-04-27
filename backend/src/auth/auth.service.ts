import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginDto } from '../user/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    // ---- LOGIN CON GOOGLE ----
    async googleLogin(req: any) {
        if (!req.user) {
            return 'No user from google';
        }
        
        const user = await this.userService.findOrCreateGoogleUser(req.user);
        return this.generateJwt(user);
    }

    // ---- REGISTRO NORMAL (CORREO / CONTRASEÑA) ----
    async register(userDto: CreateUserDto) {
        // El user.service.ts ya se encarga de encriptar(hash) la contraseña
        const user = await this.userService.create(userDto);
        return this.generateJwt(user);
    }

    // ---- LOGIN NORMAL (CORREO / CONTRASEÑA) ----
    async login(loginDto: LoginDto) {
        // Necesitamos el usuario con la contraseña para poder compararla
        const user = await this.userService.getByEmailWithPassword(loginDto.email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Credenciales inválidas o el usuario usa Google OAuth');
        }

        // Comparamos contraseñas
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return this.generateJwt(user);
    }

    // Función auxiliar para generar el Token JWT
    private generateJwt(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar_url,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: payload,
        };
    }
}