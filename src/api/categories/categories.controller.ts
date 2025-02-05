import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from '../../dto/create-category.dto.js';
import { CategoriesService } from './categories.service.js';



@ApiTags('Budget Management')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Récupérer toutes les categories' })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
  
  @ApiOperation({ summary: 'Récupérer une catégorie par son ID' })
  @ApiParam({ name: 'id', description: 'ID de la category à récupérer' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Ajouter une nouvelle category' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Mettre à jour une category existante' })
  @ApiParam({ name: 'id', description: 'ID de la category à mettre à jour' })
  @ApiBody({ type: CreateCategoryDto, description: 'Données à mettre à jour' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateCategoryDto>) {
    return this.categoriesService.update(id, updateData);
  }

  @ApiOperation({ summary: 'Supprimer une category' })
  @ApiParam({ name: 'id', description: 'ID de la category à supprimer' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }

}
