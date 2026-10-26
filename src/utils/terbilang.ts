/**
 * Converts numbers into Indonesian spelled-out words (Terbilang)
 * Example: 585000 -> "Lima Ratus Delapan Puluh Lima Ribu Rupiah"
 */
export function angkaTerbilang(nominal: number): string {
  const bilangan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  function toWords(n: number): string {
    const num = Math.floor(n);
    if (num < 12) {
      return bilangan[num];
    } else if (num < 20) {
      return `${toWords(num - 10)} Belas`;
    } else if (num < 100) {
      const rest = num % 10;
      return `${toWords(Math.floor(num / 10))} Puluh${rest > 0 ? ' ' + toWords(rest) : ''}`;
    } else if (num < 200) {
      const rest = num - 100;
      return `Seratus${rest > 0 ? ' ' + toWords(rest) : ''}`;
    } else if (num < 1000) {
      const rest = num % 100;
      return `${toWords(Math.floor(num / 100))} Ratus${rest > 0 ? ' ' + toWords(rest) : ''}`;
    } else if (num < 2000) {
      const rest = num - 1000;
      return `Seribu${rest > 0 ? ' ' + toWords(rest) : ''}`;
    } else if (num < 1000000) {
      const rest = num % 1000;
      return `${toWords(Math.floor(num / 1000))} Ribu${rest > 0 ? ' ' + toWords(rest) : ''}`;
    } else if (num < 1000000000) {
      const rest = num % 1000000;
      return `${toWords(Math.floor(num / 1000000))} Juta${rest > 0 ? ' ' + toWords(rest) : ''}`;
    } else if (num < 1000000000000) {
      const rest = num % 1000000000;
      return `${toWords(Math.floor(num / 1000000000))} Miliar${rest > 0 ? ' ' + toWords(rest) : ''}`;
    } else {
      return num.toString();
    }
  }

  const clean = Math.max(0, Math.round(nominal));
  if (clean === 0) return 'Nol Rupiah';
  return `${toWords(clean).trim()} Rupiah`;
}
