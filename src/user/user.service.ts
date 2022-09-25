import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DeepPartial, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto & { refreshToken?: string }): Promise<User> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  async find(option: FindUserDto): Promise<User[]> {
    const {
      id,
      name,
      nickname,
      email,
      page = 1,
      count = 5,
      sort = 'ASC',
    } = option;
    return await this.userRepository.find({
      order: { created: sort },
      where: { id, name, nickname, email },
      skip: (page - 1) * count,
      take: count,
    });
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, data: DeepPartial<User>): Promise<UpdateResult> {
    return await this.userRepository.update(id, data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }
}