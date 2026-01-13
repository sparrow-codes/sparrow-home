import { Column, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'device_last_state' })
export class DeviceLastState {
  @PrimaryColumn({ type: 'varchar', name: 'device_id' })
  public deviceId!: string;

  @Column({ type: 'jsonb' })
  public state!: Record<string, unknown>;

  @Column({ type: 'text', nullable: true, name: 'state_hash' })
  public stateHash!: string | null;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', default: new Date() })
  @Index('idx_device_last_state_updated_at')
  public updatedAt!: Date;
}
