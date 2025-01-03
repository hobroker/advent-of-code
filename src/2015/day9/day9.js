import {
  compose,
  evolve,
  map,
  match,
  max,
  min,
  reduce,
  slice,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const toGraph = list =>
  list.reduce(
    (acc, [a, b, d]) => ({
      ...acc,
      [a]: { ...acc[a], [b]: d },
      [b]: { ...acc[b], [a]: d },
    }),
    {},
  );

const walk = (graph, current, visited = []) => {
  const routes = [];
  visited.push(current);
  if (visited.length === Object.keys(graph).length) {
    let distance = 0;
    for (let i = 1; i < visited.length; i++) {
      distance += graph[visited[i - 1]][visited[i]];
    }
    routes.push(distance);
  } else {
    for (const current in graph) {
      if (visited.includes(current)) continue;
      routes.push(...walk(graph, current, visited));
    }
  }
  visited.pop();
  return routes;
};

const prepare = compose(
  graph => Object.keys(graph).flatMap(node => walk(graph, node)),
  toGraph,
  map(
    compose(
      evolve({ 2: Number }),
      slice(1, 4),
      match(/^(.*) to (.*) = (\d+)$/),
    ),
  ),
  split('\n'),
);

const part1 = compose(reduce(min, Infinity), prepare);

const part2 = compose(reduce(max, -Infinity), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
