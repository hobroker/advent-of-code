import { read } from '../../../lib/read.js';
import { compose, join, map, split } from 'ramda';

const data = read('input.txt');

const checkpoints = [20, 60, 100, 140, 180, 220];

const prepare = compose(map(split(' ')), split('\n'));
const parse = (instructions) => {
  let cycle = 1;
  let x = 1;
  return instructions.reduce((acc, [command, arg]) => {
    let prevX = x;
    if (command === 'noop') {
      cycle++;
    } else {
      x += Number(arg);
      cycle += 2;
    }

    if (checkpoints[0] === cycle) {
      acc += x * checkpoints[0];
      checkpoints.shift();
    } else if (checkpoints[0] === cycle - 1) {
      acc += prevX * checkpoints[0];
      checkpoints.shift();
    }
    return acc;
  }, 0);
};

const render = (instructions) => {
  let crt = new Array(6).fill('');
  let cycle = 0;
  let x = 1;
  instructions.forEach(([command, arg]) => {
    let line = Math.floor(cycle / 40);
    let index = cycle % 40;
    crt[line] += Math.abs(index - x) <= 1 ? '#' : '.';
    cycle++;
    if (command === 'addx') {
      line = Math.floor(cycle / 40);
      index = cycle % 40;
      crt[line] += Math.abs(index - x) <= 1 ? '#' : '.';
      cycle++;
      x += Number(arg);
    }
  });

  return crt;
};

const part1 = compose(parse, prepare);
const part2 = compose(join('\n'), render, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
