import { compose, curry, split, times } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(split(''));
const directionsMap = {
  '^': [-1, 0],
  v: [1, 0],
  '>': [0, 1],
  '<': [0, -1],
};

const deliver = curry((santas, directions) => {
  const positions = times(() => [0, 0], santas);
  const houses = new Set([positions[0].join('x')]);
  directions.forEach((item, i) => {
    const position = positions[i % santas];
    const [x, y] = directionsMap[item];
    position[0] += x;
    position[1] += y;
    houses.add(position.join('x'));
  });
  return houses.size;
});

const part1 = compose(deliver(1), prepare);
const part2 = compose(deliver(2), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
