import { applySpec, compose, head, last, map, match, split, tail } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const matchNumbers = compose(map(Number), match(/\d+/g));
const prepare = compose(
  applySpec({
    seeds: compose(matchNumbers, head),
    maps: compose(
      map(compose(map(matchNumbers), split('\n'), last, split(':\n'))),
      tail,
    ),
  }),
  split('\n\n'),
);

const part1 = compose(({ seeds, maps }) => {
  maps.forEach(item => {
    seeds = seeds.map(seed => {
      for (const [destination, source, length] of item) {
        if (seed >= source && seed < source + length) {
          return seed - source + destination;
        }
      }
      return seed;
    });
  });
  return Math.min(...seeds);
}, prepare);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
