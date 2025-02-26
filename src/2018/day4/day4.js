import {
  compose,
  concat,
  evolve,
  includes,
  juxt,
  map,
  mapObjIndexed,
  match,
  nth,
  prop,
  range,
  slice,
  sort,
  sortBy,
  split,
  toPairs,
  when,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    evolve({
      0: date => date.getMinutes(),
    }),
  ),
  sortBy(nth(0)),
  map(
    compose(
      juxt([
        compose(string => new Date(string), concat('2000-'), nth(0)),
        compose(
          when(includes('begins shift'), compose(nth(0), match(/\d+/))),
          nth(1),
        ),
      ]),
      slice(1, Infinity),
      match(/\[\d+-(.*)\] (.*)/),
    ),
  ),
  split('\n'),
);

const mostFrequent = arr => {
  const occ = {};
  let maxCount = 0;
  let res = null;
  for (const x of arr) {
    occ[x] = (occ[x] || 0) + 1;
    if (occ[x] > maxCount) {
      maxCount = occ[x];
      res = x;
    }
  }

  return [res, occ[res]];
};

const parse = logs => {
  const guards = {};
  const times = {};
  let active = null;
  let asleepMinute = 0;
  for (const [minute, action] of logs) {
    if (action === 'falls asleep') {
      asleepMinute = minute;
    } else if (action === 'wakes up') {
      guards[active].push(...range(asleepMinute, minute));
      times[active] += minute - asleepMinute;
    } else {
      active = action;
      guards[active] ||= [];
      times[active] ||= 0;
    }
  }
  return { guards, times };
};

const part1 = compose(
  ({ guards, times }) => {
    const [[guardId]] = toPairs(times).sort(([, a], [, b]) => b - a);
    const [minute] = mostFrequent(guards[guardId]);
    return guardId * minute;
  },
  parse,
  prepare,
);

const part2 = compose(
  ([[guardId, [minute]]]) => guardId * minute,
  sort(([, [, a]], [, [, b]]) => b - a),
  toPairs,
  mapObjIndexed(mostFrequent),
  prop('guards'),
  parse,
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
