import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './model/note.model';
import { ChecklistItem } from './checklist-item/model/checklist-item.model';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { ChecklistItemController } from './checklist-item/checklist-item.controller';
import { ChecklistItemService } from './checklist-item/checklist-item.service';
import { LabelModule } from '../label/label.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note, ChecklistItem]), LabelModule],
  controllers: [NoteController, ChecklistItemController],
  providers: [NoteService, ChecklistItemService],
  exports: [NoteService]
})
export class NoteModule {}