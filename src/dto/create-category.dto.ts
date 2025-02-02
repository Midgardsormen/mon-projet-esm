import { IsNotEmpty, IsIn,  IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Nom de la catégorie', example: 'Alimentation' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ description: 'Type de la catégorie', example: 'expense' })
    @IsString()
    @IsNotEmpty()
    @IsIn(['income', 'expense'], { message: "Le type doit être 'income' ou 'expense'." })
    type!: string;

    @ApiProperty({ description: 'ID de la catégorie parente (facultatif)', example: '550e8400-e29b-41d4-a716-446655440000', required: false })
    @IsOptional()
    @IsUUID()
    parent_id?: string; // L'ID de la catégorie parente (facultatif)
}