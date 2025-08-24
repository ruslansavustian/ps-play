import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}
  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    const candidate = this.candidateRepository.create(createCandidateDto);
    return await this.candidateRepository.save(candidate);
  }

  async findAll(): Promise<Candidate[]> {
    return await this.candidateRepository.find();
  }

  async findOne(id: number): Promise<Candidate | null> {
    return await this.candidateRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateData: Partial<CreateCandidateDto>,
  ): Promise<Candidate | null> {
    await this.candidateRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.candidateRepository.delete(id);
  }
}
