import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PushSubscription } from 'web-push';

export class PushSubscriptionRequest implements PushSubscription {
  @IsNotEmpty()
  @ApiProperty()
  public endpoint!: string;

  @ApiProperty()
  @IsNotEmpty()
  public keys!: { p256dh: string; auth: string };
}
