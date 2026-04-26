import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChecklistItem } from './model/checklist-item.model';
import { CreateChecklistItemDto, UpdateChecklistItemDto } from './dto/checklist-item.dto';

@Injectable()
export class ChecklistItemService {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly repo: Repository<ChecklistItem>
  ) {}

  findByNote(noteId: number): Promise<ChecklistItem[]> {
    return this.repo.find({
      where: { note_id: noteId },
      order: { position: 'ASC' }
    });
  }

  create(dto: CreateChecklistItemDto): Promise<ChecklistItem> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateChecklistItemDto): Promise<ChecklistItem> {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } }) as Promise<ChecklistItem>;
  }

  async toggleCheck(id: number): Promise<ChecklistItem> {
    const item = await this.repo.findOne({ where: { id } }) as ChecklistItem;
    await this.repo.update(id, { is_checked: !item.is_checked });
    return this.repo.findOne({ where: { id } }) as Promise<ChecklistItem>;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async removeByNote(noteId: number): Promise<void> {
    await this.repo.delete({ note_id: noteId });
  }
}