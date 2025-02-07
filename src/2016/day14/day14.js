import { createHash } from 'node:crypto';
import { compose, curry, identity, includes } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = identity;

const md5 = text => createHash('md5').update(text).digest('hex');
const md5Times = curry((count, text) => {
  let hash = md5(text);
  for (let i = 0; i < count; i++) {
    hash = md5(hash);
  }
  return hash;
});

const findKey64 = curry((fn, salt) => {
  const options = [];
  const results = [];
  const hashes = [];
  const count = 64;
  for (let i = 0; results.length < count; i++) {
    hashes[i] = fn(salt + i);
    const match = hashes[i].match(/(.)\1\1/);
    if (match) {
      options[i] = match[1].repeat(5);
    }
    const option = options[i - 1000];
    if (option && hashes.slice(i - 999).filter(includes(option)).length) {
      results.push(i - 1000);
    }
  }
  return results.at(-1);
});

const part1 = compose(findKey64(md5), prepare);
const part2 = compose(findKey64(md5Times(2016)), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
