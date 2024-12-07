import { read } from '../../../lib/read.js';
import {
  applySpec,
  compose,
  equals,
  filter,
  head,
  last,
  map,
  prop,
  split,
  sum,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(
  map(
    compose(
      applySpec({
        result: compose(Number, head),
        values: compose(map(Number), filter(Boolean), split(' '), last),
      }),
      split(':'),
    ),
  ),
  split('\n'),
);

const combinations = (
  list,
  concatenate = false,
  index = 1,
  result = list[0],
  results = [],
) => {
  if (index === list.length) {
    results.push(result);
    return results;
  }
  combinations(list, concatenate, index + 1, result + list[index], results);
  combinations(list, concatenate, index + 1, result * list[index], results);
  if (concatenate) {
    combinations(
      list,
      concatenate,
      index + 1,
      Number(result + '' + list[index]),
      results,
    );
  }
  return results;
};

const part1 = compose(
  compose(sum, map(prop('result'))),
  filter(({ result, values }) => combinations(values).some(equals(result))),
  prepare,
);

const part2 = compose(
  compose(sum, map(prop('result'))),
  filter(({ result, values }) =>
    combinations(values, true).some(equals(result)),
  ),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
