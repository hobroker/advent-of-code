import { compose, identity } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = identity;

const nextPassword = input => {
  while (true) {
    input = input.replace(
      /([a-y])(z*)$/,
      (_, p1, p2) =>
        String.fromCharCode(p1.charCodeAt(0) + 1) + 'a'.repeat(p2.length),
    );
    if (
      /i|o|l/.test(input) ||
      new Set(input.match(/(.)\1/g)).size < 2 ||
      !Array.from(input.slice(0, -2)).some(
        (_, i) =>
          input.charCodeAt(i + 2) - input.charCodeAt(i + 1) === 1 &&
          input.charCodeAt(i + 1) - input.charCodeAt(i) === 1,
      )
    )
      continue;

    return input;
  }
};

const part1 = compose(nextPassword, prepare);

const part2 = compose(nextPassword, nextPassword, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
