import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CollaboratorService } from "./collaborator.service";
import { AddCollaboratorDto } from "./dto/collaborator.dto";

@Controller("collaborator")
export class CollaboratorController {
    constructor(
        private readonly service: CollaboratorService
    ) {}

    @Get('by-note/:noteId')
    getByNoteId(@Param('noteId', ParseIntPipe) noteId: number) {
        return this.service.getByNoteId(noteId);
    }

    @Get('by-user/:userId')
    getByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.service.getByUserId(userId);
    }

    @Post('add')
    async addCollaborator(@Body() data: AddCollaboratorDto) {
        return await this.service.addCollaborator(data);
    }

    @Put('update-permission/:id')
    async updatePermission(
        @Param('id', ParseIntPipe) id: number,
        @Body('permission') permission: 'edit' | 'view'
    ) {
        return await this.service.updatePermission(id, permission);
    }

    @Delete('remove/:noteId/:userId')
    async removeCollaborator(
        @Param('noteId', ParseIntPipe) noteId: number,
        @Param('userId', ParseIntPipe) userId: number
    ) {
        return await this.service.removeCollaborator(noteId, userId);
    }

    @Delete('delete/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.service.delete(id);
    }
}
