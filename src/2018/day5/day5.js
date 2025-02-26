import { compose, last, length, min, reduce, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = split('');

const canReact = (a, b) => a !== b && a.toLowerCase() === b.toLowerCase();

const react = input => {
  const stack = [];
  input.forEach(char => {
    if (!stack.length || !canReact(last(stack), char)) {
      stack.push(char);
    } else {
      stack.pop();
    }
  });
  return stack;
};

const part1 = compose(length, react, prepare);

const part2 = compose(
  reduce(min, Infinity),
  units => {
    const chars = new Set();
    for (const char of units) {
      chars.add(char.toLowerCase());
    }
    const results = [];
    for (const char of chars) {
      const result = react(units.filter(item => item.toLowerCase() !== char));
      results.push(result.length);
    }
    return results;
  },
  react,
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
