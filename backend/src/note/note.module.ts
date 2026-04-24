import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { Note } from './model/note.model';
import { ChecklistItem } from './checklist-item/model/checklist-item.model';

@Module({
    imports: [TypeOrmModule.forFeature([Note, ChecklistItem])],
    controllers: [NoteController],
    providers: [NoteService],
    exports: [NoteService],
})
export class NoteModule {}
