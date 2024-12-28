export default function (plop) {
  plop.setGenerator('aoc', {
    description: 'Advent of Code template',
    prompts: [
      { type: 'input', name: 'year', message: 'Year:' },
      { type: 'input', name: 'day', message: 'Day:' },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{year}}/day{{day}}/day{{day}}.js',
        templateFile: 'templates/dayX.js',
      },
      {
        type: 'add',
        path: 'src/{{year}}/day{{day}}/input.txt',
        template: '',
      },
    ],
  });
}
