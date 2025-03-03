import { compose, join, map, match, slice, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      slice(1, Infinity),
      match(/step (\w) must be finished before step (\w) can begin./i),
    ),
  ),
  split('\n'),
);

const findNext = (steps, done = []) => {
  const next = [];
  for (const key in steps) {
    if (done.includes(key)) continue;
    const values = steps[key];
    if (values.every(key => done.includes(key))) {
      next.push(key);
      steps[key] = [];
    }
  }
  return next.sort();
};

const part1 = compose(
  join(''),
  steps => {
    const done = [];
    const queue = Object.entries(steps).flatMap(([key, value]) =>
      !value.length ? [key] : [],
    );
    const seen = new Set();
    while (queue.length) {
      const item = queue.shift();
      if (seen.has(item)) continue;
      seen.add(item);
      done.push(item);
      const next = findNext(steps, [...done, item]);
      queue.push(...next);
      queue.sort();
    }
    return done;
  },
  steps => {
    const dict = {};
    steps.forEach(([dependency, step]) => {
      if (!dict[step]) dict[step] = [];
      if (!dict[dependency]) dict[dependency] = [];
      dict[step].push(dependency);
    });
    return dict;
  },
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
