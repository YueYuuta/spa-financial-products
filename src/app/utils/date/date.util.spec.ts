import { DateUtils } from './date.util';

describe('DateUtils', () => {
  it('should convert ISO date to YYYY-MM-DD format', () => {
    expect(DateUtils.toDateInputFormat('2025-02-23T00:00:00Z')).toBe(
      '2025-02-23'
    );
  });

  it('should return an empty string for invalid date input', () => {
    expect(DateUtils.toDateInputFormat(null)).toBe('');
  });

  it('should convert YYYY-MM-DD to UTC ISO string', () => {
    expect(DateUtils.toUTCDateString('2025-02-23')).toBe(
      '2025-02-23T00:00:00.000Z'
    );
  });

  it('should return an empty string for invalid date format', () => {
    expect(DateUtils.toUTCDateString('23-02-2025')).toBe('');
  });

  it('should calculate revision date one year ahead', () => {
    expect(DateUtils.calculateRevisionDate('2025-02-23')).toBe('2026-02-23');
  });
  it('Debe devolver una cadena vacía si el formato de fecha no es válido', () => {
    expect(DateUtils.calculateRevisionDate('2023X13-01')).toBe(''); // Mes inválido
  });

  //   it('should return true if date is today or in the future', () => {
  //     const today = new Date().toISOString().split('T')[0];
  //     expect(DateUtils.isFutureOrToday(today)).toBe(true);
  //   });

  //   it('should return false if date is in the past', () => {
  //     expect(DateUtils.isFutureOrToday('2020-01-01')).toBe(false);
  //   });
});
