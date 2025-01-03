import { compose, curry } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(JSON.parse);

const deepSum = curry((ingore, obj) => {
  if (typeof obj === 'string') return 0;
  if (typeof obj === 'number') return obj;
  if (Array.isArray(obj))
    return obj.reduce((acc, item) => acc + deepSum(ingore, item), 0);
  if (ingore && Object.values(obj).includes('red')) return 0;
  return Object.values(obj).reduce(
    (acc, item) => acc + deepSum(ingore, item),
    0,
  );
});

const part1 = compose(deepSum(''), prepare);

const part2 = compose(deepSum('red'), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
