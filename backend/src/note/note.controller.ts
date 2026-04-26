import { Body, Controller, Param, ParseIntPipe, Post } from "@nestjs/common";
import { NoteService } from "./note.service";
import { CreateNoteDto, UpdateNoteDto } from "./dto/note.dto";

@Controller("note")
export class NoteController {
  constructor(private readonly service: NoteService) {}

  @Post('getall')
  getAll() {
    return this.service.getAll();
  }

  @Post('getbyid/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post('getbyuser/:userId')
  getByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.getByUserId(userId);
  }

  @Post('save')
  async save(@Body() data: CreateNoteDto) {
    return await this.service.save(data);
  }

  @Post('update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateNoteDto) {
    return await this.service.update(id, data);
  }

  @Post('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }

  @Post('toggle-pin/:id')
  async togglePin(@Param('id', ParseIntPipe) id: number) {
    return await this.service.togglePin(id);
  }

  @Post('archive/:id')
  async archive(@Param('id', ParseIntPipe) id: number) {
    return await this.service.archive(id);
  }
}