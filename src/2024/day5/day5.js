import { read } from '../../../lib/read.js';
import {
  __,
  applySpec,
  compose,
  curry,
  head,
  last,
  map,
  prop,
  reduce,
  split,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(
  applySpec({
    rules: compose(
      reduce((acc, [a, b]) => ({ ...acc, [a]: { ...acc[a], [b]: true } }), {}),
      map(compose(map(Number), split('|'))),
      split('\n'),
      head,
    ),
    updates: compose(map(compose(map(Number), split(','))), split('\n'), last),
  }),
  split('\n\n'),
);

const sumMiddlePages = reduce(
  (acc, pages) => acc + pages[Math.floor(pages.length / 2)],
  0,
);

const part1 = compose(
  sumMiddlePages,
  ({ rules, updates }) =>
    updates.filter(pages =>
      pages.every((page, index) =>
        pages.slice(index + 1).every(prop(__, rules[page])),
      ),
    ),
  prepare,
);

const arrange = curry((rules, pages) =>
  pages.some((page, i) =>
    pages.slice(i + 1).some((nextPage, j) => {
      if (!rules[page]?.[nextPage]) {
        [pages[i], pages[i + 1 + j]] = [nextPage, page];
        arrange(rules, pages);
        return true;
      }
      return false;
    }),
  ),
);

const part2 = compose(
  sumMiddlePages,
  ({ rules, updates }) => updates.filter(arrange(rules)),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
