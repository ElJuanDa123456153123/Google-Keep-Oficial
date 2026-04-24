import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';
import { NoteModule } from './note/note.module';
import { LabelModule } from './label/label.module';
import { UserModule } from './user/user.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig
    }),
    NoteModule,
    LabelModule,
    UserModule,
    CollaboratorModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
