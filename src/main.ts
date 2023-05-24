import { NestFactory } from "@nestjs/core";
import { DocumentBuilder } from "@nestjs/swagger";
import { SwaggerModule } from "@nestjs/swagger/dist";
import { AppModule } from "./app.module";
import * as cors from 'cors'
// import { JwtAuthGuard } from "./auth/jwt-auth.guard";


async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('MonoLite')
    .setDescription('The simplest banking application')
    .setVersion('1.0.0')
    .addTag('Mono-Lite')
    .build()
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    }),
  );


  await app.listen(PORT, () => console.log(`Server is now going on port ${PORT}`))
}

start()