import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';
import { Label } from './model/label.model';
import { NoteLabel } from '../note-label/model/note-label.model';

@Module({
    imports: [TypeOrmModule.forFeature([Label, NoteLabel])],
    controllers: [LabelController],
    providers: [LabelService],
    exports: [LabelService],
})
export class LabelModule {}
