// guards/optional-cookie-auth.guard.ts
import { Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseService } from '../../libs/shared/src/services/supabase/supabase.service.js';

@Injectable()
export class OptionnalCookieAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { accessToken } = request.cookies || {};

    // Si pas de cookie => on laisse passer en mode "anonyme"
    if (!accessToken) {
      request.user = null;
      return true;
    }

    // Sinon, on vérifie le token
    const { data: userResult, error } = await this.supabaseService
      .getClient()
      .auth.getUser(accessToken);

    if (error || !userResult?.user) {
      // Cookie invalide => on laisse passer en mode "anonyme"
      // (Ou tu peux faire return false; si tu veux vraiment 403)
      request.user = null;
      return true;
    }

    // Cookie valide => user connecté
    request.user = userResult.user;
    return true;
  }
}
