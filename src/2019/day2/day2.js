import { compose, curry, map, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(Number), split(','));

const resolve = curry((noun, verb, original) => {
  const ints = [...original];
  ints[1] = noun;
  ints[2] = verb;
  for (let i = 0; i < ints.length; i += 4) {
    const int = ints[i];
    const a = ints[ints[i + 1]];
    const b = ints[ints[i + 2]];
    const c = ints[i + 3];
    if (int === 1) ints[c] = a + b;
    else if (int === 2) ints[c] = a * b;
    else break;
  }
  return ints[0];
});

const part1 = compose(resolve(12, 2), prepare);

const part2 = compose(ints => {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (resolve(noun, verb, ints) === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
}, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
