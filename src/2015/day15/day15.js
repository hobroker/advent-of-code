import {
  applySpec,
  compose,
  curry,
  identity,
  length,
  map,
  match,
  max,
  nth,
  reduce,
  slice,
  split,
  times,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const generateCombinations = curry((length, count) => {
  const array = times(identity, count);
  const results = [];

  const generate = (currentCombo, index, start) => {
    if (index === length) {
      return results.push(
        array.map(item => currentCombo.filter(x => x === item).length),
      );
    }
    for (let i = start; i < array.length; i++) {
      currentCombo[index] = array[i];
      generate(currentCombo, index + 1, i);
    }
  };

  generate(Array(length), 0, 0);
  return results;
});

const prepare = compose(
  applySpec({
    ingredients: identity,
    combinations: compose(generateCombinations(100), length),
  }),
  map(
    compose(
      applySpec({
        name: nth(0),
        capacity: compose(Number, nth(1)),
        durability: compose(Number, nth(2)),
        flavor: compose(Number, nth(3)),
        texture: compose(Number, nth(4)),
        calories: compose(Number, nth(5)),
      }),
      slice(1, Infinity),
      match(/(.*): .* (-?\d+), .* (-?\d+), .* (-?\d+), .* (-?\d+), .* (-?\d+)/),
    ),
  ),
  split('\n'),
);

const reduceAmounts = (ingredients, amounts, property) =>
  amounts.reduce(
    (acc, amount, j) => acc + amount * ingredients[j][property],
    0,
  );

const scoreOf = curry((ingredients, amounts) =>
  ['capacity', 'durability', 'flavor', 'texture'].reduce(
    (acc, property) =>
      Math.max(0, acc * reduceAmounts(ingredients, amounts, property)),
    1,
  ),
);

const part1 = compose(
  reduce(max, 0),
  ({ ingredients, combinations }) => combinations.map(scoreOf(ingredients)),
  prepare,
);

const part2 = compose(
  reduce(max, 0),
  ({ ingredients, combinations }) =>
    combinations.map(amounts => {
      if (reduceAmounts(ingredients, amounts, 'calories') !== 500) return 0;
      return scoreOf(ingredients, amounts);
    }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
