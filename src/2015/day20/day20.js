import { compose } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = Number;

const sumOfDivisors = n => {
  let sum = 0;
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      sum += i;
      if (i !== n / i) sum += n / i;
    }
  }
  return sum;
};

const part1 = compose(value => {
  const max = value / 10;
  for (let number = 1; number <= max; number++) {
    if (sumOfDivisors(number) >= max) {
      return number;
    }
  }
  return -1;
}, prepare);

const part2 = compose(value => {
  const max = value / 11;
  const houses = [];
  let i = 0;

  while (++i) {
    houses[i] = houses[i] || 0;

    if (houses[i] + i >= max) {
      return i;
    }

    for (let j = i; j <= i * 50; j += i) {
      houses[j] = (houses[j] || 0) + i;
    }
  }
}, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
