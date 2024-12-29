import { compose, map, propEq, reduce, split, sum, times } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(split(','));

const hash = compose(
  reduce((value, char) => ((value + char.charCodeAt(0)) * 17) % 256, 0),
  split(''),
);

const part1 = compose(sum, map(hash), prepare);

const part2 = compose(
  sum,
  hashmap =>
    hashmap.flatMap((box, i) =>
      box.map(({ focal }, j) => (i + 1) * (j + 1) * focal),
    ),
  operations => {
    const slots = times(() => [], 256);
    operations.forEach(({ focal, label, op }) => {
      const box = slots[hash(label)];
      const index = box.findIndex(propEq(label, 'label'));
      if (op === '-') {
        if (index >= 0) box.splice(index, 1);
        return;
      }
      if (index < 0) box.push({ focal, label });
      else box[index] = { focal, label };
    });
    return slots;
  },
  map(item => {
    const [label, focal] = item.split(/[-=]/);
    return focal ? { op: '=', label, focal: +focal } : { op: '-', label };
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
