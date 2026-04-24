import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

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
