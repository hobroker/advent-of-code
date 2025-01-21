import { compose, head, identity, match, sum } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const explode = compose(match(/([^()]+|\([^)]+\))/g));
const prepare = identity;

const part1 = compose(
  // sum,
  // map(group => {
  //   let result = '';
  //   for (let i = 0; i < group.length; i++) {
  //     const element = group[i];
  //     if (element.startsWith('(')) {
  //       const [a, b] = element.match(/\d+/g).map(Number);
  //       let sub = '';
  //       while (sub.length !== a) {
  //         const next = group[++i];
  //         if (next.startsWith('(')) {
  //           sub += next;
  //         } else {
  //           const part = next.substring(0, a - sub.length);
  //           sub += part;
  //           if (part.length < next.length) {
  //             group[i--] = next.substring(part.length);
  //           }
  //         }
  //       }
  //       result += sub.repeat(b);
  //     } else {
  //       result += element;
  //     }
  //   }
  //   return result.length;
  // }),
  string => {
    //
  },
  prepare,
);

const part2 = compose(
  sum,
  group => {
    let done = false;
    while (!done) {
      done = true;
      let result = '';
      group = explode(group);
      for (let i = 0; i < group.length; i++) {
        const element = group[i];
        if (element.startsWith('(')) {
          const [a, b] = element.match(/\d+/g).map(Number);
          let sub = '';
          while (sub.length !== a) {
            const next = group[++i];
            if (next.startsWith('(')) {
              sub += next;
              done = false;
            } else {
              const part = next.substring(0, a - sub.length);
              sub += part;
              if (part.length < next.length) {
                group[i--] = next.substring(part.length);
              }
            }
          }
          try {
            const f = sub.repeat(b);
            result += f;
          } catch (e) {
            console.log('->', [sub, b], result.length);
            throw e;
          }
        } else {
          result += element;
        }
      }
      group = result;
    }
    return group.length;
  },
  head,
  prepare,
);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
