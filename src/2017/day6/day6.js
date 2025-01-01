import { compose, map, prop, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const redistribute = banks => {
  let loop = 0;
  const seen = {};
  while (true) {
    const identifier = banks.join(' ');
    if (seen[identifier]) {
      return {
        loop,
        size: loop - seen[identifier],
      };
    }
    seen[identifier] = loop;

    loop++;
    let index = banks.reduce(
      (index, value, i) => (banks[index] < value ? i : index),
      0,
    );
    let share = banks[index];
    banks[index] = 0;
    while (share) {
      const next = ++index % banks.length;
      banks[next]++;
      share--;
    }
  }
};

const prepare = compose(redistribute, map(Number), split(/\s+/));

const part1 = compose(prop('loop'), prepare);

const part2 = compose(prop('size'), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
