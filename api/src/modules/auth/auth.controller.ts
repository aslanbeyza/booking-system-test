import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "@booking/shared";

import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  private cookieOptions() {
    const name = this.config.getOrThrow<string>("AUTH_COOKIE_NAME");
    const isProd = this.config.get<string>("NODE_ENV") === "production";
    return {
      name,
      options: {
        httpOnly: true as const,
        secure: isProd,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    };
  }

  @Post("register")
  @ApiOperation({ summary: "Kayıt ol" })
  async register(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    const user = await this.authService.register(parsed.data);
    const token = await this.authService.signAccessToken(user);
    const { name, options } = this.cookieOptions();
    res.cookie(name, token, options);
    return { user: { id: user.id, name: user.name, email: user.email } };
  }

  @Post("login")
  @ApiOperation({ summary: "Giriş" })
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    const user = await this.authService.validateUser(parsed.data);
    const token = await this.authService.signAccessToken(user);
    const { name, options } = this.cookieOptions();
    res.cookie(name, token, options);
    return { user: { id: user.id, name: user.name, email: user.email } };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("booking_token")
  @ApiOperation({ summary: "Çıkış (çerezi temizler)" })
  logout(@Res({ passthrough: true }) res: Response) {
    const { name, options } = this.cookieOptions();
    res.clearCookie(name, { path: options.path });
    return { ok: true as const };
  }

  @Get("me")
  @ApiOperation({
    summary: "Oturumdaki kullanıcı (veritabanından)",
    description:
      "Çerez yoksa veya JWT geçersizse 200 + user: null (401 değil; SPA oturum kontrolü için).",
  })
  @ApiOkResponse({
    description: "Oturum varsa user dolu, yoksa null",
  })
  async me(@Req() req: Request) {
    const cookieName = this.config.getOrThrow<string>("AUTH_COOKIE_NAME");
    const raw = req.cookies?.[cookieName];
    const token = typeof raw === "string" && raw.length > 0 ? raw : null;
    if (!token) {
      return { user: null };
    }
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(token);
      const user = await this.authService.findUserById(payload.sub);
      if (!user) {
        return { user: null };
      }
      return { user: { id: user.id, name: user.name, email: user.email } };
    } catch {
      return { user: null };
    }
  }
}
