import { compose, curry, identity } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = identity;

const explode = curry((onBracket, input) => {
  let length = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i].startsWith('(')) {
      const [bracket, ...rest] = input.substr(i).match(/^\((\d+)x(\d+)\)/);
      const [count, times] = rest.map(Number);
      const sub = input.substr(i + bracket.length, count);
      length += onBracket(onBracket, sub) * times;
      i += bracket.length + count - 1;
    } else {
      length++;
    }
  }
  return length;
});

const part1 = compose(
  explode((_, string) => string.length),
  prepare,
);

const part2 = compose(explode(explode), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
