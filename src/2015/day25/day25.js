import { compose, map, match } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(Number), match(/\d+/g));

const getCodeCount = ([row, col]) => {
  const n = row + col - 2;
  return (n * (n + 1)) / 2 + col;
};

const part1 = compose(coords => {
  let codeCount = getCodeCount(coords);
  let code = 20151125;
  while (--codeCount) code = (code * 252533) % 33554393;
  return code;
}, prepare);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
