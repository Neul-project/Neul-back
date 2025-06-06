import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const uploadPaths = [
    path.join(process.cwd(), 'uploads'),
    path.join(process.cwd(), 'uploads/image'),
    path.join(process.cwd(), 'uploads/file'),
  ];

  uploadPaths.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const app = await NestFactory.create(AppModule);
  
  // app.enableCors({
  //   origin: (origin, callback) => { // 접근가능 주소
  //     const allowedOrigins = ['http://3.38.125.252', 'http://3.37.80.103', 'http://3.34.237.140', 'http://localhost:3000', 'http://localhost:4000', 'http://localhost:4001'];
  //     if (!origin || allowedOrigins.includes(origin)) {
  //       callback(null, origin);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   credentials: true, // 쿠키 전송 허용
  //   methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE', // 리소스 접근을 허용하는 HTTP 메서드를 지정해 주는 헤더
  //   allowedHeaders: 'Origin, Content-Type, Accept, Authorization', // 요청을 허용하는 헤더
  // });

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