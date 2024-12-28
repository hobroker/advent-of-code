import {
  applySpec,
  compose,
  evolve,
  head,
  last,
  map,
  match,
  split,
  tail,
} from 'ramda';
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

const part2 = compose(
  ({ seeds, maps }) => {
    let copy = [...seeds.map(seed => [...seed])];
    for (let map of maps) {
      const moved = [];
      for (const [destination, source, length] of map) {
        const unmoved = [];
        for (const [start, end] of copy) {
          if (start < source + length && end >= source) {
            moved.push([
              Math.max(start, source) - source + destination,
              Math.min(end, source + length - 1) - source + destination,
            ]);
          }
          if (start < source) {
            unmoved.push([start, Math.min(end, source - 1)]);
          }
          if (end >= source + length) {
            unmoved.push([Math.max(start, source + length), end]);
          }
        }
        copy = unmoved;
      }
      copy.push(...moved);
    }
    return Math.min(...copy.flat());
  },
  evolve({
    seeds: seeds => {
      const nextSeeds = [];
      for (let i = 0; i < seeds.length; i += 2) {
        nextSeeds.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
      }
      return nextSeeds;
    },
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
