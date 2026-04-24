import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollaboratorController } from './collaborator.controller';
import { CollaboratorService } from './collaborator.service';
import { Collaborator } from './model/collaborator.model';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Collaborator]), UserModule],
    controllers: [CollaboratorController],
    providers: [CollaboratorService],
    exports: [CollaboratorService],
})
export class CollaboratorModule {}
