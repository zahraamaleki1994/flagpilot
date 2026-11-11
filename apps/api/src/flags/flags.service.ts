import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Flag, FlagDocument } from './flag.schema';

@Injectable()
export class FlagsService {
  constructor(@InjectModel(Flag.name) private flagModel: Model<FlagDocument>) {}

  async create(key: string, description: string, createdBy: string) {
    const existing = await this.flagModel.findOne({ key });
    if (existing) throw new ConflictException(`Flag "${key}" already exists`);
    return this.flagModel.create({ key, description, createdBy });
  }

  async findAll() {
    return this.flagModel.find();
  }

  async findOne(key: string) {
    const flag = await this.flagModel.findOne({ key });
    if (!flag) throw new NotFoundException(`Flag "${key}" not found`);
    return flag;
  }

  async update(key: string, enabled?: boolean, description?: string) {
    const flag = await this.flagModel.findOneAndUpdate(
      { key },
      {
        ...(enabled !== undefined && { enabled }),
        ...(description !== undefined && { description }),
      },
      { returnDocument: 'after' },
    );
    if (!flag) throw new NotFoundException(`Flag "${key}" not found`);
    return flag;
  }

  async remove(key: string) {
    const flag = await this.flagModel.findOneAndDelete({ key });
    if (!flag) throw new NotFoundException(`Flag "${key}" not found`);
    return { deleted: true };
  }
}
