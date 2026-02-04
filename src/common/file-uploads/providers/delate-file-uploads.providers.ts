import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data'; // ✅ fixed import

@Injectable()
export class DeleteFileUploadsProvider {
  private readonly logger = new Logger(DeleteFileUploadsProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async handleDeleteFileUploads(currentFile: string): Promise<string> {
    if (!currentFile) {
      throw new NotFoundException('No file provided for deletion');
    }

    try {
      const imageUploadUrl = this.configService.get<string>(
        'appConfig.imageUploadUrl',
      );

      if (!imageUploadUrl) {
        throw new BadRequestException(
          'Image upload URL is not configured properly',
        );
      }

      // Prepare FormData with the old file
      const formData = new FormData();
      formData.append('oldFile', currentFile);

      // Send deletion request (use httpService.post + lastValueFrom for TS safety)
      const response = await this.httpService.axiosRef.post(
        `${imageUploadUrl}/delete`,
        formData,
        {
          headers: formData.getHeaders(),
        },
      );

      if (response.status !== 200 || !response.data?.status) {
        throw new BadRequestException(
          'Failed to delete the file on remote server',
        );
      }

      return response.data.status;
    } catch (error: unknown) {
      this.logger.error(
        `Error deleting file "${currentFile}": ${error instanceof Error ? error.message : error}`,
      );
      throw new BadRequestException(
        `File deletion failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
