import { compose, times } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = Number;

const manhattan = value => {
  const spiral = Math.sqrt(value / 4) - 0.5;
  const spiralNum = Math.ceil(spiral);
  const [distance, isNegFromCenter] = getDistance(spiral % 1);
  let offset = 8 * spiralNum * distance;
  if (isNegFromCenter) offset = Math.ceil(offset);

  return Math.floor(spiralNum + offset);
};

const getDistance = spiral => {
  const centers = times(i => 0.125 + i * 0.25, 4);
  for (const i in centers) {
    const distI = Math.abs(spiral - centers[i]);
    if (distI <= 0.125) return [distI, spiral < centers[i]];
  }

  throw new Error('Invalid spiral');
};

const part1 = compose(manhattan, prepare);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
