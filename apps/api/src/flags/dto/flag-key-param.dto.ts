import { IsString, Matches, MaxLength } from 'class-validator';

export class FlagKeyParamDto {
  @IsString()
  @MaxLength(64, { message: 'key must be at most 64 characters long' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'key may only contain lowercase letters, numbers and dashes',
  })
  key: string;
}
