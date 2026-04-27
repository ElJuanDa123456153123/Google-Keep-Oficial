import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './model/user.model';
import { CreateUserDto, UpdateUserDto, LoginDto } from './dto/user.dto';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getAll(): Promise<UserWithoutPassword[]> {
        const users = await this.userRepository.find();
        return users.map(user => this.excludePassword(user));
    }

    async getById(id: number): Promise<UserWithoutPassword | null> {
        const user = await this.userRepository.findOne({ where: { id } });
        return user ? this.excludePassword(user) : null;
    }

    async getByEmail(email: string): Promise<UserWithoutPassword | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        return user ? this.excludePassword(user) : null;
    }

    async getByEmailWithPassword(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async create(userDto: CreateUserDto): Promise<UserWithoutPassword> {
        const existingUser = await this.getByEmailWithPassword(userDto.email);
        if (existingUser) {
            throw new BadRequestException('El correo ya está registrado');
        }

        let hashedPassword = '';
        if (userDto.password) {
            hashedPassword = await bcrypt.hash(userDto.password, 10);
        }
        
        const user = this.userRepository.create({
            ...userDto,
            password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(user);
        return this.excludePassword(savedUser);
    }

    async update(id: number, userDto: UpdateUserDto): Promise<UserWithoutPassword | null> {
        await this.userRepository.update(id, userDto);
        return await this.getById(id);
    }

    async findOrCreateGoogleUser(profile: any): Promise<User> {
        const { id, emails, displayName, photos } = profile;
        const email = emails[0].value;
        const avatarUrl = photos && photos.length > 0 ? photos[0].value : null;

        let user = await this.userRepository.findOne({ where: { email } });

        if (user) {
            // Update existing user with google_id and avatar if missing
            let updated = false;
            if (!user.google_id) { user.google_id = id; updated = true; }
            if (!user.avatar_url && avatarUrl) { user.avatar_url = avatarUrl; updated = true; }
            if (updated) await this.userRepository.save(user);
        } else {
            user = this.userRepository.create({
                email,
                name: displayName,
                google_id: id,
                avatar_url: avatarUrl,
                password: '', // Leave empty because it's OAuth
            });
            await this.userRepository.save(user);
        }

        return user;
    }

    async delete(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async validateLogin(loginDto: LoginDto): Promise<UserWithoutPassword> {
        const user = await this.getByEmailWithPassword(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.excludePassword(user);
    }

    private excludePassword(user: User): UserWithoutPassword {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
