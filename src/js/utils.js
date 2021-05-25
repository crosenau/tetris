import parseMilliseconds from 'parse-ms';

export function digitalTime(ms) {
  const { minutes, seconds, milliseconds } = parseMilliseconds(ms);
  let time = '';

  for (let unit of [minutes, seconds, milliseconds]) {
    if (unit < 10) {
      time += `0${unit}:`
    } else {
      time += `${unit}:`;
    }
  }

  return time
    .replace(/:$/, '')
    .replace(/00$/, '0');
}