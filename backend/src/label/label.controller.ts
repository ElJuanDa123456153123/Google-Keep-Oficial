import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { LabelService } from "./label.service";
import { CreateLabelDto, AddLabelToNoteDto } from "./dto/label.dto";

@Controller("label")
export class LabelController {
    constructor(
        private readonly service: LabelService
    ) {}

    @Get('getall')
    getAll() {
        return this.service.getAll();
    }

    @Get('getbyid/:id')
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.service.getById(id);
    }

    @Get('getbyuser/:userId')
    getByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.service.getByUserId(userId);
    }

    @Get('by-note/:noteId')
    getLabelsByNoteId(@Param('noteId', ParseIntPipe) noteId: number) {
        return this.service.getLabelsByNoteId(noteId);
    }

    @Post('save')
    async save(@Body() data: CreateLabelDto) {
        return await this.service.save(data);
    }

    @Post('update/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CreateLabelDto>) {
        return await this.service.update(id, data);
    }

    @Post('add-to-note')
    async addLabelToNote(@Body() data: AddLabelToNoteDto) {
        return await this.service.addLabelToNote(data);
    }

    @Delete('remove-from-note/:noteId/:labelId')
    async removeLabelFromNote(
        @Param('noteId', ParseIntPipe) noteId: number,
        @Param('labelId', ParseIntPipe) labelId: number
    ) {
        return await this.service.removeLabelFromNote(noteId, labelId);
    }

    @Delete('delete/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
