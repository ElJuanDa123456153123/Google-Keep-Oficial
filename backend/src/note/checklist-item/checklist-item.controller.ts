import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ChecklistItemService } from './checklist-item.service';
import { CreateChecklistItemDto, UpdateChecklistItemDto } from './dto/checklist-item.dto';

@Controller('checklist-item')
export class ChecklistItemController {
  constructor(private readonly service: ChecklistItemService) {}

  @Post('by-note/:noteId')
  findByNote(@Param('noteId') noteId: string) {
    return this.service.findByNote(+noteId);
  }

  @Post('save')
  create(@Body() dto: CreateChecklistItemDto) {
    return this.service.create(dto);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateChecklistItemDto) {
    return this.service.update(+id, dto);
  }

  @Post('toggle-check/:id')
  toggleCheck(@Param('id') id: string) {
    return this.service.toggleCheck(+id);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Delete('delete-by-note/:noteId')
  removeByNote(@Param('noteId') noteId: string) {
    return this.service.removeByNote(+noteId);
  }
}