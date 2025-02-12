// guards/supabase-auth.guard.ts
import { Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseService } from '../../libs/shared/src/services/supabase/supabase.service.js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) return false;

    const token = authHeader.split('Bearer ')[1];
    if (!token) return false;

    // Vérifie le token auprès de Supabase
    const { data: userResult, error } = await this.supabaseService
      .getClient()
      .auth.getUser(token);

    if (error || !userResult?.user) {
      return false;
    }

    // Stocke l'objet user dans req.user
    request.user = userResult.user; // user.id => l'UUID de l'utilisateur
    return true;
  }
}
