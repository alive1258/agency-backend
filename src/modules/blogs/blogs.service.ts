import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { GetBlogDto } from './dto/get-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new Blog
   */
  public async create(
    req: Request,
    createBlogDto: CreateBlogDto,
    file?: Express.Multer.File,
  ): Promise<Blog> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    // Trim title
    createBlogDto.title = createBlogDto.title.trim();

    // Check duplicate title
    const titleExists = await this.blogRepository.exists({
      where: { title: createBlogDto.title },
    });

    if (titleExists) {
      throw new BadRequestException('Blog title already exists.');
    }

    // Handle optional image upload
    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    const newBlog = this.blogRepository.create({
      ...createBlogDto,
      added_by: String(userId),
      blog_category_id: String(createBlogDto.blog_category_id),
      image: imageUrl,
    });

    return await this.blogRepository.save(newBlog);
  }

  /**
   * Get all blogs (with filters)
   */
  public async findAll(query: GetBlogDto): Promise<any> {
    const blogQuery = this.blogRepository.createQueryBuilder('blog');

    blogQuery
      .select([
        'blog.id',
        'blog.title',
        'blog.blog_category_id',
        'blog.description',
        'blog.key_features',
        'blog.rating',
        'blog.image',
        'blog.created_at',
        'blog.updated_at',
      ])
      .leftJoin('blog.blog_category', 'category')
      .addSelect(['category.id', 'category.name'])
      .leftJoin('blog.addedBy', 'addedBy')
      .addSelect(['addedBy.id'])
      .orderBy('blog.created_at', 'DESC');

    // Filter by category
    if (query.blog_category_id) {
      blogQuery.andWhere('blog.blog_category_id = :catId', {
        catId: query.blog_category_id,
      });
    }

    return await blogQuery.getMany();
  }

  /**
   * Get single blog by UUID
   */
  public async findOne(id: string): Promise<any> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['blog_category', 'addedBy'],
    });

    if (!blog) throw new NotFoundException('Blog not found.');

    return {
      id: blog.id,
      title: blog.title,
      description: blog.description,
      key_features: blog.key_features,
      rating: blog.rating,
      image: blog.image,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
      category: blog.blog_category
        ? {
            id: blog.blog_category.id,
            name: blog.blog_category.name,
          }
        : undefined,
      addedBy: blog.addedBy
        ? {
            id: blog.addedBy.id,
            name: blog.addedBy.name,
          }
        : undefined,
    };
  }

  /**
   * Update a blog
   */
  public async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    file?: Express.Multer.File,
  ): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found.');

    // Check duplicate title
    if (updateBlogDto.title) {
      updateBlogDto.title = updateBlogDto.title.trim();

      const titleExists = await this.blogRepository.exists({
        where: { title: updateBlogDto.title, id: Not(id) },
      });

      if (titleExists) {
        throw new BadRequestException('Blog title already exists.');
      }
    }

    // Handle image update
    if (file) {
      if (blog.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: blog.image,
          currentFile: file,
        });
        updateBlogDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updateBlogDto.image = uploadedFiles[0];
      }
    }

    Object.assign(blog, updateBlogDto);
    return await this.blogRepository.save(blog);
  }

  /**
   * Soft delete a blog
   */
  public async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('ID is required');

    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found.');

    // Delete image if exists
    if (blog.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(blog.image);
      } catch (err) {
        console.warn(`Failed to delete blog image: ${err.message}`);
      }
    }

    const result = await this.blogRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
