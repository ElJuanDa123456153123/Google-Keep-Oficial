import { IsEmail, IsOptional, IsString, MinLength, Matches } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'El formato de correo no es válido' })
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|.*\W).+$/, { 
        message: 'La contraseña debe contener mayúsculas, minúsculas y un número/símbolo'
    })
    password?: string;

    @IsOptional()
    @IsString()
    google_id?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
