import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🔒 Seguridad HTTP básica pero permitiendo cargar imágenes
  app.use(
    helmet({
      contentSecurityPolicy: false, // Desactivar CSP para evitar problemas con imágenes
      crossOriginEmbedderPolicy: false, // Permitir cargar recursos de diferentes orígenes
    })
  );

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api/v1');

  // ✅ Crear carpeta uploads si no existe
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('📁 Creando carpeta uploads...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Carpeta uploads creada:', uploadsDir);
  } else {
    console.log('✅ Carpeta uploads ya existe:', uploadsDir);
  }

  // Serve static files from uploads directory con CORS headers
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  var port = 3001;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
}
bootstrap();
