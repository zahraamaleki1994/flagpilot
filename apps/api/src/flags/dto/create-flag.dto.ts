import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFlagDto {
  @IsString()
  @MinLength(2, { message: 'key must be at least 2 characters long' })
  @MaxLength(64, { message: 'key must be at most 64 characters long' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'key may only contain lowercase letters, numbers and dashes',
  })
  key: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'description must be at most 500 characters long',
  })
  description?: string;
}
