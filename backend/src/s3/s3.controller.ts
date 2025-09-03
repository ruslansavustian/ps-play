import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileUrl = await this.s3Service.uploadFile(file);
    return {
      success: true,
      fileUrl,
      fileName: file.originalname,
      size: file.size,
    };
  }

  @Delete('delete/:key')
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteFile(key);
    return { success: true, message: 'File deleted successfully' };
  }
}
