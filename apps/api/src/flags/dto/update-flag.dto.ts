import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFlagDto {
  @IsOptional()
  @IsBoolean({ message: 'enabled must be true or false' })
  enabled?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'description must be at most 500 characters long',
  })
  description?: string;
}
