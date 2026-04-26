import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './model/note.model';
import { ChecklistItem } from './checklist-item/model/checklist-item.model';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(ChecklistItem)
    private readonly itemRepo: Repository<ChecklistItem>
  ) {}

  getAll(): Promise<Note[]> {
    return this.noteRepo.find({
      where: { is_deleted: false },
      order: { is_pinned: 'DESC', created_at: 'DESC' }
    });
  }

  getById(id: number): Promise<Note> {
    return this.noteRepo.findOne({ where: { id } }) as Promise<Note>;
  }

  getByUserId(userId: number): Promise<Note[]> {
    return this.noteRepo.find({
      where: { user_id: userId, is_deleted: false },
      order: { is_pinned: 'DESC', created_at: 'DESC' }
    });
  }

  async save(dto: CreateNoteDto): Promise<Note> {
    const { checklist_items, ...fields } = dto;

    const note = await this.noteRepo.save(this.noteRepo.create(fields));

    if (checklist_items?.length) {
      await this.itemRepo.save(
        checklist_items.map((item, i) =>
          this.itemRepo.create({
            note_id:    note.id,
            content:    item.content,
            is_checked: item.is_checked ?? false,
            position:   item.position   ?? i
          })
        )
      );
    }

    return this.noteRepo.findOne({ where: { id: note.id } }) as Promise<Note>;
  }

  async update(id: number, dto: UpdateNoteDto): Promise<Note> {
    const { checklist_items, ...fields } = dto;

    await this.noteRepo.update(id, fields);

    if (checklist_items !== undefined) {
      await this.itemRepo.delete({ note_id: id });

      if (checklist_items.length) {
        await this.itemRepo.save(
          checklist_items.map((item, i) =>
            this.itemRepo.create({
              note_id:    id,
              content:    item.content,
              is_checked: item.is_checked ?? false,
              position:   item.position   ?? i
            })
          )
        );
      }
    }

    return this.noteRepo.findOne({ where: { id } }) as Promise<Note>;
  }

  async delete(id: number): Promise<void> {
    const note = await this.noteRepo.findOne({ where: { id } });
    
    // Si tiene imagen, eliminar el archivo físico
    if (note?.image_url) {
      try {
        const filename = note.image_url.split('/uploads/').pop();
        if (filename) {
          const filePath = join(process.cwd(), 'uploads', filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    await this.noteRepo.update(id, { is_deleted: true });
  }

  async togglePin(id: number): Promise<Note> {
    const note = await this.noteRepo.findOne({ where: { id } }) as Note;
    await this.noteRepo.update(id, { is_pinned: !note.is_pinned });
    return this.noteRepo.findOne({ where: { id } }) as Promise<Note>;
  }

  async archive(id: number): Promise<Note> {
    const note = await this.noteRepo.findOne({ where: { id } }) as Note;
    await this.noteRepo.update(id, { is_archived: !note.is_archived });
    return this.noteRepo.findOne({ where: { id } }) as Promise<Note>;
  }
}