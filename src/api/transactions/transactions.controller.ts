import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from '../../dto/create-transaction.dto.js';
import { TransactionsService } from './transactions.service.js';
import { SupabaseAuthGuard } from '../../guards/supabase-auth.guard.js';
import type { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    id: string;
  };
}

@ApiTags('Budget Management')
@ApiBearerAuth('BearerAuth')
@Controller('api/transactions')
@UseGuards(SupabaseAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Récupérer toutes les transactions' })
  @Get()
  findAll(@Req() req: RequestWithUser) {
    const userId = (req.user?.id)? req.user.id:"00";
    return this.transactionsService.findAllForUser(userId);
  }

  @ApiOperation({ summary: 'Récupérer les transactions groupées par mois/année avec pagination' })
  @Get('grouped')
  async findGrouped(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Req() req: RequestWithUser
  ) {
    const pageNumber = parseInt(page, 10) || 0;
    const limitNumber = parseInt(limit, 10) || 20;
    const userId = (req.user?.id)? req.user.id:"";
    console.log("req", req)
    return this.transactionsService.findTransactionsGroupedByMonth(userId, pageNumber, limitNumber);
  }
  
  @Get('total-balance')
  async getTotalBalance(@Req() req: RequestWithUser) {
    // Appel au service pour calculer le solde total
    const userId = (req.user?.id)? req.user.id:"";
    return this.transactionsService.getTotalBalance(userId);
  }

  @ApiOperation({ summary: 'Ajouter une nouvelle transaction' })
  @Post()
  create(@Req() req: RequestWithUser, @Body() createTransactionDto: CreateTransactionDto) {
    const userId = (req.user?.id)? req.user.id:"";
    return this.transactionsService.create(userId, createTransactionDto);
  }

  @ApiOperation({ summary: 'Mettre à jour une transaction existante' })
  @ApiParam({ name: 'id', description: 'ID de la transaction à mettre à jour' })
  @ApiBody({ type: CreateTransactionDto, description: 'Données à mettre à jour' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateTransactionDto>, @Req() req: RequestWithUser) {
    const userId = (req.user?.id)? req.user.id:"";

    return this.transactionsService.update(userId, id, updateData);
  }

  @ApiOperation({ summary: 'Supprimer une transaction' })
  @ApiParam({ name: 'id', description: 'ID de la transaction à supprimer' })
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = (req.user?.id)? req.user.id:"";
    return this.transactionsService.delete(userId, id);
  }

}
