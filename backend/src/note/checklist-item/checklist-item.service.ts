import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistItem } from './model/checklist-item.model';
import { CreateChecklistItemDto, UpdateChecklistItemDto } from './dto/checklist-item.dto';

@Injectable()
export class ChecklistItemService {
    constructor(
        @InjectRepository(ChecklistItem)
        private readonly checklistItemRepository: Repository<ChecklistItem>,
    ) {}

    async getByNoteId(noteId: number): Promise<ChecklistItem[]> {
        return await this.checklistItemRepository.find({
            where: { note_id: noteId },
            order: { position: 'ASC' },
        });
    }

    async save(itemDto: CreateChecklistItemDto): Promise<ChecklistItem> {
        const item = this.checklistItemRepository.create(itemDto);
        return await this.checklistItemRepository.save(item);
    }

    async update(id: number, itemDto: UpdateChecklistItemDto): Promise<ChecklistItem | null> {
        await this.checklistItemRepository.update(id, itemDto);
        return await this.checklistItemRepository.findOne({ where: { id } });
    }

    async toggleCheck(id: number): Promise<ChecklistItem | null> {
        const item = await this.checklistItemRepository.findOne({ where: { id } });
        if (item) {
            item.is_checked = !item.is_checked;
            return await this.checklistItemRepository.save(item);
        }
        return null;
    }

    async delete(id: number): Promise<void> {
        await this.checklistItemRepository.delete(id);
    }

    async deleteByNoteId(noteId: number): Promise<void> {
        await this.checklistItemRepository.delete({ note_id: noteId });
    }
}
