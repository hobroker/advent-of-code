import {
  apply,
  applySpec,
  compose,
  curry,
  evolve,
  gt,
  identity,
  lte,
  map,
  match,
  nth,
  reverse,
  sortBy,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  applySpec({
    boss: identity,
    combinations: compose(sortBy(nth(0)), () =>
      shop.weapons.reduce((acc, weapon) => {
        shop.armor.forEach(armor => {
          shop.rings.forEach(ring1 => {
            shop.rings.forEach(ring2 => {
              if (ring1 !== ring2) {
                acc.push(
                  [weapon, armor, ring1, ring2].reduce((acc, item) => [
                    acc[0] + item[0],
                    acc[1] + item[1],
                    acc[2] + item[2],
                  ]),
                );
              }
            });
          });
        });
        return acc;
      }, []),
    ),
  }),
  map(Number),
  match(/\d+/g),
);

/**
 * @property {number} 0 - The cost of the item.
 * @property {number} 1 - The damage value of the item.
 * @property {number} 2 - The armor value of the item.
 */
const shop = {
  weapons: [
    [8, 4, 0],
    [10, 5, 0],
    [25, 6, 0],
    [40, 7, 0],
    [74, 8, 0],
  ],
  armor: [
    [13, 0, 1],
    [31, 0, 2],
    [53, 0, 3],
    [75, 0, 4],
    [102, 0, 5],
    [0, 0, 0],
  ],
  rings: [
    [25, 1, 0],
    [50, 2, 0],
    [100, 3, 0],
    [20, 0, 1],
    [40, 0, 2],
    [80, 0, 3],
    [0, 0, 0],
  ],
};

const play = curry((boss, [, damage, armor]) => [
  Math.ceil(boss[0] / Math.max(1, damage - boss[2])),
  Math.ceil(100 / Math.max(1, boss[1] - armor)),
]);

const part1 = compose(
  nth(0),
  ({ boss, combinations }) =>
    combinations.find(compose(apply(lte), play(boss))),
  prepare,
);

const part2 = compose(
  nth(0),
  ({ boss, combinations }) => combinations.find(compose(apply(gt), play(boss))),
  evolve({ combinations: reverse }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
