import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';

import { BlogDetail } from './entities/blog-detail.entity';
import { CreateBlogDetailDto } from './dto/create-blog-detail.dto';
import { UpdateBlogDetailDto } from './dto/update-blog-detail.dto';
import { GetBlogDetailDto } from './dto/get-blog-detail.dto';

import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/common/data-query/data-query.service';

@Injectable()
export class BlogDetailsService {
  constructor(
    @InjectRepository(BlogDetail)
    private readonly blogDetailRepository: Repository<BlogDetail>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new Blog Detail
   */
  public async create(
    req: Request,
    createBlogDetailDto: CreateBlogDetailDto,
    file?: Express.Multer.File,
  ): Promise<BlogDetail> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    // Trim title
    createBlogDetailDto.title = createBlogDetailDto.title.trim();

    // Check duplicate title for same blog
    const titleExists = await this.blogDetailRepository.exists({
      where: {
        title: createBlogDetailDto.title,
      },
    });

    if (titleExists) {
      throw new BadRequestException(
        'Blog detail title already exists for this blog.',
      );
    }

    // Handle optional image upload
    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    const newBlogDetail = this.blogDetailRepository.create({
      ...createBlogDetailDto,
      added_by: String(userId),
      blog_id: String(createBlogDetailDto.blog_id),
      image: imageUrl,
    });

    return await this.blogDetailRepository.save(newBlogDetail);
  }

  /**
   * Get all blog details (with filters)
   */
  public async findAll(query: GetBlogDetailDto): Promise<any> {
    const detailQuery =
      this.blogDetailRepository.createQueryBuilder('blog_detail');

    detailQuery
      .select([
        'blog_detail.id',
        'blog_detail.title',
        'blog_detail.blog_id',
        'blog_detail.description',
        'blog_detail.key_features',
        'blog_detail.image',
        'blog_detail.created_at',
        'blog_detail.updated_at',
      ])
      .leftJoin('blog_detail.blog', 'blog')
      .addSelect(['blog.id', 'blog.title'])
      .leftJoin('blog_detail.addedBy', 'addedBy')
      .addSelect(['addedBy.id'])
      .orderBy('blog_detail.created_at', 'DESC');

    // Filter by blog
    if (query.blog_id) {
      detailQuery.andWhere('blog_detail.blog_id = :blogId', {
        blogId: query.blog_id,
      });
    }

    return await detailQuery.getMany();
  }

  /**
   * Get single blog detail by UUID
   */
  public async findOne(id: string): Promise<any> {
    const blogDetail = await this.blogDetailRepository.findOne({
      where: { id },
      relations: ['blog', 'addedBy'],
    });

    if (!blogDetail) throw new NotFoundException('Blog detail not found.');

    return {
      id: blogDetail.id,
      title: blogDetail.title,
      description: blogDetail.description,
      key_features: blogDetail.key_features,
      image: blogDetail.image,
      created_at: blogDetail.created_at,
      updated_at: blogDetail.updated_at,
      blog: blogDetail.blog
        ? {
            id: blogDetail.blog.id,
            title: blogDetail.blog.title,
          }
        : undefined,
      addedBy: blogDetail.addedBy
        ? {
            id: blogDetail.addedBy.id,
            name: blogDetail.addedBy.name,
          }
        : undefined,
    };
  }

  /**
   * Update a blog detail
   */
  public async update(
    id: string,
    updateBlogDetailDto: UpdateBlogDetailDto,
    file?: Express.Multer.File,
  ): Promise<BlogDetail> {
    const blogDetail = await this.blogDetailRepository.findOne({
      where: { id },
    });
    if (!blogDetail) throw new NotFoundException('Blog detail not found.');

    // Check duplicate title
    if (updateBlogDetailDto.title) {
      updateBlogDetailDto.title = updateBlogDetailDto.title.trim();

      const titleExists = await this.blogDetailRepository.exists({
        where: {
          title: updateBlogDetailDto.title,
          blog_id: blogDetail.blog_id,
          id: Not(id),
        },
      });

      if (titleExists) {
        throw new BadRequestException(
          'Blog detail title already exists for this blog.',
        );
      }
    }

    // Handle image update
    if (file) {
      if (blogDetail.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: blogDetail.image,
          currentFile: file,
        });
        updateBlogDetailDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updateBlogDetailDto.image = uploadedFiles[0];
      }
    }

    Object.assign(blogDetail, updateBlogDetailDto);
    return await this.blogDetailRepository.save(blogDetail);
  }

  /**
   * Soft delete a blog detail
   */
  public async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID is required');

    const blogDetail = await this.blogDetailRepository.findOne({
      where: { id },
    });
    if (!blogDetail) throw new NotFoundException('Blog detail not found.');

    // Delete image if exists
    if (blogDetail.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(blogDetail.image);
      } catch (err) {
        console.warn(`Failed to delete blog detail image: ${err.message}`);
      }
    }

    const result = await this.blogDetailRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
