import { Module } from '@nestjs/common';
import { FlyersController } from './flyers.controller';
import { FlyersService } from './flyers.service';
import { PdfModule } from '../pdf/pdf.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [PdfModule, FilesModule],
  controllers: [FlyersController],
  providers: [FlyersService],
})
export class FlyersModule {}
