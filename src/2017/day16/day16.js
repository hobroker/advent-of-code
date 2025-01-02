import {
  __,
  always,
  applySpec,
  compose,
  converge,
  identity,
  indexOf,
  join,
  prop,
  reduce,
  split,
  swap,
  times,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  applySpec({
    programs: always(
      times(i => String.fromCharCode(97 + i), data.length > 25 ? 16 : 5), // 5 for example, 16 for actual input
    ),
    steps: identity,
  }),
  split(','),
);

const loop = converge(
  reduce((copy, action) => {
    if (action.startsWith('s')) {
      const [value] = action.match(/\d+/);
      const size = -1 * value;
      return [...copy.slice(size), ...copy.slice(0, size)];
    }
    const [a, b] = action.startsWith('x')
      ? action.match(/\d+/g).map(Number)
      : action.slice(1).split('/').map(indexOf(__, copy));
    return swap(a, b, copy);
  }),
  [prop('programs'), prop('steps')],
);

const part1 = compose(join(''), loop, prepare);

const part2 = compose(({ steps, programs }) => {
  const seen = new Set();
  let count = 0;
  let copy = loop({ steps, programs });
  while (true) {
    const identifier = copy.join('');
    if (seen.has(identifier)) {
      return [...seen][(1_000_000_000 % count) - 1];
    }
    seen.add(identifier);
    count++;
    copy = loop({ steps, programs: copy });
  }
}, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
