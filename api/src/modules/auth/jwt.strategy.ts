import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

type JwtPayload = {
  sub: string;
  email: string;
  name?: string;
};

function cookieExtractor(cookieName: string) {
  return (req: Request): string | null => {
    const raw = req?.cookies?.[cookieName];
    return typeof raw === "string" && raw.length > 0 ? raw : null;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    const name = config.getOrThrow<string>("AUTH_COOKIE_NAME");
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor(name),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
