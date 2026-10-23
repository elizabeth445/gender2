import { eventConfig as event } from '../eventConfig';
const escapeText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const timestamp = (date: string | Date) =>
  new Date(date)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
// Fold by UTF-8 bytes, preserving Cyrillic code points (RFC 5545).
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  let current = '',
    bytes = 0;
  const lines: string[] = [];
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) {
      lines.push(current);
      current = ' ';
      bytes = 1;
    }
    current += char;
    bytes += size;
  }
  return [...lines, current].join('\r\n');
}
export function createCalendar(now = new Date()): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Little Wonder//Invitation//UK',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@little-wonder.local`,
    `DTSTAMP:${timestamp(now)}`,
    `DTSTART:${timestamp(event.startsAt)}`,
    `DTEND:${timestamp(event.endsAt)}`,
    `SUMMARY:${escapeText(event.title + ' — ' + event.parents)}`,
    `LOCATION:${escapeText(event.city + ', ' + (event.address || event.location))}`,
    `DESCRIPTION:${escapeText('Запрошуємо вас розділити радість маленького дива! ' + event.arrivalNote)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ]
    .map(foldLine)
    .join('\r\n');
}
export function downloadCalendar() {
  const url = URL.createObjectURL(
    new Blob([createCalendar()], { type: 'text/calendar;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'malenke-dyvo.ics';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function configuredDirections(): string | null {
  if (!event.address.trim()) return null;
  try {
    const url = new URL(event.directionsUrl);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
