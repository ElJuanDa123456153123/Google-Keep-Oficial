import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './model/note.model';
import { ChecklistItem } from './checklist-item/model/checklist-item.model';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';
import * as fs from 'fs';
import { join } from 'path';
import { Label } from '../label/model/label.model';
import { LabelService } from '../label/label.service';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(ChecklistItem)
    private readonly itemRepo: Repository<ChecklistItem>,
    private readonly labelService: LabelService
  ) {}

  async getAll(): Promise<Note[]> {
    const notes = await this.noteRepo.find({
      where: { is_deleted: false },
      relations: ['checklist_items'],
      order: { is_pinned: 'DESC', created_at: 'DESC' }
    });
    return this.addLabelsToNotes(notes);
  }

  async getById(id: number): Promise<Note> {
    const note = await this.noteRepo.findOne({
      where: { id },
      relations: ['checklist_items']
    }) as Note;
    if (note) {
      note.labels = await this.labelService.getLabelsByNoteId(id);
    }
    return note;
  }

  async getByUserId(userId: number): Promise<Note[]> {
    const notes = await this.noteRepo.find({
      where: { user_id: userId, is_deleted: false },
      relations: ['checklist_items'],
      order: { is_pinned: 'DESC', created_at: 'DESC' }
    });
    return this.addLabelsToNotes(notes);
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

    const savedNote = await this.noteRepo.findOne({
      where: { id: note.id },
      relations: ['checklist_items']
    }) as Note;
    savedNote.labels = [];
    return savedNote;
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

    const updatedNote = await this.noteRepo.findOne({
      where: { id },
      relations: ['checklist_items']
    }) as Note;
    updatedNote.labels = await this.labelService.getLabelsByNoteId(id);
    return updatedNote;
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
    const updatedNote = await this.noteRepo.findOne({
      where: { id },
      relations: ['checklist_items']
    }) as Note;
    updatedNote.labels = await this.labelService.getLabelsByNoteId(id);
    return updatedNote;
  }

  async archive(id: number): Promise<Note> {
    const note = await this.noteRepo.findOne({ where: { id } }) as Note;
    await this.noteRepo.update(id, { is_archived: !note.is_archived });
    const updatedNote = await this.noteRepo.findOne({
      where: { id },
      relations: ['checklist_items']
    }) as Note;
    updatedNote.labels = await this.labelService.getLabelsByNoteId(id);
    return updatedNote;
  }

  async getDeleted(): Promise<Note[]> {
    const notes = await this.noteRepo.find({
      where: { is_deleted: true },
      relations: ['checklist_items'],
      order: { updated_at: 'DESC' }
    });
    return this.addLabelsToNotes(notes);
  }

  async restore(id: number): Promise<Note> {
    await this.noteRepo.update(id, { is_deleted: false });
    const restoredNote = await this.noteRepo.findOne({
      where: { id },
      relations: ['checklist_items']
    }) as Note;
    restoredNote.labels = await this.labelService.getLabelsByNoteId(id);
    return restoredNote;
  }

  async permanentDelete(id: number): Promise<void> {
    const note = await this.noteRepo.findOne({ where: { id } });

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

    await this.itemRepo.delete({ note_id: id });
    await this.noteRepo.delete(id);
  }

  // Método privado para agregar etiquetas a un array de notas
  private async addLabelsToNotes(notes: Note[]): Promise<Note[]> {
    const notesWithLabels = await Promise.all(
      notes.map(async (note) => {
        note.labels = await this.labelService.getLabelsByNoteId(note.id);
        return note;
      })
    );
    return notesWithLabels;
  }
}