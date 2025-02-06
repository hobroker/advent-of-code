import {
  compose,
  curry,
  ifElse,
  map,
  match,
  pick,
  prop,
  reduce,
  slice,
  split,
  startsWith,
  subtract,
  toPairs,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      slice(1, Infinity),
      ifElse(
        startsWith('value'),
        match(/value (\d+) goes to bot (\d+)/),
        match(/bot (\d+) gives low to (.*) (\d+) and high to (.*) (\d+)/),
      ),
    ),
  ),
  split('\n'),
);

const run = curry((spy, steps) => {
  const registry = { bot: {}, output: {}, spy: null };
  const set = (type, index, value) => {
    registry[type][index] =
      type === 'bot' ? [...(registry[type][index] || []), value] : value;
  };
  while (steps.length) {
    const item = steps.shift();
    if (item[2] === undefined) {
      set('bot', item[1], item[0]);
      continue;
    }
    const [fromBot, lowToType, lowToIndex, highToType, highToIndex] = item;
    if (registry.bot[fromBot]?.length !== 2) {
      steps.push(item);
      continue;
    }
    const [lowValue, highValue] = registry.bot[fromBot].sort(subtract);
    if (lowValue === spy[0] && highValue === spy[1]) {
      registry.spy = fromBot;
    }
    registry.bot[fromBot] = [];
    set(lowToType, lowToIndex, lowValue);
    set(highToType, highToIndex, highValue);
  }
  return registry;
});

const part1 = compose(prop('spy'), run(['17', '61']), prepare);

const part2 = compose(
  reduce((acc, [, item]) => acc * item, 1),
  toPairs,
  pick([0, 1, 2]),
  prop('output'),
  run([]),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
