import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { ResidentDocumentsController } from './resident-documents.controller';
import { DocumentsService } from './documents.service';
import { FilesModule } from '../files/files.module';
import { KbModule } from '../kb/kb.module';

@Module({
  imports: [FilesModule, KbModule],
  controllers: [DocumentsController, ResidentDocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
