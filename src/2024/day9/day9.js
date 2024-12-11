import { read } from '../../../lib/read.js';
import {
  addIndex,
  chain,
  compose,
  flatten,
  identity,
  map,
  reduce,
  split,
} from 'ramda';

const data = read('input.txt');

const prepare = fn =>
  compose(
    addIndex(fn)((item, index) =>
      Array(item).fill(index % 2 ? '.' : `${index / 2}`),
    ),
    map(Number),
    split(''),
  );

const checksum = addIndex(reduce)(
  (acc, item, index) => acc + (isNaN(item) ? 0 : item) * index,
  0,
);

const lastNonDotElement = list => {
  while (list.length > 0) {
    let item = list.pop();
    if (item !== '.') return item;
  }
};

const part1 = compose(
  checksum,
  list => list.flatMap(item => [item !== '.' ? item : lastNonDotElement(list)]),
  prepare(chain),
);

const part2 = compose(
  checksum,
  flatten,
  disk => {
    const diskCopy = disk.map(map(identity));
    for (let i = disk.length - 1; i >= 0; i--) {
      if (disk[i][0] === '.') continue;
      const block = disk[i];
      const [item] = block;
      for (let j = 0; j < diskCopy.length && item !== diskCopy[j][0]; j++) {
        const size = diskCopy[j].length - block.length;
        if (diskCopy[j][0] !== '.' || size < 0) continue;
        const nextIndex = diskCopy.findIndex(([file]) => file === item);
        diskCopy[nextIndex] = diskCopy[nextIndex].fill('.');
        diskCopy.splice(
          j,
          1,
          block,
          ...(size > 0 ? [diskCopy[j].slice(0, size)] : []),
        );
        break;
      }
    }
    return diskCopy;
  },
  prepare(map),
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
