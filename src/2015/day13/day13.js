import {
  applySpec,
  compose,
  curry,
  identity,
  map,
  match,
  max,
  reduce,
  slice,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const toGraph = list =>
  list.reduce((acc, [from, op, amount, to]) => {
    const value = op === 'gain' ? +amount : -1 * amount;
    const prev = acc[from]?.[to] || 0;
    return {
      ...acc,
      [from]: { ...acc[from], [to]: prev + value },
      [to]: { ...acc[to], [from]: prev + value },
    };
  }, {});

const generatePermutations = graph =>
  Object.keys(graph).reduce(function permute(res, item, key, arr) {
    return res.concat(
      (arr.length > 1 &&
        arr
          .slice(0, key)
          .concat(arr.slice(key + 1))
          .reduce(permute, [])
          .map(perm => [item].concat(perm))) ||
        item,
    );
  }, []);

const prepare = compose(
  applySpec({
    graph: identity,
    permutations: generatePermutations,
  }),
  toGraph,
  map(compose(slice(1, 5), match(/(.*) would (.*) (\d+) .*to (.*)./))),
  split('\n'),
);

const countMaxHappiness = curry((sliceUntil, { graph, permutations }) => {
  const keys = Object.keys(graph);
  return permutations.map(permutation =>
    permutation.slice(0, sliceUntil).reduce((acc, from, i) => {
      const to = permutation[(i + 1) % keys.length];
      return acc + graph[from][to];
    }, 0),
  );
});

const part1 = compose(
  reduce(max, -Infinity),
  countMaxHappiness(Infinity),
  prepare,
);

const part2 = compose(reduce(max, -Infinity), countMaxHappiness(-1), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
