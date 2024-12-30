import {
  always,
  applySpec,
  compose,
  equals,
  evolve,
  filter,
  fromPairs,
  head,
  ifElse,
  juxt,
  length,
  map,
  slice,
  split,
  tail,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const matchBetween = (start, end) => string =>
  string.match(new RegExp(`${start}(.*)${end}`, ''))[1];
const matchInstruction = evolve({
  0: compose(Number, matchBetween('value ', '.')),
  1: compose(
    ifElse(equals('left'), always(-1), always(1)),
    matchBetween('the ', '.'),
  ),
  2: matchBetween('state ', '.'),
});
const prepare = compose(
  applySpec({
    initial: compose(
      applySpec({
        state: compose(matchBetween('state ', '.')),
        steps: compose(Number, matchBetween('after ', ' ')),
      }),
      head,
    ),
    instructions: compose(
      fromPairs,
      map(
        compose(
          juxt([
            compose(matchBetween('state ', ':'), head),
            juxt([
              compose(matchInstruction, slice(2, 5)),
              compose(matchInstruction, slice(6, Infinity)),
            ]),
          ]),
          split('\n'),
        ),
      ),
      tail,
    ),
  }),
  split('\n\n'),
);

const part1 = compose(
  length,
  filter(Boolean),
  ({ initial, instructions }) => {
    let { state } = initial;
    const tape = Array(initial.steps).fill(0);
    let position = tape.length / 2;
    for (let i = 0; i < initial.steps; i++) {
      const [write, move, next] = instructions[state][tape[position]];
      tape[position] = write;
      position += move;
      state = next;
    }
    return tape;
  },
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
