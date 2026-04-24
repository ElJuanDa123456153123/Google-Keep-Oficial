import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './model/label.model';
import { NoteLabel } from '../note-label/model/note-label.model';
import { CreateLabelDto, AddLabelToNoteDto } from './dto/label.dto';

@Injectable()
export class LabelService {
    constructor(
        @InjectRepository(Label)
        private readonly labelRepository: Repository<Label>,
        @InjectRepository(NoteLabel)
        private readonly noteLabelRepository: Repository<NoteLabel>,
    ) {}

    async getAll(): Promise<Label[]> {
        return await this.labelRepository.find({
            order: { name: 'ASC' },
        });
    }

    async getByUserId(userId: number): Promise<Label[]> {
        return await this.labelRepository.find({
            where: { user_id: userId },
            order: { name: 'ASC' },
        });
    }

    async getById(id: number): Promise<Label | null> {
        return await this.labelRepository.findOne({ where: { id } });
    }

    async save(labelDto: CreateLabelDto): Promise<Label> {
        const label = this.labelRepository.create(labelDto);
        return await this.labelRepository.save(label);
    }

    async update(id: number, labelDto: Partial<CreateLabelDto>): Promise<Label | null> {
        await this.labelRepository.update(id, labelDto);
        return await this.getById(id);
    }

    async delete(id: number): Promise<void> {
        await this.noteLabelRepository.delete({ label_id: id });
        await this.labelRepository.delete(id);
    }

    async addLabelToNote(dto: AddLabelToNoteDto): Promise<NoteLabel> {
        const noteLabel = this.noteLabelRepository.create(dto);
        return await this.noteLabelRepository.save(noteLabel);
    }

    async removeLabelFromNote(noteId: number, labelId: number): Promise<void> {
        await this.noteLabelRepository.delete({
            note_id: noteId,
            label_id: labelId,
        });
    }

    async getLabelsByNoteId(noteId: number): Promise<Label[]> {
        const noteLabels = await this.noteLabelRepository.find({
            where: { note_id: noteId },
        });

        const labels: Label[] = [];
        for (const noteLabel of noteLabels) {
            const label = await this.getById(noteLabel.label_id);
            if (label) labels.push(label);
        }

        return labels;
    }
}
