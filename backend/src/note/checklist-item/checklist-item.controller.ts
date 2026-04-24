import { Body, Controller, Param, ParseIntPipe, Post, Delete, Get } from "@nestjs/common";
import { ChecklistItemService } from "./checklist-item.service";
import { CreateChecklistItemDto, UpdateChecklistItemDto } from "./dto/checklist-item.dto";

@Controller("checklist-item")
export class ChecklistItemController {
    constructor(
        private readonly service: ChecklistItemService
    ) {}

    @Get('by-note/:noteId')
    getByNoteId(@Param('noteId', ParseIntPipe) noteId: number) {
        return this.service.getByNoteId(noteId);
    }

    @Post('save')
    async save(@Body() data: CreateChecklistItemDto) {
        return await this.service.save(data);
    }

    @Post('update/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateChecklistItemDto) {
        return await this.service.update(id, data);
    }

    @Post('toggle-check/:id')
    async toggleCheck(@Param('id', ParseIntPipe) id: number) {
        return await this.service.toggleCheck(id);
    }

    @Delete('delete/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }

    @Delete('delete-by-note/:noteId')
    async deleteByNoteId(@Param('noteId', ParseIntPipe) noteId: number) {
        return await this.service.deleteByNoteId(noteId);
    }
}
