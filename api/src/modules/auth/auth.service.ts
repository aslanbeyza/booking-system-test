import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt = require("bcrypt");
import { eq } from "drizzle-orm";

import { DrizzleService } from "../../database/drizzle.service";
import { users } from "../../database/schema";
import type { LoginInput, RegisterInput } from "@booking/shared";

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const existing = await this.drizzle.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email.toLowerCase()))
      .limit(1);
    if (existing.length > 0) {
      throw new ConflictException("Bu e-posta zaten kayıtlı");
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const [row] = await this.drizzle.db
      .insert(users)
      .values({
        name: input.name.trim(),
        email: input.email.toLowerCase(),
        passwordHash,
      })
      .returning({ id: users.id, name: users.name, email: users.email });

    if (!row) {
      throw new ConflictException("Kayıt oluşturulamadı");
    }
    return row;
  }

  async validateUser(input: LoginInput) {
    const [row] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.email, input.email.toLowerCase()))
      .limit(1);

    if (!row) {
      throw new UnauthorizedException("E-posta veya şifre hatalı");
    }

    const ok = await bcrypt.compare(input.password, row.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("E-posta veya şifre hatalı");
    }

    return { id: row.id, name: row.name, email: row.email };
  }

  async findUserById(id: string) {
    const [row] = await this.drizzle.db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row ?? null;
  }

  signAccessToken(user: { id: string; name: string; email: string }) {
    return this.jwt.signAsync({
      sub: String(user.id),
      email: user.email,
      name: user.name,
    });
  }
}
