import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'], // 프론트엔드 URL 허용
    credentials: true, // 쿠키 전송 허용
  });

  // Swagger 설정
  const options = new DocumentBuilder()
    .setTitle('Neul API Docs')
    .setDescription('Neul 프로젝트 백엔드 Swagger 문서입니다.')
    .setVersion('1.0')
    .addTag('Neul') // 원하는 태그 추가
    .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document); // swagger 경로 지정

  // 포트 설정 (5000으로 수정)
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;

  await app.listen(port);
  console.log(`🚀 서버 실행중 http://localhost:${port}`);
  console.log(`📚 Swagger 문서: http://localhost:${port}/api-docs`);
}
bootstrap();
