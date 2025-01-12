import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { svelteTemplateEngine } from './svelte-engine.js';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir les fichiers statiques compilés par Vite (JS, CSS, etc.)
  app.useStaticAssets(join(process.cwd(), 'dist-client'), {
    prefix: '/static',
  });

  // Configurer le moteur de template personnalisé
  app.engine('cjs', svelteTemplateEngine);
  app.setViewEngine('cjs');
  app.setBaseViewsDir(join(process.cwd(),'dist-ssr'));

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
  .setTitle('Max Budget Admin')
  .setDescription('API pour gérer les budgets personnels')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.BACKEND_PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running at http://localhost:${port}`);
  Logger.log(`server listening: ${await app.getUrl()}`)
}
bootstrap();
