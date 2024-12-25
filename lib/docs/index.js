import path from 'path';
import { readdir, readFile, writeFile, access } from 'fs/promises';
import { markdownTable } from 'markdown-table';
import {
  andThen,
  compose,
  head,
  identity,
  inc,
  includes,
  join,
  map,
  match,
  prop,
  reverse,
  times,
} from 'ramda';

const listYearsAndDays = async () => {
  const basePath = path.join(import.meta.dirname, '../../src');
  const years = await readdir(basePath);
  const days = times(compose(inc, identity), 25);
  const result = {};
  for (const directory of years) {
    const directoryPath = path.join(basePath, directory);
    const data = {};
    for (const day of days) {
      const dayDirectory = `day${day}`;
      const subpath = path.join(directoryPath, dayDirectory);
      data[dayDirectory] = { contents: '', day };
      try {
        await access(subpath);
        const [file] = await readdir(subpath).then(files =>
          files.filter(includes('js')).map(file => path.join(subpath, file)),
        );
        data[dayDirectory].file = file;
        data[dayDirectory].contents = await readFile(file, 'utf8');
      } catch (e) {
        continue;
      }
    }
    result[directory] = data;
  }
  return result;
};

const findSolvedParts = compose(
  map(compose(Number, head, match(/\d/))),
  match(/^(?!\/\/)console.*part/gm),
  prop('contents'),
);

const listSolutions = data => {
  for (const year in data) {
    for (const day in data[year]) {
      data[year][day].solutions = findSolvedParts(data[year][day]);
    }
  }
  return data;
};

const wrapInUrl = (url, text) => (url ? `[${text}](${url})` : text);

const generateMarkdownTable = compose(
  join('\n\n'),
  reverse,
  map(([year, days]) => {
    const list = Object.entries(days).reduce(
      (acc, [, { day, solutions, file }]) => {
        const url = file?.replace(/.*advent-of-code\//, '');
        return [...acc, [wrapInUrl(url, day), '⭐️'.repeat(solutions.length)]];
      },
      [['Day', 'Solutions']],
    );
    return `### ${year}\n\n` + markdownTable(list);
  }),
  Object.entries,
);

const insertMarkdown = async markdown => {
  const start = '## Table of Contents\n\n';
  const end = '---';
  const placeholder = '___placeholder___';
  const contentPattern = new RegExp(`${start}([\\S\\s]*)${end}`, 'm');
  const markdownPath = path.join(import.meta.dirname, '../../README.md');
  const originalMarkdown = await readFile(markdownPath, 'utf-8');
  const existingMarkdown = originalMarkdown.replace(
    contentPattern,
    `${start}${placeholder}\n\n${end}`,
  );
  const newMarkdown = existingMarkdown.replace(placeholder, markdown);

  return writeFile(markdownPath, newMarkdown);
};

const run = compose(
  andThen(compose(generateMarkdownTable, listSolutions)),
  listYearsAndDays,
);

await run().then(insertMarkdown);
