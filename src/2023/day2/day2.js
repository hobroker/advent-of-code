import { read } from '../../../lib/read.js';
import {
  all,
  applySpec,
  compose,
  filter,
  fromPairs,
  head,
  last,
  map,
  match,
  max,
  multiply,
  prop,
  reduce,
  reverse,
  split,
  sum,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(
  map(
    applySpec({
      id: compose(Number, head, match(/(?<=Game)(.*?)(?=:)/)),
      sets: compose(
        map(
          compose(
            fromPairs,
            map(
              compose(
                ([color, value]) => [color, Number(value)],
                reverse,
                split(' '),
              ),
            ),
            split(', '),
          ),
        ),
        split('; '),
        last,
        split(': '),
      ),
    }),
  ),
  split('\n'),
);

const part1 = compose(
  sum,
  map(prop('id')),
  filter(
    compose(
      all(Boolean),
      map(set => !(set.red > 12 || set.green > 13 || set.blue > 14)),
      prop('sets'),
    ),
  ),
  prepare,
);

const maxOf = color => compose(reduce(max, -Infinity), map(prop(color)));

const part2 = compose(
  sum,
  map(
    compose(
      reduce(multiply, 1),
      Object.values,
      applySpec({
        red: maxOf('red'),
        green: maxOf('green'),
        blue: maxOf('blue'),
      }),
    ),
  ),
  map(prop('sets')),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
