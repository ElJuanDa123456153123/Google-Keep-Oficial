import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Note } from "../note/model/note.model";
import { ChecklistItem } from "../note/checklist-item/model/checklist-item.model";
import { Label } from "../label/model/label.model";
import { NoteLabel } from "../note-label/model/note-label.model";
import { User } from "../user/model/user.model";
import { Collaborator } from "../collaborator/model/collaborator.model";

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: '127.0.0.1',
        port: 8001,
        username: 'babilonicos',
        password: 'babilonicos123',
        database: 'GoogleKeepTeamBabilonicos',
        entities: [Note, ChecklistItem, Label, NoteLabel, User, Collaborator],
        synchronize: true,
    }),
);
