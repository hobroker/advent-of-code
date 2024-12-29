import { read } from '../../../lib/read.js';
import {
  always,
  applySpec,
  compose,
  curry,
  head,
  juxt,
  last,
  map,
  match,
  multiply,
  nth,
  prop,
  range,
  reduce,
  slice,
  sort,
  split,
  subtract,
  tail,
  takeLast,
} from 'ramda';

const data = read('input.txt');

const evaluate = expression => Function(`return ${expression}`)();
const matchNumbers = compose(map(Number), match(/(\d+)/g));
const calculateSupermod = reduce((acc, { mod }) => acc * mod, 1);
const prepare = compose(
  map(
    compose(
      applySpec({
        items: compose(matchNumbers, nth(0)),
        operation: compose(last, match(/ = (.*)/), nth(1)),
        mod: compose(head, matchNumbers, nth(2)),
        test: compose(
          ([mod, truthy, falsy]) =>
            value =>
              value % mod === 0 ? truthy : falsy,
          juxt([
            compose(head, matchNumbers, nth(0)),
            compose(head, matchNumbers, nth(1)),
            compose(head, matchNumbers, nth(2)),
          ]),
          slice(2, 5),
        ),
        inspected: always(0),
      }),
      tail,
      split('\n'),
    ),
  ),
  split('\n\n'),
);

const round = (divide, supermod, monkeys) =>
  monkeys.forEach(monkey => {
    const { items, operation, test } = monkey;
    items.forEach(item => {
      let worry = evaluate(operation.replaceAll('old', item % supermod));
      if (divide) {
        worry = Math.floor(worry / 3);
      }
      monkeys[test(worry)].items.push(worry);
    });
    monkey.inspected += items.length;
    monkey.items = [];
  });

const play = curry((divide, rounds, monkeys) => {
  const supermod = calculateSupermod(monkeys);
  range(0, rounds).map(() => round(divide, supermod, monkeys));
  return monkeys;
});

const result = compose(
  reduce(multiply, 1),
  takeLast(2),
  sort(subtract),
  map(prop('inspected')),
);
const part1 = compose(result, play(true, 20), prepare);
const part2 = compose(result, play(false, 10000), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
