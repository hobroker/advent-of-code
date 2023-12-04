import { read } from '../../../lib/read.js';
import {
  add,
  applySpec,
  compose,
  equals,
  filter,
  findIndex,
  flatten,
  head,
  invoker,
  last,
  map,
  min,
  reduce,
  split,
  toPairs,
} from 'ramda';

const data = read('input.txt');

const toCode = invoker(1, 'charCodeAt')(0);
const parseGraph = compose(flatten, map(compose(map(toCode), split(''))));
const findPoint = (char) => findIndex(equals(toCode(char)));
const findGraphStartEnd = applySpec({
  start: findPoint('S'),
  end: findPoint('E'),
});
const bfs = ({ graph, rowLength, start, end }) => {
  let queue = [[start, 0]];
  const visited = new Set([start]);
  while (queue.length) {
    const [position, steps] = queue.shift();
    if (position === end) {
      return steps;
    }
    queue = queue.concat(
      [rowLength, -rowLength, 1, -1]
        .map(add(position))
        .filter((p) => graph[p] <= graph[position] + 1)
        .filter((c) => !visited.has(c))
        .map((c) => {
          visited.add(c);
          return [c, steps + 1];
        }),
    );
  }
  return Number.MAX_SAFE_INTEGER;
};

const parse = (input) => {
  const rows = input.split('\n');
  const rowLength = rows[0].length;
  const graph = parseGraph(rows);
  const { start, end } = findGraphStartEnd(graph);

  graph[start] = toCode('a');
  graph[end] = toCode('z');

  return { rowLength, graph, start, end };
};

const findStartPoints = compose(
  map(head),
  filter(compose(equals(toCode('a')), last)),
  toPairs,
);

const prepare = parse;
const part1 = compose(bfs, prepare);
const part2 = compose(
  reduce(min, Infinity),
  ({ graph, ...rest }) =>
    findStartPoints(graph).map((start) => bfs({ graph, ...rest, start })),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
