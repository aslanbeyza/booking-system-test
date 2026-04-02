import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { createBookingInputSchema } from "@booking/shared";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser, type RequestUser } from "../auth/current-user.decorator";
import {
  CreateBookingDto,
  availableQuerySchema,
} from "./bookings.dto";
import { BookingsService } from "./bookings.service";

@ApiTags("bookings")
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get("available")
  @ApiOperation({
    summary: "Müsait oturumlar",
    description:
      "Verilen güne ait slotları döner; veritabanında rezerve edilmiş saatler `available: false` olur.",
  })
  @ApiQuery({ name: "date", type: String, example: "2026-04-02" })
  @ApiOkResponse({
    description: "Slot listesi",
    schema: {
      example: {
        date: "2026-04-02",
        timezone: "Asia/Riyadh",
        slots: [
          {
            timeSlot: "11:00 ص",
            durationMinutes: 60,
            startsAt: "2026-04-02T08:00:00.000Z",
            available: true,
          },
        ],
      },
    },
  })
  @ApiBadRequestResponse({ description: "date parametresi geçersiz" })
  async getAvailable(
    @Query() query: Record<string, string>,
  ): Promise<unknown> {
    const parsed = availableQuerySchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.bookingsService.getAvailableSessions(parsed.data.date);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("booking_token")
  @ApiOperation({
    summary: "Oturum rezerve et",
    description:
      "JWT gerekli. userId istemciden alınmaz; oturumdaki kullanıcıya yazılır.",
  })
  @ApiBody({ type: CreateBookingDto })
  @ApiUnauthorizedResponse({ description: "Giriş yapılmamış" })
  @ApiOkResponse({
    description: "Oluşturulan rezervasyon",
    schema: {
      example: {
        success: true,
        message: "تم حجز الجلسة بنجاح.",
        id: "550e8400-e29b-41d4-a716-446655440000",
        startsAt: "2026-04-02T08:00:00.000Z",
        endsAt: "2026-04-02T09:00:00.000Z",
        timeSlotLabel: "11:00 ص",
      },
    },
  })
  @ApiNotFoundResponse({ description: "Bilinmeyen slot etiketi" })
  @ApiConflictResponse({ description: "Slot dolu" })
  async create(
    @Body() body: unknown,
    @CurrentUser() user: RequestUser,
  ): Promise<unknown> {
    const parsed = createBookingInputSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    return this.bookingsService.createBooking({
      ...parsed.data,
      userId: user.userId,
    });
  }
}
