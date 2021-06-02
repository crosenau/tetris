import parseMilliseconds from 'parse-ms';

export function digitalTime(ms) {
  const { minutes, seconds, milliseconds } = parseMilliseconds(ms);

  const newMin = minutes.toString().padStart(2, '0');
  const newSec = seconds.toString().padStart(2, '0');
  const newMs = milliseconds.toString().padStart(3, '0');

  return `${newMin}:${newSec}.${newMs}`
}