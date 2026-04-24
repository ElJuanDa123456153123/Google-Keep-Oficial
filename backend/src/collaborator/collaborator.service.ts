import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collaborator } from './model/collaborator.model';
import { AddCollaboratorDto } from './dto/collaborator.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CollaboratorService {
    constructor(
        @InjectRepository(Collaborator)
        private readonly collaboratorRepository: Repository<Collaborator>,
        private readonly userService: UserService,
    ) {}

    async getByNoteId(noteId: number): Promise<any[]> {
        const collaborators = await this.collaboratorRepository.find({
            where: { note_id: noteId },
        });

        const result = [];
        for (const collab of collaborators) {
            const user = await this.userService.getById(collab.user_id);
            if (user) {
                result.push({
                    ...collab,
                    user,
                });
            }
        }

        return result;
    }

    async getByUserId(userId: number): Promise<Collaborator[]> {
        return await this.collaboratorRepository.find({
            where: { user_id: userId },
        });
    }

    async addCollaborator(dto: AddCollaboratorDto): Promise<Collaborator> {
        const collaborator = this.collaboratorRepository.create(dto);
        return await this.collaboratorRepository.save(collaborator);
    }

    async updatePermission(id: number, permission: 'edit' | 'view'): Promise<Collaborator | null> {
        await this.collaboratorRepository.update(id, { permission });
        return await this.collaboratorRepository.findOne({ where: { id } });
    }

    async removeCollaborator(noteId: number, userId: number): Promise<void> {
        await this.collaboratorRepository.delete({
            note_id: noteId,
            user_id: userId,
        });
    }

    async delete(id: number): Promise<void> {
        await this.collaboratorRepository.delete(id);
    }
}
