import 'dotenv/config';

import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);


  app.use(cookieParser());

  app.enableCors({

    origin: [

      'https://inclusivetech.up.railway.app',
      'https://appbit-frontend-v1-teste-leticia-phi.vercel.app',
      'https://appbit-frontend-v1-teste-leticia-r1.vercel.app',
      'http://localhost:5173',

    ],

    credentials: true,

  });



  app.useGlobalPipes(

    new ValidationPipe({

      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,

    }),

  );



  const port = process.env.PORT || 3000;



  await app.listen(port, '0.0.0.0');



  console.log(`API executando na porta ${port}`);

}



bootstrap();
