import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { Partner } from './entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new Partner
   */
  public async create(
    req: Request,
    createPartnerDto: CreatePartnerDto,
    file?: Express.Multer.File,
  ): Promise<Partner> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    createPartnerDto.name = createPartnerDto.name.trim();

    const nameExists = await this.partnerRepository.exists({
      where: { name: createPartnerDto.name },
    });
    if (nameExists)
      throw new BadRequestException('Partner name already exists.');

    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    const newPartner = this.partnerRepository.create({
      ...createPartnerDto,
      added_by: String(userId),
      image: imageUrl,
    });

    return this.partnerRepository.save(newPartner);
  }

  /**
   * Get all partners with optional filters/pagination
   */
  public async findAll(): Promise<Partner[]> {
    return this.partnerRepository.find({ order: { created_at: 'DESC' } });
  }

  /**
   * Get a single partner by ID
   */
  public async findOne(id: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) throw new NotFoundException('Partner not found.');
    return partner;
  }

  /**
   * Update a partner
   */
  public async update(
    id: string,
    updatePartnerDto: UpdatePartnerDto,
    file?: Express.Multer.File,
  ): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) throw new NotFoundException('Partner not found.');

    if (updatePartnerDto.name) {
      updatePartnerDto.name = updatePartnerDto.name.trim();

      const nameExists = await this.partnerRepository.exists({
        where: { name: updatePartnerDto.name, id: Not(id) },
      });
      if (nameExists) {
        throw new BadRequestException('Partner name already exists.');
      }
    }

    if (file) {
      if (partner.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: partner.image,
          currentFile: file,
        });
        updatePartnerDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updatePartnerDto.image = uploadedFiles[0];
      }
    }

    Object.assign(partner, updatePartnerDto);
    return this.partnerRepository.save(partner);
  }

  /**
   * Soft delete a partner
   */
  public async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID is required');

    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) throw new NotFoundException('Partner not found.');

    if (partner.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(partner.image);
      } catch (err) {
        console.warn(`Failed to delete partner image: ${err.message}`);
      }
    }

    const result = await this.partnerRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
