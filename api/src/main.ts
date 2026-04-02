import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser = require("cookie-parser");

import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Booking API")
    .setDescription(
      "Rezervasyon servisi — rules.md (NestJS + Drizzle + PostgreSQL + Zod)",
    )
    .setVersion("1.0")
    .addTag("auth", "Kayıt, giriş, oturum")
    .addTag("bookings", "Müsait slotlar ve rezervasyon")
    .addCookieAuth("booking_token", {
      type: "apiKey",
      in: "cookie",
      name: "booking_token",
      description: "JWT (httpOnly), giriş sonrası set edilir",
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  app.enableCors({
    origin: config.get<string>("CORS_ORIGIN") ?? "http://localhost:3000",
    credentials: true,
  });

  const port = config.getOrThrow<number>("PORT");
  await app.listen(port);

  Logger.log(`API http://localhost:${port}`, "Bootstrap");
  Logger.log(`Swagger http://localhost:${port}/docs`, "Bootstrap");
}

bootstrap();
