import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto, LoginDto } from "./dto/user.dto";

@Controller("user")
export class UserController {
    constructor(
        private readonly service: UserService
    ) {}

    @Get('getall')
    getAll() {
        return this.service.getAll();
    }

    @Get('getbyid/:id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.service.getById(id);
    }

    @Get('by-email/:email')
    getByEmail(@Param('email') email: string) {
        return this.service.getByEmail(email);
    }

    @Post('register')
    async register(@Body() data: CreateUserDto) {
        return await this.service.create(data);
    }

    @Post('login')
    async login(@Body() data: LoginDto) {
        return await this.service.validateLogin(data);
    }

    @Put('update/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
        return await this.service.update(id, data);
    }

    @Delete('delete/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
