import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './model/note.model';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

@Injectable()
export class NoteService {
    constructor(
        @InjectRepository(Note)
        private readonly noteRepository: Repository<Note>,
    ) {}

    async getAll(): Promise<Note[]> {
        return await this.noteRepository.find({
            where: { is_deleted: false },
            order: { is_pinned: 'DESC', updated_at: 'DESC' },
        });
    }

    async getById(id: number): Promise<Note | null> {
        return await this.noteRepository.findOne({
            where: { id, is_deleted: false },
        });
    }

    async getByUserId(userId: number): Promise<Note[]> {
        return await this.noteRepository.find({
            where: { user_id: userId, is_deleted: false },
            order: { is_pinned: 'DESC', updated_at: 'DESC' },
        });
    }

    async save(noteDto: CreateNoteDto): Promise<Note> {
        const note = this.noteRepository.create(noteDto);
        return await this.noteRepository.save(note);
    }

    async update(id: number, noteDto: UpdateNoteDto): Promise<Note | null> {
        await this.noteRepository.update(id, noteDto);
        return await this.getById(id);
    }

    async delete(id: number): Promise<void> {
        await this.noteRepository.update(id, { is_deleted: true });
    }

    async togglePin(id: number): Promise<Note | null> {
        const note = await this.getById(id);
        if (note) {
            note.is_pinned = !note.is_pinned;
            return await this.noteRepository.save(note);
        }
        return null;
    }

    async archive(id: number): Promise<Note | null> {
        const note = await this.getById(id);
        if (note) {
            note.is_archived = !note.is_archived;
            return await this.noteRepository.save(note);
        }
        return null;
    }
}
