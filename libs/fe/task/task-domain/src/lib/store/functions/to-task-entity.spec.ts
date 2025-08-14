import { toTaskEntity } from './to-task-entity';

// Minimal helpers to build inputs in tests (avoid external type imports)
type TaskDtoApiModelLike = {
  id: unknown;
  startTime: unknown;
  endTime: unknown;
  isActive?: boolean;
  name?: string;
  assignedDevices?: Array<{ id: number; name: string }>;
};

describe('toTaskEntity', () => {
  it('should map all fields correctly for valid ISO date strings', () => {
    const input: TaskDtoApiModelLike = {
      id: 42,
      startTime: '2025-08-09T10:15:00.000Z',
      endTime: '2025-08-09T11:00:00.000Z',
      isActive: true,
      name: 'Morning watering',
      assignedDevices: [{ id: 1, name: 'Garden Valve' }],
    };

    const result = toTaskEntity(input as never);

    expect(result.id).toBe(42);
    expect(result.startTime).toBeInstanceOf(Date);
    expect(result.endTime).toBeInstanceOf(Date);
    expect(result.startTime.toISOString()).toBe('2025-08-09T10:15:00.000Z');
    expect(result.endTime.toISOString()).toBe('2025-08-09T11:00:00.000Z');
    expect(result.isActive).toBe(true);
    expect(result.name).toBe('Morning watering');
    expect(result.homeDevices).toEqual([{ id: 1, name: 'Garden Valve' }]);
  });

  it('should pass through devices as homeDevices when empty array', () => {
    const input: TaskDtoApiModelLike = {
      id: 7,
      startTime: '2025-08-09T00:00:00.000Z',
      endTime: '2025-08-09T01:00:00.000Z',
      isActive: false,
      name: 'Empty devices',
      assignedDevices: [],
    };

    const result = toTaskEntity(input as never);

    expect(Array.isArray(result.homeDevices)).toBe(true);
    expect(result.homeDevices).toHaveLength(0);
  });

  it('should keep homeDevices as undefined when assignedDevices is undefined', () => {
    const input: TaskDtoApiModelLike = {
      id: 8,
      startTime: '2025-08-09T00:00:00.000Z',
      endTime: '2025-08-09T01:00:00.000Z',
      isActive: true,
      name: 'No devices',
      // assignedDevices: undefined
    };

    const result = toTaskEntity(input as never);

    expect(result.homeDevices).toBeUndefined();
  });

  it('should not mutate the input object', () => {
    const input: TaskDtoApiModelLike = {
      id: 99,
      startTime: '2025-08-09T10:00:00.000Z',
      endTime: '2025-08-09T11:00:00.000Z',
      isActive: true,
      name: 'Immutability check',
      assignedDevices: [{ id: 1, name: 'A' }],
    };

    const snapshot = JSON.parse(JSON.stringify(input));
    const result = toTaskEntity(input as never);

    expect(result).toBeTruthy();
    expect(input).toEqual(snapshot); // unchanged
  });

  it('should construct Date from numeric timestamps', () => {
    const start = 1_725_198_900_000; // corresponds to some date in 2025
    const end = start + 3_600_000;

    const input: TaskDtoApiModelLike = {
      id: 1,
      startTime: start,
      endTime: end,
      isActive: true,
      name: 'Numeric timestamps',
      assignedDevices: [{ id: 2, name: 'Pump' }],
    };

    const result = toTaskEntity(input as never);

    expect(result.startTime.getTime()).toBe(start);
    expect(result.endTime.getTime()).toBe(end);
  });

  it('should produce Invalid Date for invalid date strings', () => {
    const input: TaskDtoApiModelLike = {
      id: 2,
      startTime: 'not-a-date',
      endTime: 'also-not-a-date',
      isActive: false,
      name: 'Bad dates',
    };

    const result = toTaskEntity(input as never);

    expect(Number.isNaN(result.startTime.getTime())).toBe(true);
    expect(Number.isNaN(result.endTime.getTime())).toBe(true);
  });

  it('should produce epoch (1970-01-01) when endTime is null (Date(null) => 0)', () => {
    const input: TaskDtoApiModelLike = {
      id: 3,
      startTime: '2025-08-09T10:00:00.000Z',
      endTime: null, // special JS quirk: new Date(null) -> epoch (0)
      isActive: true,
      name: 'Null end',
    };

    const result = toTaskEntity(input as never);

    expect(result.endTime.getTime()).toBe(0);
  });

  it('should produce Invalid Date when startTime is undefined (Date(undefined) => Invalid Date)', () => {
    const input: TaskDtoApiModelLike = {
      id: 4,
      startTime: undefined,
      endTime: '2025-08-09T10:00:00.000Z',
      isActive: false,
      name: 'Undefined start',
    };

    const result = toTaskEntity(input as never);

    expect(Number.isNaN(result.startTime.getTime())).toBe(true);
  });

  it('should carry boolean and string fields as-is even if missing', () => {
    const input = {
      id: 5,
      startTime: '2025-08-09T10:00:00.000Z',
      endTime: '2025-08-09T11:00:00.000Z',
      // isActive: undefined
      // name: undefined
      // assignedDevices: undefined
    } as never;

    const result = toTaskEntity(input);

    expect(result.isActive).toBeUndefined();
    expect(result.name).toBeUndefined();
    expect(result.homeDevices).toBeUndefined();
  });

  it('should NOT coerce id at runtime when id is a string (TS "as number" is not a conversion)', () => {
    const input: TaskDtoApiModelLike = {
      id: '123', // string on purpose
      startTime: '2025-08-09T10:00:00.000Z',
      endTime: '2025-08-09T11:00:00.000Z',
      isActive: true,
      name: 'String id',
    };

    const result = toTaskEntity(input as never);

    // Runtime remains string; if you expect a number, you should convert explicitly in implementation.
    expect(typeof result.id).toBe('string');
    expect(result.id).toBe('123');
  });

  it('should work with minimal object (only required-by-runtime fields present)', () => {
    const input = {
      id: 10,
      startTime: '2025-08-09',
      endTime: '2025-08-10',
    } as never;

    const result = toTaskEntity(input);

    expect(result.id).toBe(10);
    expect(result.startTime).toBeInstanceOf(Date);
    expect(result.endTime).toBeInstanceOf(Date);
  });
});
