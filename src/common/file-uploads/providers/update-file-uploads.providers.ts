import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import FormData from 'form-data';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UpdateFileUploadsProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async handleUpdateFileUploads(
    currentFile: Express.Multer.File,
    oldFile: string,
  ): Promise<string> {
    if (!currentFile?.buffer) {
      return oldFile;
    }

    try {
      const imageUploadUrl = this.configService.get<string>(
        'appConfig.imageUploadUrl',
      );

      if (!imageUploadUrl) {
        throw new BadRequestException('Image upload URL not configured');
      }

      const formData = new FormData();

      formData.append('newFile', currentFile.buffer, {
        filename: currentFile.originalname,
        contentType: currentFile.mimetype,
      });

      formData.append('oldFile', oldFile);

      const response = await lastValueFrom(
        this.httpService.post<{ name: string }>(
          `${imageUploadUrl}/update`,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      );

      const updatedName = response.data?.name;

      if (!updatedName) {
        throw new BadRequestException(
          'The response did not contain a valid photo name.',
        );
      }

      return updatedName;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(`Image update failed: ${err.message}`);
      }
      throw new BadRequestException('Image update failed');
    }
  }
}
