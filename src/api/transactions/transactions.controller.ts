import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from '../../dto/create-transaction.dto.js';
import { TransactionsService } from './transactions.service.js';


@ApiTags('Budget Management')
@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Récupérer toutes les transactions' })
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @ApiOperation({ summary: 'Ajouter une nouvelle transaction' })
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @ApiOperation({ summary: 'Mettre à jour une transaction existante' })
  @ApiParam({ name: 'id', description: 'ID de la transaction à mettre à jour' })
  @ApiBody({ type: CreateTransactionDto, description: 'Données à mettre à jour' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateTransactionDto>) {
    return this.transactionsService.update(id, updateData);
  }

  @ApiOperation({ summary: 'Supprimer une transaction' })
  @ApiParam({ name: 'id', description: 'ID de la transaction à supprimer' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.transactionsService.delete(id);
  }

}
