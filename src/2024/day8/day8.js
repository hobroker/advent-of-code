import { read } from '../../../lib/read.js';
import { compose, curry, map, reduce, split, test } from 'ramda';

const data = read('input.txt');

const prepare = compose(map(split('')), split('\n'));

const radiateAntenna = (matrix, from, diff, direction, max) => {
  let count = 0;
  let next = {
    x: from.x + direction * diff.x,
    y: from.y + direction * diff.y,
  };

  while (matrix[next.x]?.[next.y] && count++ < max) {
    matrix[next.x][next.y] = '#';
    next.x += direction * diff.x;
    next.y += direction * diff.y;
  }
};

const radiate = curry((max, matrix) => {
  const plot = matrix.reduce((acc, row, x) => {
    row.forEach((cell, y) => {
      if (cell === '.') return;
      (acc[cell] ||= []).push({ x, y });
    });
    return acc;
  }, {});
  Object.values(plot).forEach(coordinates =>
    coordinates
      .flatMap((from, i) => coordinates.slice(i + 1).map(to => ({ from, to })))
      .forEach(({ from, to }) => {
        const diff = { x: to.x - from.x, y: to.y - from.y };

        radiateAntenna(matrix, from, diff, -1, max);
        radiateAntenna(matrix, to, diff, 1, max);
      }),
  );
  return matrix;
});

const countChars = regex =>
  reduce((acc, row) => acc + row.filter(test(regex)).length, 0);

const part1 = compose(countChars(/#/), radiate(1), prepare);

const part2 = compose(countChars(/[^.]/), radiate(Infinity), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
