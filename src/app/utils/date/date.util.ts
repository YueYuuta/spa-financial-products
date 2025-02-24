export class DateUtils {
  /**
   * Convierte una fecha en formato string (ISO) a un formato YYYY-MM-DD compatible con inputs tipo date.
   * @param dateString Fecha en formato string o null.
   * @returns Fecha en formato `YYYY-MM-DD` o string vacío si es inválida.
   */
  static toDateInputFormat(dateString?: string | null): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getUTCDate()).padStart(2, '0')}`;
  }

  /**
   * Convierte una fecha en formato `YYYY-MM-DD` a una cadena en formato ISO UTC.
   * @param date Fecha en formato `YYYY-MM-DD`.
   * @returns Fecha en formato `ISO 8601` (UTC) o string vacío si es inválida.
   */
  static toUTCDateString(date: string): string {
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) return '';

    const [year, month, day] = date.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  }

  //   static toUTCDateString(date: string): string {
  //     if (!date) return '';

  //     const [year, month, day] = date.split('-').map(Number);
  //     const utcDate = new Date(Date.UTC(year, month - 1, day)); // ✅ Usar Date.UTC para evitar desfases

  //     return utcDate.toISOString(); // ✅ Devuelve la fecha en formato ISO sin modificaciones
  //   }

  /**
   * Calcula la fecha de revisión sumando un año a la fecha de liberación.
   * @param releaseDate Fecha de liberación en formato `YYYY-MM-DD`.
   * @returns Fecha de revisión en formato `YYYY-MM-DD` o vacío si no es válida.
   */
  static calculateRevisionDate(releaseDate: string): string {
    if (!releaseDate.match(/^\d{4}-\d{2}-\d{2}$/)) return '';

    const [year, month, day] = releaseDate.split('-').map(Number);
    return `${year + 1}-${String(month).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
  }

  /**
   * Valida si una fecha es mayor o igual a la actual.
   * @param date Fecha en formato `YYYY-MM-DD`.
   * @returns `true` si es válida, `false` si es anterior a la actual.
   */
  //   static isFutureOrToday(date: string): boolean {
  //     if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

  //     const selectedDate = new Date(date);
  //     selectedDate.setHours(0, 0, 0, 0);
  //     console.log(
  //       '🚀 ~ DateUtils ~ isFutureOrToday ~ selectedDate:',
  //       selectedDate
  //     );
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);
  //     console.log('🚀 ~ DateUtils ~ isFutureOrToday ~ today:', today);

  //     return selectedDate >= today;
  //   }
}
