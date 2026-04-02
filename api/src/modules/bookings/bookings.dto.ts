import { ApiProperty } from "@nestjs/swagger";

export {
  availableQuerySchema,
  createBookingInputSchema,
  type CreateBookingInput,
} from "@booking/shared";

// ——— Swagger (OpenAPI — dokümantasyon) ———

export class CreateBookingDto {
  @ApiProperty({ example: "2026-04-02" })
  date!: string;

  @ApiProperty({ example: "11:00 ص", description: "Slot etiketi (frontend ile aynı)" })
  timeSlot!: string;
}
