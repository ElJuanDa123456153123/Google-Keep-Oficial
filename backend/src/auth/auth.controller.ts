import { Body, Controller, Get, Post, Req, Res, UseGuards, InternalServerErrorException, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, LoginDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    // ---- RUTAS PARA LOGIN NORMAL ----
    @Post('register')
    async register(@Body() userDto: CreateUserDto) {
        try {
            return await this.authService.register(userDto);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message || error);
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // ---- RUTAS PARA GOOGLE OAUTH ----
    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Req() req: any) {
        // Guard triggers Google OAuth redirect automatically
    }

    // Google nos redirecciona aquí después de aceptar los permisos
    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req: any, @Res() res: any) {
        const loginData: any = await this.authService.googleLogin(req);
        
        // Obtenemos la URL de frontend
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:4200';
        
        // Redirigimos al frontend pasándole el JWT en la URL u otros medios.
        // Mejor práctica: redirigir a una página limpia que atrape el token.
        // Ojo: Enviarlo en la querystring en producción requiere HTTPS!
        return res.redirect(`${frontendUrl}/auth/callback?token=${loginData.access_token}`);
    }
}