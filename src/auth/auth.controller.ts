// src/auth/auth.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  @Post('set-token')
  setToken(@Body() body: { token: string }, @Res() res: Response) {
    const token = body.token;

    // On écrit le cookie "accessToken" dans la réponse
    // Cf. attributs de sécurité : httpOnly, secure, sameSite, etc.
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: false, // en prod => true si HTTPS
      sameSite: 'strict',
      path: '/'
      // maxAge: 1000 * 60 * 60 par ex. (1 heure)
    });
    
    return res.send({ ok: true });
  }

  @Post('clear-token')
  clearToken(@Res() res: Response) {
    // Pour déconnecter => on efface le cookie
    res.clearCookie('accessToken', { path: '/' });
    return res.send({ ok: true });
  }
}
