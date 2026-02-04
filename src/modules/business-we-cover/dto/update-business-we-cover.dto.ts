import { PartialType } from '@nestjs/swagger';
import { CreateBusinessWeCoverDto } from './create-business-we-cover.dto';

export class UpdateBusinessWeCoverDto extends PartialType(CreateBusinessWeCoverDto) {}
