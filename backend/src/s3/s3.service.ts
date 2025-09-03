import { Injectable, BadRequestException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const region = this.configService.get<string>('AWS_REGION');

    if (!this.bucketName) {
      throw new Error(
        `AWS_S3_BUCKET is not set. Current value: ${this.bucketName}`,
      );
    }

    this.s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Проверяем тип файла
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    // Проверяем размер файла (например, максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size too large. Maximum 5MB allowed');
    }

    // Генерируем уникальное имя файла
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    const key = `photos/${fileName}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      // Возвращаем URL файла
      return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new BadRequestException('Failed to upload file to S3');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('S3 delete error:', error);
      throw new BadRequestException('Failed to delete file from S3');
    }
  }
}
